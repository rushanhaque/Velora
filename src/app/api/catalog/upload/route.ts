import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import {
  usingBlob,
  photoName,
  isValidPhotoPath,
  PHOTO_PREFIX,
} from "@/lib/catalog-store";
import { isAuthed } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

const DIR = path.join(process.cwd(), "public", "product-photos");
const EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/gif": "gif",
};
const ALLOWED_TYPES = Object.keys(EXT);
const MAX_BYTES = 15 * 1024 * 1024;
/**
 * Vercel caps a serverless function's *request body* at 4.5 MB. Anything larger
 * is rejected at the edge before this handler runs, so a photo sent through the
 * function can never exceed it — which is why the multipart path below is only
 * a local-dev / small-file fallback and the real path is a client upload.
 */
const FUNCTION_BODY_LIMIT = 4.5 * 1024 * 1024;

/**
 * Product photo intake. Two paths, deliberately:
 *
 *  1. **Client upload (production).** The browser hashes the file, asks this
 *     route for a scoped token, then uploads *directly* to Vercel Blob. The
 *     bytes never pass through the function, so the 4.5 MB body limit does not
 *     apply — which is what previously broke every photo over ~4.5 MB (i.e.
 *     most phone photos) with an opaque platform 413.
 *
 *  2. **Multipart (local dev, and small files).** Writes into
 *     public/product-photos so `next dev` needs no Blob store.
 *
 * Either way the filename is content-addressed — 20 hex chars of the bytes'
 * SHA-256 — so the same photo uploaded twice is stored exactly once, and the
 * URL can be cached forever because its content can never change.
 */
export async function POST(req: Request) {
  if (!isAuthed()) {
    return NextResponse.json({ error: "Not authorised." }, { status: 401 });
  }

  const contentType = req.headers.get("content-type") ?? "";

  // ── Path 1: client-upload token handshake ────────────────────────────────
  if (contentType.includes("application/json")) {
    if (!usingBlob) {
      return NextResponse.json(
        {
          error:
            "Direct uploads need a Vercel Blob store. Connect one to this project " +
            "(Storage → Create → Blob) so BLOB_READ_WRITE_TOKEN is injected.",
        },
        { status: 503 },
      );
    }

    const body = (await req.json()) as HandleUploadBody;
    try {
      const result = await handleUpload({
        body,
        request: req,
        onBeforeGenerateToken: async (pathname) => {
          // The browser proposes the pathname, so it is untrusted input. Only a
          // well-formed content-addressed photo path is allowed — this is what
          // stops `../../server.js` or any other traversal from being written.
          if (!isValidPhotoPath(pathname)) {
            throw new Error(`Rejected photo path: ${pathname}`);
          }
          return {
            allowedContentTypes: ALLOWED_TYPES,
            maximumSizeInBytes: MAX_BYTES,
            // Content-addressed names are already unique by construction; a
            // random suffix would defeat deduplication.
            addRandomSuffix: false,
            allowOverwrite: true,
          };
        },
        onUploadCompleted: async () => {
          // Nothing to do — the CMS records the returned URL in the catalogue
          // and commits it with the next publish.
        },
      });
      return NextResponse.json(result);
    } catch (e) {
      return NextResponse.json(
        { error: e instanceof Error ? e.message : "Upload authorisation failed." },
        { status: 400 },
      );
    }
  }

  // ── Path 2: multipart fallback ───────────────────────────────────────────
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Expected multipart form data." }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }
  const ext = EXT[file.type];
  if (!ext) {
    return NextResponse.json(
      { error: "Unsupported image type (use JPG, PNG, WebP, AVIF or GIF)." },
      { status: 415 },
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Image is larger than 15 MB." }, { status: 413 });
  }
  if (usingBlob && file.size > FUNCTION_BODY_LIMIT) {
    // Should be unreachable — the CMS routes anything this size through the
    // client-upload path — but say so plainly rather than letting the platform
    // return a bare 413 with no explanation.
    return NextResponse.json(
      {
        error:
          `This photo is ${(file.size / 1024 / 1024).toFixed(1)} MB. Vercel limits a request ` +
          "body to 4.5 MB, so it must be uploaded directly to Blob storage instead.",
      },
      { status: 413 },
    );
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  const name = photoName(bytes, ext);

  if (usingBlob) {
    const { put } = await import("@vercel/blob");
    const blob = await put(`${PHOTO_PREFIX}${name}`, Buffer.from(bytes), {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: file.type,
    });
    return NextResponse.json({ path: blob.url, name, deduplicated: true });
  }

  // Local dev — content-addressed, so re-uploading the same photo is a no-op.
  await fs.mkdir(DIR, { recursive: true });
  const dest = path.join(DIR, name);
  let existed = true;
  try {
    await fs.access(dest);
  } catch {
    existed = false;
    await fs.writeFile(dest, bytes);
  }
  return NextResponse.json({ path: `/product-photos/${name}`, name, deduplicated: existed });
}
