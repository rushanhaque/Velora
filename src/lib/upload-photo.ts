"use client";

import { upload } from "@vercel/blob/client";
import { PHOTO_PREFIX } from "./photo-shared";

const EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/gif": "gif",
};

export const MAX_PHOTO_BYTES = 15 * 1024 * 1024;

/**
 * Content-addressed name for a photo: 20 hex chars of the bytes' SHA-256 plus
 * the real extension. Computed in the browser so the pathname is known before
 * the upload starts — the server then validates it against a strict pattern.
 *
 * The point of hashing rather than slugifying the filename: the same photo
 * always lands on the same path, so re-uploading it overwrites one object
 * instead of creating a second copy, and the URL's content can never change,
 * which is what makes `immutable` caching safe.
 */
export async function photoPathFor(file: File): Promise<string> {
  const ext = EXT[file.type];
  if (!ext) throw new Error("Unsupported image type (use JPG, PNG, WebP, AVIF or GIF).");
  const digest = await crypto.subtle.digest("SHA-256", await file.arrayBuffer());
  const hash = Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 20);
  return `${PHOTO_PREFIX}${hash}.${ext}`;
}

export interface UploadResult {
  url: string;
  /** True when the bytes already existed under this hash. */
  deduplicated: boolean;
}

/**
 * Upload one product photo and return its public URL.
 *
 * Prefers a **direct browser → Blob** upload. Vercel caps a serverless
 * function's request body at 4.5 MB, so routing photos through the API (which
 * is what this used to do) meant anything larger — most photos straight off a
 * phone — was killed at the edge with an opaque 413 before any of our code ran.
 * A client upload sends the bytes straight to Blob storage and the function
 * only mints a scoped token, so the limit does not apply.
 *
 * Falls back to the multipart route when no Blob store is configured, which is
 * the normal case in local development.
 */
export async function uploadPhoto(file: File): Promise<UploadResult> {
  if (file.size > MAX_PHOTO_BYTES) {
    throw new Error(
      `"${file.name}" is ${(file.size / 1024 / 1024).toFixed(1)} MB — the limit is 15 MB. ` +
        "Please resize it and try again.",
    );
  }

  const pathname = await photoPathFor(file);

  try {
    const blob = await upload(pathname, file, {
      access: "public",
      handleUploadUrl: "/api/catalog/upload",
      contentType: file.type,
    });
    return { url: blob.url, deduplicated: false };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    // No Blob store connected — fall through to the multipart route, which
    // works locally. Any other failure is real and must surface to the admin.
    if (!/Blob store|BLOB_READ_WRITE_TOKEN|503/i.test(msg)) {
      throw new Error(`Could not upload "${file.name}": ${msg}`);
    }
  }

  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("/api/catalog/upload", { method: "POST", body: fd });
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(body.error || `Upload of "${file.name}" failed (${res.status}).`);
  }
  const data = (await res.json()) as { path: string; deduplicated?: boolean };
  return { url: data.path, deduplicated: Boolean(data.deduplicated) };
}
