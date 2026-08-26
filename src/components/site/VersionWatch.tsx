"use client";

import { useEffect } from "react";
import { BUILD_ID, RELOAD_GUARD_KEY, ADMIN_DIRTY_KEY } from "@/lib/build-id";

/** Don't hammer the endpoint — one check per this many ms at most. */
const MIN_INTERVAL_MS = 30_000;
/** Background heartbeat for a tab left open on a screen all day. */
const POLL_MS = 5 * 60_000;

/**
 * Keeps every browser on the current deploy.
 *
 * A device can hold old JavaScript or old HTML for a very long time: bfcache
 * restores a whole frozen page on back/forward, a phone can keep a tab
 * suspended for days, and a CDN edge can serve a cached document to a user who
 * never hard-refreshes. Watching only `load` misses all three, so this also
 * re-checks on `visibilitychange`, `focus` and `pageshow` — the three moments a
 * stale tab actually comes back in front of a human.
 *
 * Safety rails:
 *  • One reload per build ID, recorded in sessionStorage. If the reload somehow
 *    lands on the same old bundle we stop rather than spin in a refresh loop.
 *  • Never reloads while the CMS holds unpublished edits — blowing away an
 *    admin's unsaved work to pick up a new bundle is a bad trade.
 *  • Inert in development, where `BUILD_ID` is "dev" and HMR already handles it.
 */
export function VersionWatch() {
  useEffect(() => {
    if (BUILD_ID === "dev") return;

    let last = 0;
    let stopped = false;

    const adminIsEditing = () => {
      try {
        return window.localStorage.getItem(ADMIN_DIRTY_KEY) === "1";
      } catch {
        // Private mode / storage disabled — assume not editing rather than
        // permanently disabling the freshness check.
        return false;
      }
    };

    const alreadyReloadedFor = (id: string) => {
      try {
        return window.sessionStorage.getItem(RELOAD_GUARD_KEY) === id;
      } catch {
        // Without sessionStorage we cannot guarantee loop safety, so decline to
        // reload at all. A stale tab is better than an infinite refresh.
        return true;
      }
    };

    const check = async () => {
      if (stopped || document.visibilityState === "hidden") return;
      const now = Date.now();
      if (now - last < MIN_INTERVAL_MS) return;
      last = now;

      if (adminIsEditing()) return;

      try {
        const res = await fetch("/version.json", {
          cache: "no-store",
          headers: { "Cache-Control": "no-cache" },
        });
        if (!res.ok) return;
        const { buildId } = (await res.json()) as { buildId?: string };
        if (!buildId || buildId === BUILD_ID) return;
        if (alreadyReloadedFor(buildId)) return;

        try {
          window.sessionStorage.setItem(RELOAD_GUARD_KEY, buildId);
        } catch {
          return;
        }
        stopped = true;
        // `replace` rather than `reload` so the stale document does not stay in
        // the history stack for the back button to resurrect.
        window.location.replace(window.location.href);
      } catch {
        // Offline or endpoint unreachable — try again on the next signal.
      }
    };

    const onPageShow = (e: PageTransitionEvent) => {
      // persisted === true means this document came back from bfcache: the JS
      // heap was frozen whole, so `load` never fires and nothing else would
      // notice that a deploy happened in the meantime.
      if (e.persisted) last = 0;
      void check();
    };
    const onVisible = () => {
      if (document.visibilityState === "visible") void check();
    };

    window.addEventListener("pageshow", onPageShow);
    window.addEventListener("focus", check);
    document.addEventListener("visibilitychange", onVisible);
    const timer = window.setInterval(check, POLL_MS);

    // First check is deferred so it never competes with the initial render.
    const kick = window.setTimeout(check, 2_000);

    return () => {
      stopped = true;
      window.clearInterval(timer);
      window.clearTimeout(kick);
      window.removeEventListener("pageshow", onPageShow);
      window.removeEventListener("focus", check);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  return null;
}
