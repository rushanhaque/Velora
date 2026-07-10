import type { Metadata } from "next";
import { PageHero } from "@/components/site/PageHero";
import { Section, Shell } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { MaskText } from "@/components/motion/MaskText";
import { Parallax } from "@/components/motion/Parallax";
import { Marquee } from "@/components/motion/Marquee";
import { Button } from "@/components/ui/Button";
import { Eyebrow, Rule } from "@/components/ui/Atoms";
import { SpecimenStage } from "@/components/visual/SpecimenStage";
import { PROCESS, getSpecimen } from "@/lib/data";
import { SectionReveal } from "@/components/motion/SectionReveal";

export const metadata: Metadata = {
  title: "About Us — Velora International",
  description:
    "In Moradabad, metal is not manufactured — it is coaxed. The slow craft of raising, chasing, patinating and burnishing behind every Velora object.",
};

const METALS = [
  { name: "Brass", tone: "brass" as const, note: "The maison's first language — warm, weighty, raised to a deep mirror." },
  { name: "Copper", tone: "copper" as const, note: "Drawn into living colour; rose, umber and verdigris pulled from the metal." },
  { name: "Bronze", tone: "bronze" as const, note: "Cast and forged for weight and join — handles, rails and architectural scale." },
  { name: "Silver", tone: "silver" as const, note: "Silvered over raised brass for the table, set to catch candlelight." },
];

