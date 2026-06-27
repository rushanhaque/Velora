"use client";

import Link from "next/link";
import { useEnquiry } from "@/lib/enquiry";

export function CartFloat() {
  const items = useEnquiry();
  if (items.length === 0) return null;

  return (
    <Link
      href="/cart"
      data-cart-float
      aria-label={`Cart — ${items.length} ${items.length === 1 ? "piece" : "pieces"}`}
      className="fixed right-5 bottom-[max(1.25rem,env(safe-area-inset-bottom))] z-[100] flex h-14 w-14 items-center justify-center rounded-full border border-brass/30 bg-bitumen text-parchment-pale shadow-[0_8px_32px_rgba(0,0,0,0.45)] backdrop-blur transition-all duration-500 hover:border-brass hover:shadow-[0_8px_32px_rgba(0,0,0,0.5),0_0_28px_rgba(176,145,92,0.22)] active:scale-95 sm:right-8 sm:bottom-8 sm:h-[52px] sm:w-[52px]"
    >
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5 sm:h-[18px] sm:w-[18px]"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
      <span className="absolute -right-1 -top-1 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-brass px-1 text-[0.55rem] font-semibold text-bitumen">
        {items.length}
      </span>
    </Link>
  );
}
