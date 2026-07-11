"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * The maison's signature heading reveal — each line rises out of a
 * clip-mask, settling on the house easing. Driven by IntersectionObserver
 * + CSS (see `.mask-*` in globals) so it triggers reliably everywhere.
 */
export function MaskText({
  lines,
  as = "h2",
  className,
  lineClassName,
  delay = 0,
  step = 30,
  once = true,
}: {
  lines: ReactNode[];
  as?: ElementType;
  className?: string;
  lineClassName?: string;
  delay?: number;
  step?: number;
  once?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);

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
      { threshold: 0.2, rootMargin: "0px 0px -6% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [once]);

  const Tag = as;
  const label = lines
    .map((l) => (typeof l === "string" ? l : ""))
    .join(" ")
    .trim();

  return (
    <Tag ref={ref as never} className={cn("mask-text", className)} aria-label={label || undefined}>
      {lines.map((ln, i) => (
        <span key={i} className="mask-line" aria-hidden="true">
          <span
            className={cn("mask-inner", lineClassName)}
            // No base delay — only the tiny per-line cascade that makes the
            // mask effect read as lines, kept short enough to feel instant.
            style={{ transitionDelay: `${i * step}ms` }}
          >
            {ln}
          </span>
        </span>
      ))}
    </Tag>
  );
}
