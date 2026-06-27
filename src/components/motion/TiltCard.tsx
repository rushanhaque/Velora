"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * v3.0 — Simplified static card (previously 3D tilt).
 * Provides a clean scale-up on hover without wobbly mouse tracking.
 */
export function TiltCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
  glare?: boolean;
}) {
  return (
    <div
      className={cn(
        "group relative transition-transform duration-[0.8s] ease-silk hover:-translate-y-1 hover:shadow-xl",
        className
      )}
    >
      {children}
    </div>
  );
}
