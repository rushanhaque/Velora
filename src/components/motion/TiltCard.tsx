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
  // The inner .depth-card handles the hover lift + its own rounded shadow.
  // This wrapper stays a passthrough so no sharp-cornered rectangle shows behind the card.
  return (
    <div className={cn("group relative", className)}>
      {children}
    </div>
  );
}
