import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import sharp from "sharp";
import {
  photoName,
} from "@/lib/catalog-store";
import { isAuthed } from "@/lib/admin-auth";
import { commitFiles, isGitHubConfigured, GitHubCommitError } from "@/lib/github-commit";

export const dynamic = "force-dynamic";

const DIR = path.join(process.cwd(), "public", "product-photos");
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
];
const MAX_BYTES = 15 * 1024 * 1024;

/**
 * Product photo intake — converts to WebP, then commits to GitHub.
 *
 * Every uploaded image is converted to WebP via sharp. In production the WebP
 * file is committed directly to the GitHub repo via the Git Data API, which
 * triggers a Vercel redeploy. In local dev it writes to the filesystem instead.
 */
export async function POST(req: Request) {
  if (!isAuthed()) {
    return NextResponse.json({ error: "Not authorised." }, { status: 401 });
  }

  const contentType = req.headers.get("content-type") ?? "";

  // Reject the client-upload JSON handshake — we no longer use Vercel Blob.
  if (contentType.includes("application/json")) {
    return NextResponse.json(
      { error: "Blob storage is not used. Photos are saved locally." },
      { status: 400 },
    );
  }

  // ── Multipart upload ─────────────────────────────────────────────────────
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
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Unsupported image type (use JPG, PNG, WebP, AVIF or GIF)." },
      { status: 415 },
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Image is larger than 15 MB." }, { status: 413 });
  }

  try {
    // Convert to WebP using sharp
    const rawBytes = new Uint8Array(await file.arrayBuffer());
    let webpBytes: Buffer;
    try {
      webpBytes = await sharp(rawBytes)
        .webp({ quality: 82 })
        .toBuffer();
    } catch (sharpErr) {
      console.error("sharp conversion failed:", sharpErr);
      return NextResponse.json(
        { error: `Image conversion failed: ${sharpErr instanceof Error ? sharpErr.message : String(sharpErr)}` },
        { status: 500 },
      );
    }

    const webpUint8 = new Uint8Array(webpBytes);
    const name = photoName(webpUint8, "webp");
    const repoPath = `public/product-photos/${name}`;
    const publicPath = `/product-photos/${name}`;

    // ── Production: commit to GitHub ───────────────────────────────────────
    if (isGitHubConfigured()) {
      try {
        await commitFiles(
          [{ path: repoPath, content: Buffer.from(webpUint8), binary: true }],
          `📸 Add product photo ${name}`,
        );
        return NextResponse.json({ path: publicPath, name, deduplicated: false });
      } catch (e) {
        if (e instanceof GitHubCommitError) {
          return NextResponse.json({ error: e.message }, { status: 502 });
        }
        console.error("GitHub commit failed (non-GitHubCommitError):", e);
        return NextResponse.json(
          { error: `GitHub commit failed: ${e instanceof Error ? e.message : String(e)}` },
          { status: 502 },
        );
      }
    }

    // ── Local dev: write to filesystem ─────────────────────────────────────
    await fs.mkdir(DIR, { recursive: true });
    const dest = path.join(DIR, name);
    let existed = true;
    try {
      await fs.access(dest);
    } catch {
      existed = false;
      await fs.writeFile(dest, webpUint8);
    }
    return NextResponse.json({ path: publicPath, name, deduplicated: existed });
  } catch (e) {
    // Top-level catch: no unhandled error should produce an opaque 500.
    console.error("Upload failed unexpectedly:", e);
    return NextResponse.json(
      { error: `Upload failed: ${e instanceof Error ? e.message : String(e)}` },
      { status: 500 },
    );
  }
}


