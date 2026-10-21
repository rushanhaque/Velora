"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { SILK } from "@/lib/motion";
import { cn } from "@/lib/utils";

const SITE_URL = "https://rushanhaque.in";

/**
 * A small "Contact developer" chip anchored to the footer's bottom-right.
 * Clicking it opens a centred liquid-glass dialog crediting the build and
 * linking to the developer's site.
 */
export function ContactDeveloper() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <div className="absolute bottom-5 right-5 z-30 sm:bottom-6 sm:right-6">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={open}
          className="group inline-flex items-center gap-2 rounded-full bg-bitumen/40 px-4 py-2 text-[0.6rem] uppercase tracking-wider2 text-ash backdrop-blur transition-colors duration-500 hover:text-brass-leaf"
        >
          <span
            aria-hidden="true"
            className="h-1.5 w-1.5 rounded-full bg-brass/50 transition-colors duration-500 group-hover:bg-brass-leaf"
          />
          Contact developer
        </button>
      </div>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                className="fixed inset-0 z-[200] grid place-items-center p-5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: SILK }}
              >
                {/* backdrop */}
                <div
                  aria-hidden="true"
                  onClick={() => setOpen(false)}
                  className="absolute inset-0 bg-black/45 backdrop-blur-md"
                />

                {/* floating colour orbs seen through the glass */}
                <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
                  <motion.div
                    className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-[120%] -translate-y-[90%] rounded-full blur-3xl"
                    style={{ background: "radial-gradient(circle, rgba(200,167,101,0.55), transparent 70%)" }}
                    animate={{ x: [0, 24, -10, 0], y: [0, -18, 14, 0] }}
                    transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <motion.div
                    className="absolute left-1/2 top-1/2 h-56 w-56 -translate-y-[10%] translate-x-[10%] rounded-full blur-3xl"
                    style={{ background: "radial-gradient(circle, rgba(120,150,255,0.35), transparent 70%)" }}
                    animate={{ x: [0, -20, 12, 0], y: [0, 16, -12, 0] }}
                    transition={{ duration: 17, repeat: Infinity, ease: "easeInOut" }}
                  />
                </div>

                <motion.div
                  role="dialog"
                  aria-modal="true"
                  aria-label="Developer credit"
                  initial={{ opacity: 0, y: 24, scale: 0.94 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 16, scale: 0.96 }}
                  transition={{ duration: 0.5, ease: SILK }}
                  className="relative w-full max-w-[400px] overflow-hidden rounded-[28px] p-8 text-center sm:p-10"
                  style={{
                    background:
                      "linear-gradient(145deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.06) 45%, rgba(255,255,255,0.12) 100%)",
                    backdropFilter: "blur(28px) saturate(180%)",
                    WebkitBackdropFilter: "blur(28px) saturate(180%)",
                    border: "1px solid rgba(255,255,255,0.28)",
                    boxShadow:
                      "0 30px 80px -20px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.55), inset 0 -1px 0 rgba(255,255,255,0.08), inset 0 0 30px rgba(255,255,255,0.05)",
                  }}
                >
                  {/* specular highlight sweep */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -left-1/4 -top-1/2 h-full w-[150%] rotate-[-18deg] opacity-60"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(255,255,255,0.22), rgba(255,255,255,0) 40%)",
                    }}
                  />

                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    aria-label="Close"
                    className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full border border-white/25 bg-white/10 text-parchment-pale/80 transition-colors duration-300 hover:bg-white/20 hover:text-white"
                  >
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M6 6l12 12M18 6L6 18" />
                    </svg>
                  </button>

                  <p className="eyebrow relative text-brass-leaf">Colophon</p>
                  <p className="relative mt-5 font-display text-[1.45rem] leading-snug text-white">
                    Designed &amp; developed by <span className="text-brass-leaf">Rushan Haque</span>
                  </p>
                  <p className="relative mt-4 text-[0.85rem] leading-relaxed text-white/75">
                    This website is designed and developed by Rushan Haque. To connect, visit
                  </p>

                  <a
                    href={SITE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "group relative mt-6 inline-flex items-center gap-2 rounded-full px-6 py-3 text-[0.72rem] uppercase tracking-wider2 text-white",
                      "border border-white/30 bg-white/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] backdrop-blur transition-all duration-500 hover:bg-white/25 hover:shadow-[0_0_30px_rgba(200,167,101,0.45),inset_0_1px_0_rgba(255,255,255,0.6)]",
                    )}
                  >
                    rushanhaque.in
                    <span aria-hidden="true" className="transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                      ↗
                    </span>
                  </a>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
