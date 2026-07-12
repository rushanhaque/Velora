"use client";

import { enquiry, useInEnquiry } from "@/lib/enquiry";
import { cn } from "@/lib/utils";

/** Small +/✓ control to add a piece to the cart from a grid. */
export function EnquiryToggle({
  slug,
  name,
  className,
}: {
  slug: string;
  name: string;
  className?: string;
}) {
  const inList = useInEnquiry(slug);

  return (
    <button
      type="button"
      aria-label={inList ? `Remove ${name} from cart` : `Add ${name} to cart`}
      aria-pressed={inList}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        enquiry.toggle(slug);
      }}
      className={cn(
        "grid h-10 w-10 place-items-center rounded-full border backdrop-blur transition-all duration-500 ease-silk sm:h-9 sm:w-9",
        inList
          ? "border-brass bg-brass text-bitumen"
          : "border-line bg-parchment-pale/70 text-stone hover:border-brass hover:text-bitumen",
        className,
      )}
    >
      <span className="sr-only">{inList ? "In cart" : "Add to cart"}</span>
      {/* key remount strikes the icon in on every state change */}
      <span key={String(inList)} className="animate-scale-in grid place-items-center">
        {inList ? (
          <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
            <path d="M5 12l5 5L19 7" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
            <path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
        )}
      </span>
    </button>
  );
}
