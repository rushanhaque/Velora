"use client";

import { useEffect, useRef, useState } from "react";

/**
 * v3.0 — Custom brass cursor. A refined dot that morphs into an
 * outlined ring on interactive elements. Hidden on touch devices.
 */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: -100, y: -100 });
  const target = useRef({ x: -100, y: -100 });
  const [state, setState] = useState<"default" | "link" | "down">("default");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only show on non-touch devices with fine pointer
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!mq.matches) return;

    document.documentElement.classList.add("has-cursor");

    const onMove = (e: MouseEvent) => {
      target.current = { x: e.clientX, y: e.clientY };
      if (!visible) setVisible(true);
    };

    const onDown = () => setState("down");
    const onUp = () => setState((s) => (s === "down" ? "default" : s));

    const onOver = (e: MouseEvent) => {
      const el = (e.target as HTMLElement)?.closest?.(
        "a, button, [data-cursor='link'], input, textarea, select, summary, [role='button']"
      );
      if (el) setState("link");
    };
    const onOut = (e: MouseEvent) => {
      const el = (e.target as HTMLElement)?.closest?.(
        "a, button, [data-cursor='link'], input, textarea, select, summary, [role='button']"
      );
      if (el) setState("default");
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.addEventListener("mouseover", onOver, { passive: true });
    document.addEventListener("mouseout", onOut, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);

    // Spring-dampened RAF loop
    let raf: number;
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const tick = () => {
      pos.current.x = lerp(pos.current.x, target.current.x, 0.15);
      pos.current.y = lerp(pos.current.y, target.current.y, 0.15);
      if (dot.current) {
        const el = dot.current;
        const s = el.offsetWidth;
        el.style.transform = `translate3d(${pos.current.x - s / 2}px, ${pos.current.y - s / 2}px, 0)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
      document.documentElement.classList.remove("has-cursor");
    };
  }, [visible]);

  return (
    <div
      ref={dot}
      className="cursor-dot"
      data-state={state}
      style={{ opacity: visible ? 1 : 0 }}
      aria-hidden="true"
    />
  );
}
