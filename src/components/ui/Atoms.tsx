import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function Eyebrow({
  children,
  className,
  tone = "brass",
}: {
  children: ReactNode;
  className?: string;
  tone?: "brass" | "haze" | "stone";
}) {
  const color =
    tone === "haze" ? "text-haze" : tone === "stone" ? "text-stone" : "text-brass-deep";
  return (
    <span className={cn("eyebrow inline-flex items-center gap-3", color, className)}>
      <span className="h-px w-7 bg-current opacity-50" aria-hidden />
      {children}
    </span>
  );
}

export function Kicker({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <span className={cn("eyebrow text-brass-deep", className)}>{children}</span>;
}

/** Section index numeral, engraved at the corner of a block. */
export function Index({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn("numeral text-brass/30 text-[clamp(2.4rem,5vw,4rem)]", className)}>
      {children}
    </span>
  );
}

export function Rule({ className, dark = false }: { className?: string; dark?: boolean }) {
  return <div className={cn("hairline", dark && "hairline--dark", className)} />;
}

export function Pill({
  children,
  className,
  dark = false,
}: {
  children: ReactNode;
  className?: string;
  dark?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[0.66rem] uppercase tracking-wider2",
        dark
          ? "border-brass-leaf/25 text-haze"
          : "border-line text-stone",
        className,
      )}
    >
      {children}
    </span>
  );
}
