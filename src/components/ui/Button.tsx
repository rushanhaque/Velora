"use client";

import Link from "next/link";
import { useRef, type ReactNode, type MouseEvent } from "react";
import { cn } from "@/lib/utils";
import { MagneticWrap } from "@/components/motion/MagneticWrap";

type Variant = "solid" | "brass" | "outline" | "link";

interface Props {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: Variant;
  onDark?: boolean;
  magnetic?: boolean;
  arrow?: boolean;
  className?: string;
}

function Arrow() {
  return (
    <span
      aria-hidden="true"
      className="relative ml-1 inline-block h-[1em] w-[1.1em] overflow-hidden align-middle"
    >
      <span className="absolute inset-0 flex items-center transition-transform duration-500 ease-silk group-hover:translate-x-[1.4em]">
        →
      </span>
      <span className="absolute inset-0 flex -translate-x-[1.4em] items-center transition-transform duration-500 ease-silk group-hover:translate-x-0">
        →
      </span>
    </span>
  );
}

export function Button({
  children,
  href,
  onClick,
  type = "button",
  variant = "solid",
  onDark = false,
  magnetic = false,
  arrow = false,
  className,
}: Props) {
  const rippleRef = useRef<HTMLSpanElement>(null);

  const base =
    "group relative inline-flex items-center justify-center gap-1 font-sans text-[0.82rem] tracking-wide3 uppercase overflow-hidden active:scale-[0.97] transition-all duration-500 ease-silk";

  const shapes: Record<Variant, string> = {
    solid: cn(
      "burnish rounded-full px-7 py-3.5",
      onDark
        ? "bg-parchment-pale text-bitumen hover:bg-white hover:shadow-glow-brass"
        : "bg-bitumen text-parchment-pale hover:bg-bitumen-umber hover:shadow-[0_16px_40px_-12px_rgba(20,17,11,0.5)]",
    ),
    brass: cn(
      "burnish rounded-full px-7 py-3.5 text-bitumen",
      "bg-[linear-gradient(96deg,#7b5a26,#c8a765_45%,#dcc089_55%,#a77e36)] shadow-[0_10px_30px_-12px_rgba(167,126,54,0.7)] hover:shadow-[0_18px_40px_-10px_rgba(167,126,54,0.8)]",
    ),
    outline: cn(
      "rounded-full px-7 py-3.5 border",
      onDark
        ? "border-brass-leaf/35 text-parchment-pale hover:border-brass-leaf hover:bg-white/5 hover:shadow-[0_0_30px_rgba(201,174,124,0.12)]"
        : "border-bitumen/25 text-bitumen hover:border-brass hover:bg-brass/[0.04] hover:shadow-[0_0_30px_rgba(176,145,92,0.08)]",
    ),
    link: cn(
      "link-draw px-0 py-1",
      onDark ? "text-parchment-pale" : "text-bitumen",
    ),
  };

  const spawnRipple = (e: MouseEvent) => {
    if (variant === "link") return;
    const btn = (e.currentTarget as HTMLElement);
    const rect = btn.getBoundingClientRect();
    const span = document.createElement("span");
    span.className = "btn-ripple";
    span.style.left = `${e.clientX - rect.left}px`;
    span.style.top = `${e.clientY - rect.top}px`;
    btn.appendChild(span);
    setTimeout(() => span.remove(), 700);
  };

  const content = (
    <span className="relative z-[1] inline-flex items-center">
      {children}
      {arrow && <Arrow />}
    </span>
  );

  const cls = cn(base, shapes[variant], className);

  const inner = href ? (
    <Link href={href} className={cls} onClick={(e) => { spawnRipple(e); onClick?.(); }} data-cursor="link">
      {content}
    </Link>
  ) : (
    <button type={type} onClick={(e) => { spawnRipple(e); onClick?.(); }} className={cls} data-cursor="link">
      <span ref={rippleRef} />
      {content}
    </button>
  );

  if (magnetic) {
    return <MagneticWrap>{inner}</MagneticWrap>;
  }

  return inner;
}
