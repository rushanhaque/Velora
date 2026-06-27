import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Pad = "sm" | "md" | "lg" | "xl";

const PAD: Record<Pad, string> = {
  sm: "py-[clamp(40px,6vw,72px)]",
  md: "py-[clamp(56px,8vw,104px)]",
  lg: "py-[clamp(72px,10vw,150px)]",
  xl: "py-[clamp(90px,12vw,180px)]",
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
