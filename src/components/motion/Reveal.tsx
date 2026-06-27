"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type RevealVariant = "rise" | "blur" | "scale" | "slide-left" | "slide-right";

/**
 * v3.0 — Lightweight IntersectionObserver reveal with variant support.
 * Drives the `[data-reveal]` CSS in globals.
 *   - rise: default translateY
 *   - blur: starts blurred + slightly scaled down
 *   - scale: scales from 0.92
 *   - slide-left/right: horizontal slide
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 26,
  once = true,
  amount = 0.18,
  variant = "rise",
  style,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  once?: boolean;
  amount?: number;
  variant?: RevealVariant;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            el.classList.add("is-in");
            if (once) io.unobserve(el);
          } else if (!once) {
            el.classList.remove("is-in");
          }
        });
      },
      { threshold: amount, rootMargin: "0px 0px -7% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [once, amount]);

  return (
    <div
      ref={ref}
      data-reveal={variant === "rise" ? "" : variant}
      className={className}
      style={{
        transitionDelay: `${delay}ms`,
        ...(variant === "rise" ? { ["--rev-y" as string]: `${y}px` } : {}),
        ...style,
      }}
    >
      {children}
    </div>
  );
}
