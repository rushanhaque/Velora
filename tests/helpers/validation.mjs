/**
 * Server-side validation rules. Mirrors src/lib/photo-shared.ts — the browser
 * proposes these values, so they must be re-checked where it cannot reach.
 */

export const PHOTO_PATTERN = /^product-photos\/[a-f0-9]{20}\.(jpg|png|webp|avif|gif)$/;

/**
 * A photo reference is valid if it is either a bare content-addressed path or
 * an absolute Blob URL ending in one. Anything else — traversal, an arbitrary
 * filename, a scriptable extension — is refused.
 */
export function isValidPhotoPath(p) {
  if (typeof p !== "string" || !p) return false;
  if (p.includes("..") || p.includes("\\")) return false;

  if (/^https:\/\/[a-z0-9-]+\.public\.blob\.vercel-storage\.com\//.test(p)) {
    let path;
    try {
      path = new URL(p).pathname.replace(/^\/+/, "");
    } catch {
      return false;
    }
    return PHOTO_PATTERN.test(path);
  }
  return PHOTO_PATTERN.test(p);
}

/** Git/blob SHAs are exactly 40 lowercase hex characters. Nothing else. */
export function isValidSha(s) {
  return typeof s === "string" && /^[a-f0-9]{40}$/.test(s);
}
