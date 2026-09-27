import { BUILD_ID } from "./build-id";
/** Mutable repository media gets a new browser/optimizer cache key per build. */
export function mediaUrl(src: string): string {
  if (src.startsWith("product-photos/")) return "/" + src;
  if (!src.startsWith("/media/")) return src;
  return src + (src.includes("?") ? "&" : "?") + "v=" + encodeURIComponent(BUILD_ID);
}
