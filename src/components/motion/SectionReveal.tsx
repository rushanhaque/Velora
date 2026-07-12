"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { prefersLite } from "@/lib/perf";

type SectionRevealVariant = "rise" | "slide-left" | "slide-right" | "fade" | "scale";

export function SectionReveal({
  children,
  variant = "rise",
}: {
  children: ReactNode;
  variant?: SectionRevealVariant;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersLite()) {
      el.classList.add("is-in");
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-in");
          io.unobserve(el);
        }
      },
      { threshold: 0.05, rootMargin: "0px 0px -4% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} data-section-reveal={variant === "rise" ? "" : variant}>
      {children}
    </div>
  );
}
