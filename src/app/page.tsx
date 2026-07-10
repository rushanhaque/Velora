import { Hero } from "@/components/home/Hero";
import { HouseIndex } from "@/components/home/HouseIndex";
import { SignatureScroll } from "@/components/home/SignatureScroll";
import { Section, Shell } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { MaskText } from "@/components/motion/MaskText";
import { Marquee } from "@/components/motion/Marquee";
import { Counter } from "@/components/motion/Counter";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Atoms";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import {
  PROCESS,
  STATS,
  TRADE_POINTS,
  PRESS,
  TICKER,
} from "@/lib/data";

export default function Home() {
  return (
    <>
      <Hero />

      {/* ───────────────── Press strip ───────────────── */}
      <div className="border-b border-line/60 bg-parchment-deep/40">
        <Marquee
          items={PRESS.map((p) => (
            <span key={p.source} className="flex items-center gap-4">
              <span className="font-display text-[1.05rem] italic text-stone">
                &ldquo;{p.quote}&rdquo;
              </span>
              <span className="text-[0.6rem] uppercase tracking-wider2 text-brass-deep">
                {p.source}
              </span>
            </span>
          ))}
          duration={60}
          className="py-5"
          separator="·"
          label="Press notices"
        />
      </div>

      {/* ───────────────── Collections ───────────────── */}
      <HouseIndex />

      {/* ───────────────── Signature pieces (scroll photo switcher) ───────────────── */}
      <div className="mt-[clamp(48px,7vw,96px)]">
        <SignatureScroll />
      </div>

      {/* ───────────────── The maison line ───────────────── */}
      <Section pad="xl" className="text-center py-[clamp(40px,5vw,72px)]">
        <Shell>
          <Reveal variant="blur">
            <Eyebrow className="justify-center">The Velora Maison</Eyebrow>
          </Reveal>
          <MaskText
            as="h2"
            className="display mx-auto mt-7 max-w-4xl text-[clamp(2.6rem,7vw,5.6rem)] text-bitumen"
            lines={["Where fire becomes", <span key="h" className="text-leaf">heirloom.</span>]}
          />
          <Reveal delay={150}>
            <p className="mx-auto mt-8 max-w-xl text-lg leading-relaxed text-stone">
              A century of metal craft, carried from the workshops of Moradabad to the
              world&apos;s most considered rooms. For three generations our makers have
              turned fire, hammer and patience into objects that outlive their owners.
            </p>
          </Reveal>
          <Reveal delay={220} className="mt-10">
            <Button href="/about" variant="outline" arrow magnetic>
              About the maison
            </Button>
          </Reveal>
        </Shell>
        <div className="mt-16 overflow-hidden bg-bitumen py-3">
          <Marquee
            items={TICKER.map((t) => (
              <span
                key={t}
                className="font-display text-[clamp(1.8rem,4.5vw,3.2rem)] italic text-brass-leaf/70"
              >
                {t}
              </span>
            ))}
            duration={55}
          />
        </div>
      </Section>

      {/* ───────────────── The craft ───────────────── */}
      <Section pad="xl" className="pt-[clamp(40px,5vw,72px)]">
        <Shell>
          <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <Reveal>
                <Eyebrow>The craft</Eyebrow>
              </Reveal>
              <MaskText
                as="h2"
                className="display mt-6 text-[clamp(2.2rem,4.6vw,3.6rem)] text-bitumen"
                lines={["A hundred hammers,", <span key="o" className="serif-italic text-brass-deep">one steady hand.</span>]}
              />
              <Reveal delay={150}>
                <p className="mt-7 max-w-md leading-relaxed text-stone">
                  Every Velora piece begins as a flat disc and a fire. It is raised,
                  chased, patinated and burnished entirely by hand — a single maker
                  carrying one object from sheet to lustre. Nothing is rushed; nothing
                  is repeated exactly.
                </p>
              </Reveal>
              <Reveal delay={220} className="mt-9">
                <Button href="/about" variant="solid" arrow magnetic>
                  Inside the atelier
                </Button>
              </Reveal>
            </div>

            <ol className="relative">
              {PROCESS.map((s, i) => (
                <Reveal key={s.n} delay={i * 60}>
                  <li className="group grid grid-cols-[auto_1fr] gap-7 border-t border-line py-8 transition-colors duration-500 last:border-b hover:border-t-brass/40">
                    <span className="numeral text-[2.2rem] text-brass/40 transition-colors duration-500 group-hover:text-brass-deep">
                      {s.n}
                    </span>
                    <div>
                      <h3 className="font-display text-2xl text-bitumen">{s.title}</h3>
                      <p className="mt-2 max-w-md text-[0.95rem] leading-relaxed text-stone">
                        {s.body}
                      </p>
                    </div>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
        </Shell>
      </Section>

      {/* ───────────────── Stats (dark) — v3.0 museum placards ───────────────── */}
      <Section tint pad="xl">
        <Shell>
          <div className="grid grid-cols-2 gap-6 sm:gap-8 lg:grid-cols-4">
            {STATS.map((st, i) => (
              <Reveal key={st.label} delay={i * 80} variant="scale">
                <div data-lit className="group plate rounded-xl2 border-t-2 border-t-brass/40 p-6 text-center transition-all duration-700 hover:border-t-brass hover:shadow-glow-brass sm:p-8">
                  <p className="font-display text-[clamp(2.6rem,5vw,4.2rem)] leading-none text-leaf">
                    <Counter value={st.value} suffix={st.suffix} />
                  </p>
                  <div className="mx-auto my-4 h-px w-12 bg-gradient-to-r from-transparent via-brass/40 to-transparent" />
                  <p className="text-[0.95rem] text-bitumen">{st.label}</p>
                  <p className="mt-1 text-[0.62rem] uppercase tracking-wider2 text-ash">
                    {st.sub}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Shell>
      </Section>

      {/* ───────────────── Trade ───────────────── */}
      <Section pad="md" className="bg-parchment-deep/45">
        <Shell>
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <Reveal>
                <Eyebrow>Trade &amp; wholesale</Eyebrow>
              </Reveal>
              <MaskText
                as="h2"
                className="display mt-6 text-[clamp(2.2rem,4.6vw,3.6rem)] text-bitumen"
                lines={["Built for", <span key="t" className="serif-italic text-brass-deep">the trade.</span>]}
              />
              <Reveal delay={150} className="mt-8">
                <Button href="/contact" variant="solid" arrow magnetic>
                  Get in touch
                </Button>
              </Reveal>
            </div>

            <div className="grid gap-px overflow-hidden rounded-xl2 border border-line bg-line sm:grid-cols-2">
              {TRADE_POINTS.map((t, i) => (
                <Reveal key={t.title} delay={i * 60}>
                  <div data-lit className="group h-full bg-parchment-pale p-8 transition-all duration-500 hover:bg-parchment hover:shadow-inner-glow">
                    <span className="ref text-brass-deep">0{i + 1}</span>
                    <h3 className="mt-4 font-display text-xl text-bitumen">{t.title}</h3>
                    <p className="mt-2 text-[0.92rem] leading-relaxed text-stone">{t.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </Shell>
      </Section>

      {/* ───────────────── Catalogue CTA (dark) ───────────────── */}
      <Section tint pad="md" id="catalogue" className="overflow-hidden">
        <Shell>
          <div className="grid gap-14 lg:grid-cols-2 lg:items-center">
            <div>
              <Reveal variant="blur">
                <Eyebrow>The 2026 catalogue</Eyebrow>
              </Reveal>
              <MaskText
                as="h2"
                className="display mt-6 text-[clamp(2.4rem,5.5vw,4.4rem)] text-bitumen"
                lines={["Request the", <span key="c" className="text-leaf">catalogue.</span>]}
              />
              <Reveal delay={150}>
                <p className="mt-7 max-w-md leading-relaxed text-stone">
                  Two hundred pieces in brass, bronze, copper and silver — each made to
                  order, each finished by hand. Trade pricing available on application.
                </p>
              </Reveal>
              <Reveal delay={210}>
                <div className="mt-9 flex flex-wrap gap-3">
                  {["MOQ from six pieces", "Lead 6–8 weeks", "Export to 18 countries"].map(
                    (b) => (
                      <span
                        key={b}
                        className="rounded-full border border-brass-leaf/25 px-4 py-2 text-[0.62rem] uppercase tracking-wider2 text-stone transition-colors duration-500 hover:border-brass-leaf/50 hover:text-brass-deep"
                      >
                        {b}
                      </span>
                    ),
                  )}
                </div>
              </Reveal>
            </div>

            <Reveal delay={120} variant="blur">
              <div data-lit className="plate rounded-xl2 p-8 sm:p-10">
                <CatalogueRequest />
              </div>
            </Reveal>
          </div>
        </Shell>
      </Section>
    </>
  );
}

/* Inline catalogue request — kept here so the home page owns its CTA copy. */
function CatalogueRequest() {
  return (
    <EnquiryForm
      submitLabel="Request the catalogue"
      success="Thank you — our trade desk will send the 2026 catalogue within two working days."
      fields={[
        { name: "name", label: "Name", placeholder: "Your name", required: true, half: true },
        { name: "studio", label: "Studio / company", placeholder: "Practice or business", half: true },
        { name: "email", label: "Email", type: "email", placeholder: "you@studio.com", required: true },
      ]}
    />
  );
}
