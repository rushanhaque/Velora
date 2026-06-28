"use client";

import { useEffect, useRef } from "react";

const SILK = "cubic-bezier(0.16,1,0.3,1)";

/**
 * Plays on every route change — a quiet lift + brass thread sweep.
 * Uses pure CSS transitions (not framer-motion transform shorthands) so
 * the server-rendered style attributes match the hydration pass exactly.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const wrapRef  = useRef<HTMLDivElement>(null);
  const threadRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap   = wrapRef.current;
    const thread = threadRef.current;
    if (!wrap || !thread) return;

    requestAnimationFrame(() => {
      wrap.style.opacity   = "1";
      wrap.style.transform = "none";

      thread.style.transform = "scaleX(1)";
      thread.style.opacity   = "0";
    });
  }, []);

  return (
    <>
      <div
        ref={wrapRef}
        style={{
          opacity: 0,
          transform: "translateY(18px)",
          transition: `opacity 0.7s ${SILK}, transform 0.7s ${SILK}`,
        }}
      >
        {children}
      </div>

      {/* brass thread sweep */}
      <div
        ref={threadRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-[2px] origin-left bg-gradient-to-r from-transparent via-brass to-transparent"
        style={{
          transform: "scaleX(0)",
          opacity: 1,
          transition: `transform 0.9s ${SILK}, opacity 0.9s ${SILK}`,
        }}
      />
    </>
  );
}
