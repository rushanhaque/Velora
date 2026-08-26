import type { ReactNode, CSSProperties } from "react";
import { cn } from "@/lib/utils";

type Pad = "sm" | "md" | "lg" | "xl";

const PAD: Record<Pad, string> = {
  sm: "py-[clamp(28px,4vw,52px)]",
  md: "py-[clamp(40px,5.5vw,76px)]",
  lg: "py-[clamp(52px,7vw,104px)]",
  xl: "py-[clamp(64px,8.5vw,128px)]",
};

export function Section({
  children,
  className,
  pad = "lg",
  dark = false,
  tint = false,
  id,
  defer = false,
  intrinsicHeight,
}: {
  children: ReactNode;
  className?: string;
  pad?: Pad;
  dark?: boolean;
  tint?: boolean;
  id?: string;
  /**
   * Skip style, layout and paint for this section while it is far off-screen
   * (see `[data-defer]` in globals.css). Only for sections below the fold —
   * anything visible on load must render immediately.
   */
  defer?: boolean;
  /** Assumed height while skipped. Keeps the scrollbar stable; prevents CLS. */
  intrinsicHeight?: number;
}) {
  return (
    <section
      id={id}
      data-defer={defer ? "" : undefined}
      style={
        defer && intrinsicHeight
          ? ({ containIntrinsicSize: `auto ${intrinsicHeight}px` } as CSSProperties)
          : undefined
      }
      className={cn(
        "relative",
        PAD[pad],
        dark && "vignette border-t border-brass-leaf/10 bg-bitumen text-haze",
        tint &&
          "border-y border-line/70 bg-[radial-gradient(90%_70%_at_50%_0%,rgba(200,167,101,0.08),transparent_55%),linear-gradient(180deg,#EAE4D6_0%,#E4DECF_100%)]",
        className,
      )}
    >
      {children}
    </section>
  );
}

export function Shell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("shell", className)}>{children}</div>;
}