export default function CraftPage() {
  const formA = getSpecimen("pomegranate-branch-bowl")!;

  return (
    <>
      <PageHero
        eyebrow="The Craft"
        titleLines={["Raised by hand,", <span key="e" className="serif-italic text-brass-deep">finished by eye.</span>]}
        intro="In Moradabad, metal is not manufactured — it is coaxed. Sheet becomes vessel under thousands of measured blows; colour is drawn from the surface with heat and time. This is the slow craft behind every Velora object."
        align="center"
      />

      {/* Editorial */}
      <SectionReveal>
      <Section pad="lg">
        <Shell>
          <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
            <Parallax distance={36}>
              <SpecimenStage
                shape={formA.shape}
                tone={formA.tone}
                seed="craft-form"
                className="mx-auto max-w-[28rem]"
              />
            </Parallax>
            <div>
              <Reveal>
                <Eyebrow>One pair of hands</Eyebrow>
              </Reveal>
              <MaskText
                as="h2"
                className="display mt-6 text-[clamp(2rem,4.4vw,3.4rem)] text-bitumen"
                lines={["A single maker carries", "each piece, start to finish."]}
              />
              <Reveal delay={140}>
                <p className="mt-7 max-w-md leading-relaxed text-stone">
                  No object passes down a line of specialists. The maker who cuts the
                  disc is the maker who burnishes the rim eleven days later. The hand is
                  recognisable in the work — and accountable to it.
                </p>
              </Reveal>
              <Reveal delay={200}>
                <div className="mt-8 grid grid-cols-3 gap-6 border-t border-line pt-7">
                  {[
                    ["11 days", "On a signature bowl"],
                    ["1000s", "Hammer blows, each piece"],
                    ["0", "Two pieces alike"],
                  ].map(([v, k]) => (
                    <div key={k}>
                      <p className="font-display text-3xl text-bitumen">{v}</p>
                      <p className="mt-1 text-[0.6rem] uppercase tracking-wider2 text-ash">{k}</p>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </Shell>
      </Section>
      </SectionReveal>

      {/* Pull quote */}
      <SectionReveal>
      <Section tint pad="lg" className="overflow-hidden text-center">
        <Shell>
          <Reveal>
            <span className="font-display text-6xl text-brass/40">“</span>
          </Reveal>
          <MaskText
            as="blockquote"
            className="display mx-auto max-w-4xl text-[clamp(1.8rem,4.2vw,3.2rem)] leading-tight text-bitumen"
            lines={[
              "A piece is finished not when",
              "the clock says so, but when the maker",
              <span key="q" className="serif-italic text-brass-deep">can find nothing left to improve.</span>,
            ]}
          />
          <Reveal delay={200}>
            <p className="mt-9 text-[0.66rem] uppercase tracking-wider2 text-ash">
              — Master chaser, third generation
            </p>
          </Reveal>
        </Shell>
      </Section>
      </SectionReveal>

      {/* Process — sticky visual + steps */}
      <SectionReveal>
      <Section pad="xl">
        <Shell>
          <div className="mb-14">
            <Reveal>
              <Eyebrow>The process</Eyebrow>
            </Reveal>
            <MaskText
              as="h2"
              className="display mt-6 text-[clamp(2.2rem,5vw,4rem)] text-bitumen"
              lines={["From sheet to lustre."]}
            />
            <Reveal delay={150}>
              <p className="mt-6 max-w-xl leading-relaxed text-stone">
                Five stages, one pair of hands. A single maker carries each piece from
                the first cut to the final burnish.
              </p>
            </Reveal>
          </div>

          <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <div className="plate overflow-hidden rounded-xl2">
                <div
                  style={{ background: "radial-gradient(110% 80% at 50% 18%, #fcfbf7, #efeae0)" }}
                >
                  <SpecimenStage
                    shape="vase"
                    tone="brass"
                    seed="process-stage"
                    className="mx-auto max-w-[24rem] p-6"
                    float={false}
                  />
                </div>
              </div>
              <p className="mt-5 text-center text-[0.66rem] uppercase tracking-wider2 text-ash">
                The Aurum vase, mid-raising
              </p>
            </div>

            <ol>
              {PROCESS.map((s, i) => (
                <Reveal key={s.n} delay={i * 50}>
                  <li className="group grid grid-cols-[auto_1fr] gap-8 border-t border-line py-9 last:border-b">
                    <span className="numeral text-[clamp(2.4rem,4vw,3.4rem)] text-brass/35 transition-colors duration-500 group-hover:text-brass-deep">
                      {s.n}
                    </span>
                    <div>
                      <h3 className="font-display text-[1.7rem] text-bitumen">{s.title}</h3>
                      <p className="mt-3 max-w-md leading-relaxed text-stone">{s.body}</p>
                    </div>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
        </Shell>
      </Section>
      </SectionReveal>

      {/* The metals */}
      <SectionReveal>
      <Section pad="lg" className="bg-parchment-deep/45">
        <Shell>
          <Reveal>
            <Eyebrow>The metals</Eyebrow>
          </Reveal>
          <MaskText
            as="h2"
            className="display mt-6 max-w-2xl text-[clamp(2rem,4.4vw,3.4rem)] text-bitumen"
            lines={["Four metals, one discipline."]}
          />
          <div className="mt-12 grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
            {METALS.map((m, i) => (
              <Reveal key={m.name} delay={i * 70} className="h-full">
                <div className="plate h-full overflow-hidden rounded-card">
                  <div
                    className="aspect-[4/3]"
                    style={{ background: "radial-gradient(110% 90% at 50% 20%, #fcfbf7, #efeae0)" }}
                  >
                    <div className="grid h-full place-items-center p-7">
                      <SpecimenStage
                        shape={i === 0 ? "bowl" : i === 1 ? "vase" : i === 2 ? "tray" : "goblet"}
                        tone={m.tone}
                        seed={`metal-${m.name}`}
                        ring={false}
                        float={false}
                        className="max-w-[10rem]"
                      />
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-display text-2xl text-bitumen">{m.name}</h3>
                    <Rule className="my-4" />
                    <p className="text-[0.9rem] leading-relaxed text-stone">{m.note}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Shell>
      </Section>
      </SectionReveal>

      {/* CTA */}
      <SectionReveal>
      <Section tint pad="lg" className="text-center">
        <Shell>
          <MaskText
            as="h2"
            className="display mx-auto max-w-3xl text-[clamp(2.2rem,5vw,4rem)] text-bitumen"
            lines={["See the work in the metal."]}
          />
          <Reveal delay={150}>
            <p className="mx-auto mt-7 max-w-lg leading-relaxed text-stone">
              Come and see the atelier — visits by appointment, and the full catalogue at
              the trade desk in Moradabad.
            </p>
          </Reveal>
          <Reveal delay={210} className="mt-9 flex flex-wrap justify-center gap-5">
            <Button href="/collections" variant="brass" arrow magnetic>
              Browse the catalogue
            </Button>
            <Button href="/collections" variant="outline" arrow>
              Browse the catalogue
            </Button>
          </Reveal>
        </Shell>
        <div className="mt-14">
          <Marquee
            items={["Raise", "Chase", "Patinate", "Burnish", "Inspect", "Repeat"].map((t) => (
              <span key={t} className="font-display text-[clamp(1.6rem,4vw,2.8rem)] italic text-brass-deep/20">
                {t}
              </span>
            ))}
            duration={45}
          />
        </div>
      </Section>
      </SectionReveal>
    </>
  );
}
