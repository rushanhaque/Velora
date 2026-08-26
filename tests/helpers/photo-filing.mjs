import { createHash } from "node:crypto";

export const MAX_PHOTO_BYTES = 15 * 1024 * 1024;

/** Content-addressed name: 20 hex chars of SHA-256 + the real extension. */
export function photoName(bytes, ext) {
  return `${createHash("sha256").update(bytes).digest("hex").slice(0, 20)}.${ext}`;
}

/**
 * File every pending photo and rewrite the catalogue to point at the results.
 *
 * Deduplication falls straight out of content addressing: two identical files
 * hash to the same name, so the second upload is skipped and both products
 * reference one object.
 *
 * When no uploader is available the catalogue is returned untouched and
 * `degraded` is set — the admin keeps their inline preview instead of losing
 * the photo entirely.
 */
export async function filePhotos({ catalogue, pending = [], upload = null }) {
  const next = JSON.parse(JSON.stringify(catalogue));

  for (const p of pending) {
    if (p.bytes.length > MAX_PHOTO_BYTES) {
      throw new Error(
        `Photo for "${p.slug}" is ${(p.bytes.length / 1024 / 1024).toFixed(1)} MB — the limit is 15 MB.`,
      );
    }
  }

  if (!upload) {
    return { catalogue: next, uploaded: 0, deduplicated: 0, degraded: true };
  }

  const seen = new Map();
  let uploaded = 0;
  let deduplicated = 0;

  for (const p of pending) {
    const name = photoName(p.bytes, p.ext);
    let url = seen.get(name);
    if (url === undefined) {
      url = await upload(p.bytes, p.ext);
      seen.set(name, url);
      uploaded += 1;
    } else {
      deduplicated += 1;
    }

    if (p.kind === "collection") {
      const c = next.collections.find((x) => x.slug === p.slug);
      if (c) c.cover = url;
    } else {
      const s = next.specimens.find((x) => x.slug === p.slug);
      if (s) s.image = url;
    }
  }

  return { catalogue: next, uploaded, deduplicated, degraded: false };
}
