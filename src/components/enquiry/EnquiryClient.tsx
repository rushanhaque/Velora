"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEnquiry, enquiry } from "@/lib/enquiry";
import { getSpecimen, BRAND, hasMedia } from "@/lib/data";
import { Specimen as SpecimenArt } from "@/components/visual/Specimen";
import { SpecimenMedia } from "@/components/visual/SpecimenMedia";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Atoms";
import { MaskText } from "@/components/motion/MaskText";
import { Reveal } from "@/components/motion/Reveal";
import { SILK } from "@/lib/motion";

export function EnquiryClient() {
  const slugs = useEnquiry();
  const items = slugs.map(getSpecimen).filter(Boolean) as NonNullable<
    ReturnType<typeof getSpecimen>
  >[];

  if (items.length === 0) {
    return (
      <div className="py-10 text-center">
        <div className="mx-auto max-w-xs">
          <SpecimenArt shape="tray" tone="brass" seed="empty-enquiry" />
        </div>
        <MaskText
          as="h2"
          className="display mt-8 text-[clamp(2rem,5vw,3.4rem)] text-bitumen"
          lines={["Your cart is empty."]}
        />
        <p className="mx-auto mt-5 max-w-md leading-relaxed text-stone">
          Add pieces from the catalogue and they will gather here, ready to send as
          a single enquiry.
        </p>
        <div className="mt-8 flex justify-center">
          <Button href="/collections" variant="solid" arrow>
            Browse the catalogue
          </Button>
        </div>
      </div>
    );
  }

  const pieceList = items.map((s) => `• ${s.name} (${s.ref})`).join("\n");
  const message =
    `Hello,\n\nI would like to enquire about the following pieces from Velora International:\n\n${pieceList}\n\nCould you please share pricing, lead times and sample availability?\n\nThank you.`;

  const waPhone = BRAND.phone.replace(/\D/g, "");
  const waUrl = `https://wa.me/${waPhone}?text=${encodeURIComponent(message)}`;
  const mailUrl = `mailto:${BRAND.email}?subject=${encodeURIComponent(
    `Trade Enquiry — ${items.length} piece${items.length !== 1 ? "s" : ""}`
  )}&body=${encodeURIComponent(message)}`;

  return (
    <div className="grid gap-14 lg:grid-cols-[1.05fr_0.95fr]">
      {/* The list */}
      <div>
        <div className="flex items-center justify-between">
          <Eyebrow>
            {items.length} {items.length === 1 ? "item" : "items"} in cart
          </Eyebrow>
          <button
            onClick={() => enquiry.clear()}
            className="link-draw text-[0.66rem] uppercase tracking-wider2 text-ash hover:text-bitumen"
          >
            Clear all
          </button>
        </div>

        <ul className="mt-6 divide-y divide-line border-y border-line">
          <AnimatePresence initial={false}>
            {items.map((s) => (
              <motion.li
                key={s.slug}
                layout
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.45, ease: SILK }}
                className="flex items-center gap-5 overflow-hidden py-5"
              >
                <Link
                  href={`/collections/${s.slug}`}
                  className="relative h-20 w-20 shrink-0 overflow-hidden rounded-card"
                  style={{ background: "radial-gradient(110% 90% at 50% 20%, #fcfbf7, #efeae0)" }}
                >
                  {hasMedia(s) ? (
                    <SpecimenMedia s={s} sizes="80px" />
                  ) : (
                    <div className="absolute inset-0 grid place-items-center p-3">
                      <SpecimenArt shape={s.shape} tone={s.tone} seed={`enq-${s.slug}`} />
                    </div>
                  )}
                </Link>
                <div className="min-w-0 flex-1">
                  <p className="ref text-brass-deep">{s.ref}</p>
                  <Link
                    href={`/collections/${s.slug}`}
                    className="link-draw font-display text-xl text-bitumen"
                  >
                    {s.name}
                  </Link>
                  <p className="mt-0.5 text-[0.78rem] text-ash">
                    {s.material} · {s.finish}
                  </p>
                </div>
                <button
                  onClick={() => enquiry.remove(s.slug)}
                  aria-label={`Remove ${s.name} from cart`}
                  className="shrink-0 rounded-full border border-line p-2 text-stone transition-colors hover:border-brass hover:text-bitumen"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                    <path
                      d="M6 6l12 12M18 6L6 18"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>

        <p className="mt-6 text-[0.72rem] uppercase tracking-wider2 text-ash">
          MOQ 6 pieces per line · Trade price on application · Lead 6–8 weeks
        </p>
      </div>

      {/* The contact panel */}
      <Reveal>
        <div className="plate rounded-xl2 p-8 sm:p-10 lg:sticky lg:top-28">
          <Eyebrow>Get in touch</Eyebrow>
          <p className="mt-4 text-[0.92rem] leading-relaxed text-stone">
            Your {items.length} selected {items.length === 1 ? "piece" : "pieces"} will
            be included automatically in your message.
          </p>

          {/* Direct contact */}
          <div className="mt-6 flex flex-col gap-3">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center gap-3 rounded-full border border-brass/40 bg-brass/[0.07] px-5 py-3.5 text-[0.75rem] uppercase tracking-wide3 text-bitumen transition-all duration-300 hover:border-brass hover:bg-brass/[0.13]"
            >
              {/* WhatsApp icon */}
              <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 fill-current text-brass-deep" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.115 1.523 5.845L.057 23.273a.75.75 0 0 0 .937.938l5.488-1.461A11.942 11.942 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.882 0-3.64-.518-5.143-1.418l-.368-.22-3.806 1.013 1.018-3.727-.237-.383A9.944 9.944 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
              </svg>
              Chat on WhatsApp
            </a>

            <a
              href={mailUrl}
              className="group flex items-center justify-center gap-3 rounded-full border border-line px-5 py-3.5 text-[0.75rem] uppercase tracking-wide3 text-stone transition-all duration-300 hover:border-brass/40 hover:text-bitumen"
            >
              {/* Email icon */}
              <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M2 7l10 7 10-7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Send via email
            </a>
          </div>

          {/* Divider */}
          <div className="my-7 flex items-center gap-4">
            <div className="flex-1 border-t border-line" />
            <span className="shrink-0 text-[0.6rem] uppercase tracking-wider2 text-ash">
              or fill in the form
            </span>
            <div className="flex-1 border-t border-line" />
          </div>

          {/* Form */}
          <EnquiryForm
            submitLabel="Send enquiry"
            success="Thank you — we have your selection and will reply within two working days."
            onSubmitted={() => enquiry.clear()}
            fields={[
              { name: "name", label: "Name", placeholder: "Your name", required: true, half: true },
              { name: "business", label: "Business", placeholder: "Studio or gallery", required: true, half: true },
              { name: "email", label: "Email", type: "email", placeholder: "you@business.com", required: true },
              { name: "notes", label: "Notes", type: "textarea", placeholder: "Quantities, finishes, timeline…" },
            ]}
          />
        </div>
      </Reveal>
    </div>
  );
}
