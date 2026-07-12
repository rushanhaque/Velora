"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SILK } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * A minimal "Contact developer" chip anchored to the footer's bottom-right.
 * Clicking it opens a small colophon popover (also bottom-right, springing up
 * from the chip) crediting the build and linking out for support.
 */
export function ContactDeveloper() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="absolute bottom-5 left-5 z-30 sm:bottom-6 sm:left-6">
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label="Developer credit"
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.96 }}
            transition={{ duration: 0.35, ease: SILK }}
            className="absolute bottom-full left-0 mb-3 w-[min(82vw,296px)] origin-bottom-left overflow-hidden rounded-xl2 border border-brass/20 bg-bitumen-ink/95 p-5 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.85)] backdrop-blur"
          >
            {/* warm corner glow */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-6 -top-8 h-24 w-24 rounded-full opacity-30 blur-2xl"
              style={{ background: "radial-gradient(circle, rgba(200,167,101,0.5), transparent 70%)" }}
            />
            <p className="eyebrow relative text-brass-leaf">Colophon</p>
            <p className="relative mt-3 text-[0.82rem] leading-relaxed text-haze">
              This site was designed &amp; developed by{" "}
              <span className="text-parchment-pale">Rushan Haque</span>.
            </p>
            <p className="relative mt-2 text-[0.82rem] leading-relaxed text-haze">
              For assistance &amp; support, visit{" "}
              <a
                href="https://www.rushanhaque.online"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brass-leaf underline decoration-brass/40 underline-offset-2 transition-colors duration-300 hover:text-brass-gilt"
              >
                www.rushanhaque.online
              </a>
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="group inline-flex items-center gap-2 rounded-full bg-bitumen/40 px-4 py-2 text-[0.6rem] uppercase tracking-wider2 text-ash backdrop-blur transition-colors duration-500 hover:text-brass-leaf"
      >
        <span
          aria-hidden="true"
          className={cn(
            "h-1.5 w-1.5 rounded-full bg-brass/50 transition-colors duration-500 group-hover:bg-brass-leaf",
            open && "bg-brass-leaf",
          )}
        />
        Contact developer
      </button>
    </div>
  );
}
