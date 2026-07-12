/**
 * True when the client is in "lite" mode — a low-end device (set via the
 * <html class="lite"> detection in the root layout) or a visitor who prefers
 * reduced motion. Reveal/scroll components use this to skip their observers and
 * simply show content, avoiding needless per-element work on weak hardware.
 *
 * SSR-safe: returns false on the server (content then reveals normally on
 * capable clients after hydration).
 */
export function prefersLite(): boolean {
  if (typeof document === "undefined") return false;
  if (document.documentElement.classList.contains("lite")) return true;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
