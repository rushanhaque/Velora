"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * Resets scroll to the top on every route change. The site drives scrolling
 * through Lenis (window.__lenis), which keeps its own offset and RAF loop and
 * therefore overrides Next's default scroll-to-top — so without this you land
 * wherever the previous page left you (mid-page or at the bottom).
 *
 * Keyed on pathname + search so it also fires when only the query changes,
 * e.g. switching collections at /collections?house=lighting → ?house=decor.
 *
 * Must be rendered inside a <Suspense> boundary because it reads
 * useSearchParams().
 */
export function ScrollReset() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const key = `${pathname}?${searchParams.toString()}`;

  useEffect(() => {
    const lenis = (window as unknown as {
      __lenis?: { scrollTo: (t: number, o?: object) => void };
    }).__lenis;

    if (lenis) {
      // immediate + force: jump instantly, even if Lenis is momentarily stopped
      lenis.scrollTo(0, { immediate: true, force: true });
    }
    // Belt-and-braces for reduced-motion visitors (Lenis disabled) and to keep
    // the native scroll position in sync.
    window.scrollTo(0, 0);
  }, [key]);

  return null;
}
