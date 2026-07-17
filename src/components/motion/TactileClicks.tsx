"use client";

import { useEffect } from "react";

/**
 * Site-wide tactile "click" micro-interaction.
 *
 * A soft brass ripple blooms from the pointer whenever an interactive control
 * is pressed. It is deliberately near-free:
 *   · ONE passive, delegated `pointerdown` listener (not one per element)
 *   · the ripple is a single fixed-position node appended to <body>, so it
 *     never affects any element's layout, and it removes itself on animationend
 *   · it animates transform + opacity only (compositor / GPU)
 *   · it no-ops under prefers-reduced-motion and on lite (low-end) devices
 * Buttons keep their own contained ripple and are skipped via [data-ripple-self].
 */
const INTERACTIVE = 'a[href], button, [role="button"], summary, [data-tap]';

export function TactileClicks() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const root = document.documentElement;

    const onDown = (e: PointerEvent) => {
      if (e.button !== 0) return; // primary button / touch only
      if (root.classList.contains("lite")) return; // low-end → skip
      const target = e.target as Element | null;
      const hit = target?.closest?.(INTERACTIVE) as HTMLElement | null;
      if (!hit) return;
      if (hit.closest("[data-ripple-self]")) return; // Button owns its ripple
      if (
        (hit as HTMLButtonElement).disabled ||
        hit.getAttribute("aria-disabled") === "true"
      )
        return;

      const r = document.createElement("span");
      r.className = "click-ripple";
      r.style.left = `${e.clientX}px`;
      r.style.top = `${e.clientY}px`;
      document.body.appendChild(r);
      r.addEventListener("animationend", () => r.remove(), { once: true });
    };

    document.addEventListener("pointerdown", onDown, { passive: true });
    return () => document.removeEventListener("pointerdown", onDown);
  }, []);

  return null;
}
