"use client";

export const MAX_PHOTO_BYTES = 15 * 1024 * 1024;

export interface UploadResult {
  url: string;
  /** True when the bytes already existed under this hash. */
  deduplicated: boolean;
}

/**
 * Upload one product photo and return its public URL.
 *
 * Sends the file as multipart form data to the server, which converts it to
 * WebP via sharp and saves it to public/product-photos/. No Vercel Blob
 * storage needed — photos are committed to git and served statically.
 */
export async function uploadPhoto(file: File): Promise<UploadResult> {
  if (file.size > MAX_PHOTO_BYTES) {
    throw new Error(
      `"${file.name}" is ${(file.size / 1024 / 1024).toFixed(1)} MB — the limit is 15 MB. ` +
        "Please resize it and try again.",
    );
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

