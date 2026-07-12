import type { Metadata } from "next";
import { PageHero } from "@/components/site/PageHero";
import { Section, Shell } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { BRAND } from "@/lib/data";
import { SectionReveal } from "@/components/motion/SectionReveal";

export const metadata: Metadata = {
  title: "Contact — enquiries & trade desk",
  description:
    "Reach the Velora atelier in Moradabad, India. Contact details, our location and an enquiry form — we reply within two working days.",
};

const MAPS_EMBED =
  "https://www.google.com/maps?q=Moradabad%2C+Uttar+Pradesh%2C+India&z=12&output=embed";
const MAPS_LINK =
  "https://www.google.com/maps/search/?api=1&query=Moradabad%2C+Uttar+Pradesh%2C+India";

const DESK_ROWS: { k: string; v: string; href?: string }[] = [
  { k: "Email", v: BRAND.email, href: `mailto:${BRAND.email}` },
  { k: "Telephone", v: BRAND.phone, href: `tel:${BRAND.phone.replace(/[\s()]/g, "")}` },
  { k: "Atelier & showroom", v: BRAND.address, href: MAPS_LINK },
  { k: "Hours", v: BRAND.hours },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        compact
        eyebrow="Contact"
        titleLines={[<span key="l">Let&apos;s <span className="text-leaf">connect.</span></span>]}
        intro="Designers, retailers, galleries and hospitality groups are welcome. Send us a note and our desk replies within two working days."
      />

      {/* The desk & the note — two sheets of equal weight */}
      <SectionReveal>
        <Section pad="sm" className="pt-0">
          <Shell>
            <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-stretch">
              {/* ── The trade desk — a dark sheet, like the ledger on the bench ── */}
              <Reveal className="h-full">
                <div className="plate plate--dark vignette relative flex h-full flex-col overflow-hidden rounded-xl2 p-6 sm:p-7">
                  {/* warm lamplight, top corner */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-16 -top-20 h-[280px] w-[280px] rounded-full opacity-25"
                    style={{ background: "radial-gradient(circle, rgba(200,167,101,0.5), transparent 70%)" }}
                  />

                  <p className="eyebrow relative text-brass-leaf">The trade desk</p>

                  <div className="relative mt-4">
                    {DESK_ROWS.map(({ k, v, href }) => {
                      const inner = (
                        <>
                          <span className="text-[0.58rem] uppercase tracking-wider2 text-haze/80">
                            {k}
                          </span>
                          <span className="mt-1.5 flex min-w-0 items-baseline justify-between gap-4">
                            <span className="break-words font-display text-[clamp(1.05rem,1.6vw,1.35rem)] leading-snug text-parchment-pale transition-colors duration-500 group-hover/row:text-brass-gilt">
                              {v}
                            </span>
                            {href && (
                              <span
                                aria-hidden="true"
                                className="-translate-x-1.5 text-brass-leaf opacity-0 transition-all duration-500 ease-silk group-hover/row:translate-x-0 group-hover/row:opacity-100"
                              >
                                →
                              </span>
                            )}
                          </span>
                        </>
                      );
                      return href ? (
                        <a
                          key={k}
                          href={href}
                          target={href.startsWith("http") ? "_blank" : undefined}
                          rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                          className="group/row block border-b border-brass-leaf/12 py-3 transition-colors duration-500 hover:border-brass-leaf/35"
                        >
                          {inner}
                        </a>
                      ) : (
                        <div key={k} className="border-b border-brass-leaf/12 py-3">
                          {inner}
                        </div>
                      );
                    })}
                  </div>

                  {/* The map — set into the desk, toned to the room */}
                  <div className="relative mt-auto pt-5">
                    <div className="overflow-hidden rounded-xl border border-brass-leaf/15">
                      <iframe
                        title="Velora International — Moradabad, Uttar Pradesh, India"
                        src={MAPS_EMBED}
                        className="block h-[140px] w-full border-0"
                        style={{ filter: "grayscale(0.3) sepia(0.45) saturate(1.15) brightness(0.96) contrast(1.03)" }}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        allowFullScreen
                      />
                      <a
                        href={MAPS_LINK}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/map flex items-center justify-between bg-bitumen-umber px-4 py-2.5 text-[0.6rem] uppercase tracking-wide3 text-haze transition-colors duration-500 hover:text-brass-leaf"
                      >
                        <span>
                          {BRAND.city} · {BRAND.region.split(",")[0]}
                        </span>
                        <span className="flex items-center gap-1.5">
                          Open in Maps
                          <span
                            aria-hidden="true"
                            className="transition-transform duration-500 ease-silk group-hover/map:translate-x-1"
                          >
                            →
                          </span>
                        </span>
                      </a>
                    </div>
                  </div>
                </div>
              </Reveal>

              {/* ── The note — the enquiry form on a lit sheet ── */}
              <Reveal delay={120} className="h-full">
                <div data-lit className="plate flex h-full flex-col rounded-xl2 p-6 sm:p-7">
                  <p className="eyebrow text-brass-deep">Write to us</p>
                  <h2 className="mt-3 font-display text-[clamp(1.4rem,2.2vw,1.85rem)] leading-tight text-bitumen">
                    Tell us about your project.
                  </h2>
                  <div className="mt-5">
                    <EnquiryForm
                      compact
                      submitLabel="Send enquiry"
                      success="Thank you — our desk has your note and will reply within two working days."
                      fields={[
                        { name: "name", label: "Name", placeholder: "Your name", required: true, half: true },
                        { name: "business", label: "Business", placeholder: "Studio, gallery or group", half: true },
                        { name: "email", label: "Email", type: "email", placeholder: "you@business.com", required: true, half: true },
                        { name: "country", label: "Country", placeholder: "Where you trade", half: true },
                        { name: "message", label: "Message", type: "textarea", placeholder: "Tell us a little about what you need…" },
                      ]}
                    />
                  </div>
                </div>
              </Reveal>
            </div>
          </Shell>
        </Section>
      </SectionReveal>
    </>
  );
}
