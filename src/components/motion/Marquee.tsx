"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Seamless infinite ticker. Two copies; the track shifts -50%.
 *  The animation only runs while the marquee is actually on screen —
 *  offscreen tickers otherwise composite every frame for nothing. */
export function Marquee({
  items,
  className,
  itemClassName,
  duration = 42,
  reverse = false,
  separator = "✦",
  label,
}: {
  items: ReactNode[];
  className?: string;
  itemClassName?: string;
  duration?: number;
  reverse?: boolean;
  separator?: ReactNode;
  /** When set, the marquee content carries real meaning — expose one copy to AT. */
  label?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [onScreen, setOnScreen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => setOnScreen(e.isIntersecting),
      { rootMargin: "120px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const Row = (hidden: boolean) => (
    <div
      className={cn(
        "flex shrink-0 items-center",
        reverse ? "animate-marqueeRev" : "animate-marquee",
      )}
      style={{
        ["--marquee-dur" as string]: `${duration}s`,
        animationPlayState: onScreen ? "running" : "paused",
      }}
      aria-hidden={hidden ? "true" : undefined}
    >
      {items.map((it, i) => (
        <span key={i} className={cn("flex items-center", itemClassName)}>
          <span>{it}</span>
          <span className="mx-7 text-brass/60 sm:mx-10">{separator}</span>
        </span>
      ))}
    </div>
  );

  return (
    <div
      ref={ref}
      className={cn("marquee-mask flex w-full overflow-hidden", className)}
      role={label ? "group" : undefined}
      aria-label={label}
    >
      {Row(!label)}
      {Row(true)}
    </div>
  );
}
