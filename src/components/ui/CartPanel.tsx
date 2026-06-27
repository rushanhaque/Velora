"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cartPanel, useCartPanel, enquiry, useEnquiry } from "@/lib/enquiry";
import { getSpecimen, BRAND, hasMedia } from "@/lib/data";
import { Specimen as SpecimenArt } from "@/components/visual/Specimen";
import { SpecimenMedia } from "@/components/visual/SpecimenMedia";
import { SILK } from "@/lib/motion";

export function CartPanel() {
  const open = useCartPanel();
  const slugs = useEnquiry();
  const items = slugs.map(getSpecimen).filter(Boolean) as NonNullable<ReturnType<typeof getSpecimen>>[];

  useEffect(() => {
    const lenis = (window as any).__lenis;
    if (open) {
      lenis?.stop();
      document.documentElement.dataset.cartPanel = "open";
    } else {
      lenis?.start();
      document.documentElement.dataset.cartPanel = "";
    }
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") cartPanel.close(); };
    if (open) document.addEventListener("keydown", onKey);
    return () => {
      lenis?.start();
      document.documentElement.dataset.cartPanel = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const pieceList = items.map((s) => `• ${s.name} (${s.ref})`).join("\n");
  const message = `Hello,\n\nI would like to enquire about the following pieces from Velora International:\n\n${pieceList}\n\nCould you please share pricing, lead times and sample availability?\n\nThank you.`;
  const waPhone = BRAND.phone.replace(/\D/g, "");
  const waUrl = `https://wa.me/${waPhone}?text=${encodeURIComponent(message)}`;
  const mailUrl = `mailto:${BRAND.email}?subject=${encodeURIComponent(
    `Trade Enquiry — ${items.length} piece${items.length !== 1 ? "s" : ""}`
  )}&body=${encodeURIComponent(message)}`;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="cart-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-[199] bg-bitumen/50 backdrop-blur-sm"
            onClick={() => cartPanel.close()}
          />

          {/* Slide-in panel */}
          <motion.div
            key="cart-panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.5, ease: SILK }}
            className="fixed inset-y-0 right-0 z-[200] flex w-[40vw] min-w-[280px] flex-col bg-bitumen"
            style={{ paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))" }}
          >
            {/* Panel header */}
            <div className="flex items-center justify-between border-b border-parchment/10 px-6 pb-5 pt-[max(5rem,calc(env(safe-area-inset-top)+4rem))]">
              <div>
                <p className="text-[0.6rem] uppercase tracking-wider2 text-brass-leaf">Your selection</p>
                <h2 className="mt-1 font-display text-xl text-parchment-pale">
                  {items.length === 0 ? "Cart empty" : `${items.length} ${items.length === 1 ? "piece" : "pieces"}`}
                </h2>
              </div>
              <button
                onClick={() => cartPanel.close()}
                aria-label="Close cart"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-parchment/15 text-parchment/50 transition-colors hover:border-parchment/35 hover:text-parchment-pale"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div className="mx-auto w-28 opacity-25">
                    <SpecimenArt shape="tray" tone="brass" seed="empty-panel" />
                  </div>
                  <p className="mt-6 font-display text-lg text-parchment/50">Your cart is empty.</p>
                  <button
                    onClick={() => cartPanel.close()}
                    className="mt-4 text-[0.68rem] uppercase tracking-wider2 text-brass-leaf/70 transition-opacity hover:opacity-100"
                  >
                    Continue browsing →
                  </button>
                </div>
              ) : (
                <ul className="divide-y divide-parchment/10">
                  {items.map((s) => (
                    <li key={s.slug} className="flex items-center gap-4 py-4">
                      <div
                        className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md"
                        style={{ background: "radial-gradient(110% 90% at 50% 20%, #fcfbf7, #efeae0)" }}
                      >
                        {hasMedia(s) ? (
                          <SpecimenMedia s={s} sizes="64px" />
                        ) : (
                          <div className="absolute inset-0 grid place-items-center p-2">
                            <SpecimenArt shape={s.shape} tone={s.tone} seed={`panel-${s.slug}`} />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[0.58rem] uppercase tracking-wider2 text-brass-leaf">{s.ref}</p>
                        <p className="font-display text-base leading-tight text-parchment-pale">{s.name}</p>
                        <p className="mt-0.5 text-[0.68rem] text-parchment/40">{s.material}</p>
                      </div>
                      <button
                        onClick={() => enquiry.remove(s.slug)}
                        aria-label={`Remove ${s.name}`}
                        className="shrink-0 rounded-full border border-parchment/15 p-1.5 text-parchment/40 transition-colors hover:border-parchment/35 hover:text-parchment-pale"
                      >
                        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
                          <path d="M6 6l12 12M18 6L6 18" />
                        </svg>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Enquiry CTAs */}
            {items.length > 0 && (
              <div className="border-t border-parchment/10 px-6 pt-5">
                <div className="flex flex-col gap-3">
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 rounded-full border border-brass/35 bg-brass/12 px-5 py-3.5 text-[0.72rem] uppercase tracking-wide3 text-parchment-pale transition-all duration-300 hover:border-brass/60 hover:bg-brass/20"
                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 fill-current text-brass-leaf" aria-hidden="true">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.115 1.523 5.845L.057 23.273a.75.75 0 0 0 .937.938l5.488-1.461A11.942 11.942 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.882 0-3.64-.518-5.143-1.418l-.368-.22-3.806 1.013 1.018-3.727-.237-.383A9.944 9.944 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
                    </svg>
                    Enquire via WhatsApp
                  </a>
                  <a
                    href={mailUrl}
                    className="flex items-center justify-center gap-3 rounded-full border border-parchment/20 px-5 py-3.5 text-[0.72rem] uppercase tracking-wide3 text-parchment/65 transition-all duration-300 hover:border-parchment/40 hover:text-parchment-pale"
                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <path d="M2 7l10 7 10-7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Send via email
                  </a>
                </div>
                <p className="mt-4 text-center text-[0.56rem] uppercase tracking-wider2 text-parchment/25">
                  MOQ 6 pcs · Lead 6–8 wks · 18 countries
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
