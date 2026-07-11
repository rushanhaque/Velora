import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/site/PageHero";
import { Section, Shell } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { MaskText } from "@/components/motion/MaskText";
import { Parallax } from "@/components/motion/Parallax";
import { Marquee } from "@/components/motion/Marquee";
import { Button } from "@/components/ui/Button";
import { Eyebrow, Rule } from "@/components/ui/Atoms";
import { PROCESS } from "@/lib/data";
import { ProcessScroller } from "@/components/about/ProcessScroller";
import { SectionReveal } from "@/components/motion/SectionReveal";

export const metadata: Metadata = {
  title: "About Us — Velora International",
  description:
    "In Moradabad, metal is not manufactured — it is coaxed. The slow craft of raising, chasing, patinating and burnishing behind every Velora object.",
};

const METALS = [
  { name: "Brass", image: "/media/about/metal-brass.png", note: "The maison's first language — warm, weighty, raised to a deep mirror." },
  { name: "Copper", image: "/media/about/metal-copper.png", note: "Drawn into living colour; rose, umber and verdigris pulled from the metal." },
  { name: "Iron", image: "/media/about/metal-iron.png", note: "Forged dark and strong — the backbone of structure, wrought to hold and endure." },
  { name: "Aluminium", image: "/media/about/metal-aluminium.png", note: "Light as air, cool to the touch — brushed or anodised for a clean, modern edge." },
  { name: "Steel", image: "/media/about/metal-steel.png", note: "Mirror-polished or satin-drawn — the cool precision that anchors every line." },
];

export default function CraftPage() {
  return (
    <>
      <PageHero
        eyebrow="The Craft"
        titleLines={["Raised by hand,", <span key="e" className="serif-italic text-brass-deep">finished by eye.</span>]}
        intro="In Moradabad, metal is not manufactured — it is coaxed. Sheet becomes vessel under thousands of measured blows; colour is drawn from the surface with heat and time. This is the slow craft behind every Velora object."
        align="center"
      />

      {/* Editorial — One pair of hands */}
      <SectionReveal>
      <Section pad="lg">
        <Shell>
          <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
            <Parallax distance={36}>
              <div className="mx-auto max-w-[28rem] overflow-hidden rounded-xl2">
                <Image
                  src="/media/about/craftsman-hands.png"
                  alt="A craftsman's skilled hands carefully hand-raising a brass bowl in a traditional Moradabad atelier"
                  width={640}
                  height={640}
                  className="h-auto w-full object-cover"
                  sizes="(max-width: 1024px) 90vw, 40vw"
                  priority
                />
              </div>
            </Parallax>
            <div>
              <Reveal>
                <Eyebrow>Many expert hands</Eyebrow>
              </Reveal>
              <MaskText
                as="h2"
                className="display mt-6 text-[clamp(2rem,4.4vw,3.4rem)] text-bitumen"
                lines={["Every piece, carried by", "many specialist hands."]}
              />
              <Reveal delay={140}>
                <p className="mt-7 max-w-md leading-relaxed text-stone">
                  No Velora object is made by one person alone. Each piece passes along a
                  line of dedicated specialists — one master cuts the disc, another raises
                  it, others chase, patinate and burnish. Every hand has spent a lifetime
                  perfecting a single stage, and the finished piece carries them all.
                </p>
              </Reveal>
              <Reveal delay={200}>
                <div className="mt-8 grid grid-cols-3 gap-6 border-t border-line pt-7">
                  {[
                    ["5", "Specialist stages"],
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
            <span className="font-display text-6xl text-brass/40">&ldquo;</span>
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

      {/* Process — sticky visual + steps with images */}
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
                Five stages, five kinds of mastery. Each piece passes from one dedicated
                specialist to the next, from the first cut to the final burnish.
              </p>
            </Reveal>
          </div>

          <ProcessScroller steps={PROCESS} />
        </Shell>
      </Section>
      </SectionReveal>

      {/* The metals — 5 metals with dedicated photos */}
      <SectionReveal>
      <Section pad="lg" className="bg-parchment-deep/45">
        <Shell>
          <Reveal>
            <Eyebrow>The metals</Eyebrow>
          </Reveal>
          <MaskText
            as="h2"
            className="display mt-6 max-w-2xl text-[clamp(2rem,4.4vw,3.4rem)] text-bitumen"
            lines={["Five metals, one discipline."]}
          />
          <div className="mt-12 grid gap-7 sm:grid-cols-2 lg:grid-cols-5">
            {METALS.map((m, i) => (
              <Reveal key={m.name} delay={i * 70} className="h-full">
                <div className="plate group h-full overflow-hidden rounded-card">
                  <div className="aspect-[4/3] overflow-hidden">
                    <Image
                      src={m.image}
                      alt={`${m.name} metalware — hand-crafted by Velora artisans`}
                      width={480}
                      height={360}
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                      sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 20vw"
                    />
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
            <Button href="/collections" variant="brass" arrow>
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
