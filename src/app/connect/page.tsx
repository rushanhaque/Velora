import type { Metadata } from "next";
import { PageHero } from "@/components/site/PageHero";
import { Section, Shell } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { Eyebrow } from "@/components/ui/Atoms";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { BRAND } from "@/lib/data";

export const metadata: Metadata = {
  title: "Connect — contact & enquiries",
  description:
    "Reach the Velora atelier in Moradabad, India. Contact details, our location and an enquiry form — we reply within two working days.",
};

export default function ConnectPage() {
  return (
    <>
      <PageHero
        eyebrow="Connect"
        titleLines={[<span key="l">Let&apos;s <span className="text-leaf">connect.</span></span>]}
        intro="Designers, retailers, galleries and hospitality groups are welcome. Send us a note and our desk replies within two working days — with pricing, samples and a dedicated contact."
      />

      {/* Contact + enquiry form */}
      <Section pad="md" className="pt-0">
        <Shell>
          <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr]">
            {/* Contact info */}
            <div>
              <Reveal>
                <Eyebrow>Contact</Eyebrow>
              </Reveal>
              <div className="mt-8 space-y-7">
                {[
                  ["Email", BRAND.email],
                  ["Telephone", BRAND.phone],
                  ["Atelier & showroom", BRAND.address],
                  ["Hours", BRAND.hours],
                ].map(([k, v], i) => (
                  <Reveal key={k} delay={i * 60}>
                    <div>
                      <p className="text-[0.58rem] uppercase tracking-wider2 text-ash">{k}</p>
                      <p className="mt-1.5 font-display text-xl text-bitumen">{v}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
              <Reveal delay={260}>
                <div className="mt-10 flex flex-wrap gap-2 border-t border-line pt-7">
                  {["MOQ — 6 pcs", "LEAD — 6–8 wks", "EXPORT — 18 countries"].map((b) => (
                    <span
                      key={b}
                      className="rounded-full border border-line px-3.5 py-1.5 text-[0.58rem] uppercase tracking-wider2 text-stone"
                    >
                      {b}
                    </span>
                  ))}
                </div>
              </Reveal>
            </div>

            {/* Enquiry form */}
            <Reveal delay={120}>
              <div className="plate rounded-xl2 p-8 sm:p-10">
                <EnquiryForm
                  submitLabel="Send enquiry"
                  success="Thank you — our desk has your note and will reply within two working days."
                  choices={[
                    {
                      name: "interest",
                      label: "I'm interested in…",
                      options: [
                        "Wholesale / stocking",
                        "A bespoke commission",
                        "Private label",
                        "A hospitality programme",
                        "The 2026 catalogue",
                      ],
                    },
                  ]}
                  fields={[
                    { name: "name", label: "Name", placeholder: "Your name", required: true, half: true },
                    { name: "business", label: "Business", placeholder: "Studio, gallery or group", half: true },
                    { name: "email", label: "Email", type: "email", placeholder: "you@business.com", required: true, half: true },
                    { name: "country", label: "Country", placeholder: "Where you trade", half: true },
                    { name: "message", label: "Message", type: "textarea", placeholder: "Tell us a little about what you need…" },
                  ]}
                />
              </div>
            </Reveal>
          </div>
        </Shell>
      </Section>

      {/* Map — Moradabad */}
      <Section pad="lg">
        <Shell>
          <Reveal>
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <Eyebrow>Find us</Eyebrow>
                <h2 className="display mt-5 text-[clamp(1.8rem,4vw,3rem)] text-bitumen">
                  Civil Lines, Moradabad.
                </h2>
                <p className="mt-3 max-w-md leading-relaxed text-stone">
                  The heart of India&apos;s brass city — visits to the atelier by appointment.
                </p>
              </div>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Moradabad%2C+Uttar+Pradesh%2C+India"
                target="_blank"
                rel="noopener noreferrer"
                className="link-draw shrink-0 text-[0.72rem] uppercase tracking-wide3 text-bitumen"
              >
                Open in Maps →
              </a>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="plate mt-8 overflow-hidden rounded-xl2">
              <iframe
                title="Velora International — Moradabad, Uttar Pradesh, India"
                src="https://www.google.com/maps?q=Moradabad%2C+Uttar+Pradesh%2C+India&z=12&output=embed"
                className="block h-[clamp(320px,46vw,560px)] w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </Reveal>
        </Shell>
      </Section>
    </>
  );
}
