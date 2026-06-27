import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

/** The Velora mark — a raised diamond plate with a chased V. */
export function Mark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={cn(className)} aria-hidden="true">
      <defs>
        <linearGradient id="mark-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#dcc089" />
          <stop offset="50%" stopColor="#a77e36" />
          <stop offset="100%" stopColor="#7b5a26" />
        </linearGradient>
      </defs>
      <rect
        x="24"
        y="2"
        width="31.1"
        height="31.1"
        transform="rotate(45 24 2)"
        fill="none"
        stroke="url(#mark-grad)"
        strokeWidth="1.4"
      />
      <path
        d="M16 17 L24 33 L32 17"
        fill="none"
        stroke="url(#mark-grad)"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Wordmark({
  className,
  variant = "dark",
}: {
  className?: string;
  variant?: "dark" | "light";
}) {
  return (
    <span
      className={cn(
        "font-display leading-none tracking-[0.34em]",
        variant === "light" ? "text-parchment-pale" : "text-bitumen",
        className,
      )}
      style={{ fontWeight: 600 }}
    >
      VELORA
    </span>
  );
}

export function Logo({
  variant = "dark",
  className,
  subtitleStyle,
  animated = false,
}: {
  variant?: "dark" | "light";
  className?: string;
  /** Optional style on the "International" subtitle — used by the hero to fade it in on dock. */
  subtitleStyle?: CSSProperties;
  /** Hero treatment: VELORA fills left→right on entrance, with a glint on hover. */
  animated?: boolean;
}) {
  return (
    <span className={cn("relative inline-grid justify-items-center leading-none", className)}>
      {/* Negative end-margin cancels the trailing letter-spacing so VELORA centres true. */}
      {animated ? (
        <span className="vel-hero relative inline-grid font-display text-[1.6rem] font-semibold leading-none tracking-[0.34em] text-bitumen [margin-inline-end:-0.34em]">
          <span>VELORA</span>
          <span className="vel-hero-sheen" aria-hidden="true">
            VELORA
          </span>
        </span>
      ) : (
        <Wordmark variant={variant} className="text-[1.6rem] [margin-inline-end:-0.34em]" />
      )}
      {/* "International" spans the wordmark's exact width — edges perfectly aligned. */}
      <span
        style={subtitleStyle}
        className={cn(
          "mt-[3px] flex w-full justify-between font-sans text-[0.5rem] font-medium",
          variant === "light" ? "text-haze" : "text-ash",
        )}
      >
        {"INTERNATIONAL".split("").map((ch, i) => (
          <span key={i}>{ch}</span>
        ))}
      </span>
    </span>
  );
}
