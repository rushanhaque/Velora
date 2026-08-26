/**
 * Photo naming rules shared by the browser and the server.
 *
 * Kept in its own module because catalog-store.ts is marked `server-only` and
 * therefore cannot be imported from the CMS's client code — but both sides must
 * agree exactly on the path format, since the browser proposes a pathname and
 * the server validates it before minting an upload token.
 */

/** Directory (Blob prefix) holding every product photo. */
export const PHOTO_PREFIX = "product-photos/";

/**
 * The only shape a photo path may take: 20 hex chars of SHA-256 plus a real
 * image extension. Anything else — a traversal attempt, an arbitrary filename,
 * a path outside this prefix — is rejected server-side.
 */
export const PHOTO_PATTERN = /^product-photos\/[a-f0-9]{20}\.(jpg|png|webp|avif|gif)$/;

/**
 * Reject anything that is not a well-formed photo reference.
 *
 * Accepts a bare content-addressed path, or the absolute Blob URL an upload
 * returns (whose pathname must still match the pattern). Rejects traversal,
 * backslashes, arbitrary filenames and scriptable extensions such as .svg.
 */
export function isValidPhotoPath(p: string): boolean {
  if (typeof p !== "string" || !p) return false;
  if (p.includes("..") || p.includes("\\")) return false;

  if (/^https:\/\/[a-z0-9-]+\.public\.blob\.vercel-storage\.com\//.test(p)) {
    try {
      return PHOTO_PATTERN.test(new URL(p).pathname.replace(/^\/+/, ""));
    } catch {
      return false;
    }
  }
  return PHOTO_PATTERN.test(p);
}

/**
 * Photos that shipped with the repository, referenced by hand in data.ts. These
 * predate content addressing and are legitimate — but only under /media/, and
 * still never with traversal.
 */
export function isRepoMediaPath(p: string): boolean {
  return typeof p === "string" && /^\/media\/[\w./-]+$/.test(p) && !p.includes("..");
}

/** Blob/git SHAs are 40 lowercase hex chars — nothing else is accepted. */
export function isValidSha(s: string): boolean {
  return /^[a-f0-9]{40}$/.test(s);
}
