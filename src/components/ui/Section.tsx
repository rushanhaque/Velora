import type { ReactNode } from "react";
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
}: {
  children: ReactNode;
  className?: string;
  pad?: Pad;
  dark?: boolean;
  tint?: boolean;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={cn(
        "relative",
        PAD[pad],
        dark && "vignette bg-bitumen text-haze",
        tint && "bg-parchment-deep",
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
