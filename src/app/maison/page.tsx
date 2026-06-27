import type { Metadata } from "next";
import { PageHero } from "@/components/site/PageHero";
import { Section, Shell } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { MaskText } from "@/components/motion/MaskText";
import { Parallax } from "@/components/motion/Parallax";
import { Counter } from "@/components/motion/Counter";
import { Button } from "@/components/ui/Button";
import { Eyebrow, Rule } from "@/components/ui/Atoms";
import { SpecimenStage } from "@/components/visual/SpecimenStage";
import { PRINCIPLES, STATS, ATELIERS, BRAND } from "@/lib/data";

export const metadata: Metadata = {
  title: "The Maison — a family of makers in the brass city",
  description:
    "Velora International is a family-led trade atelier in Moradabad, India, raising objects in brass, bronze, copper and silver for the world's finest interiors since 1972.",
};

const TIMELINE = [
  { year: "1972", title: "A single workshop", note: "The maison begins as one bench in Civil Lines, Moradabad." },
  { year: "1989", title: "First exports", note: "Pieces leave India for galleries and decorators abroad." },
  { year: "2004", title: "The second generation", note: "Children of the founding makers take the hammer." },
  { year: "2016", title: "The hospitality desk", note: "Amenity and tableware programmes for hotel groups." },
  { year: "2026", title: "A hundred and twenty hands", note: "Serving designers across eighteen countries — still family-led." },
];

export default function MaisonPage() {
  return (
    <>
      <PageHero
        eyebrow="The Maison"
        titleLines={["A family of makers", <span key="b" className="text-leaf">in the brass city.</span>]}
        intro={`${BRAND.shortName} is a trade atelier in ${BRAND.city}, India — the centre of the subcontinent's metal craft. We have made objects in brass, bronze, copper and silver for the world's finest interiors since ${BRAND.founded}.`}
      />

      {/* Three generations */}
      <Section pad="lg">
        <Shell>
          <div className="grid items-center gap-14 lg:grid-cols-[0.95fr_1.05fr]">
            <div>
              <Reveal>
                <Eyebrow>Since 1972</Eyebrow>
              </Reveal>
              <MaskText
                as="h2"
                className="display mt-6 text-[clamp(2rem,4.4vw,3.4rem)] text-bitumen"
                lines={["Three generations,", <span key="s" className="serif-italic text-brass-deep">one standard.</span>]}
              />
              <Reveal delay={140}>
                <p className="mt-7 max-w-md leading-relaxed text-stone">
                  What began as a single workshop is now an atelier of a hundred and
                  twenty makers — chasers, raisers, casters and polishers, many of whom
                  learned the craft from their parents. We have grown, but the way we
                  work has not: every piece passes through human hands, start to finish.
                </p>
              </Reveal>
              <Reveal delay={200}>
                <p className="mt-5 max-w-md leading-relaxed text-stone">
                  Today we supply interior architects, hospitality groups and galleries
                  across eighteen countries — quietly, often unbranded, always to a
                  standard we would put our own name to. Which, in the end, is exactly
                  what we do.
                </p>
              </Reveal>
            </div>
            <Parallax distance={34}>
              <SpecimenStage shape="urn" tone="brass" seed="maison-urn" className="mx-auto max-w-[30rem]" />
            </Parallax>
          </div>
        </Shell>
      </Section>

      {/* Timeline */}
      <Section pad="lg" className="bg-parchment-deep/45">
        <Shell>
          <Reveal>
            <Eyebrow>Our history</Eyebrow>
          </Reveal>
          <MaskText
            as="h2"
            className="display mt-6 max-w-2xl text-[clamp(2rem,4.4vw,3.4rem)] text-bitumen"
            lines={["The brass city,", "in five chapters."]}
          />
          <div className="mt-14 grid gap-px overflow-hidden rounded-xl2 border border-line bg-line md:grid-cols-5">
            {TIMELINE.map((t, i) => (
              <Reveal key={t.year} delay={i * 60} className="h-full">
                <div className="group flex h-full flex-col bg-parchment-pale p-7 transition-colors duration-500 hover:bg-parchment">
                  <span className="font-display text-[clamp(2.4rem,4vw,3.4rem)] leading-none text-leaf">
                    {t.year}
                  </span>
                  <Rule className="my-5" />
                  <h3 className="font-display text-xl text-bitumen">{t.title}</h3>
                  <p className="mt-2 text-[0.85rem] leading-relaxed text-stone">{t.note}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Shell>
      </Section>

      {/* Principles (dark) */}
      <Section tint pad="xl">
        <Shell>
          <Reveal>
            <Eyebrow>How we work</Eyebrow>
          </Reveal>
          <MaskText
            as="h2"
            className="display mt-6 max-w-3xl text-[clamp(2.2rem,5vw,4rem)] text-bitumen"
            lines={["Three promises", <span key="m" className="text-leaf">we keep in metal.</span>]}
          />
          <div className="mt-14 grid gap-12 md:grid-cols-3">
            {PRINCIPLES.map((p, i) => (
              <Reveal key={p.n} delay={i * 90}>
                <div className="group">
                  <span className="numeral text-[clamp(3rem,6vw,4.6rem)] text-brass/40 transition-colors duration-500 group-hover:text-brass-deep">
                    {p.n}
                  </span>
                  <Rule className="my-6" />
                  <h3 className="font-display text-2xl text-bitumen">{p.title}</h3>
                  <p className="mt-3 leading-relaxed text-stone">{p.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Shell>
      </Section>

      {/* Stats */}
      <Section pad="lg">
        <Shell>
          <div className="grid grid-cols-2 gap-y-12 sm:gap-8 lg:grid-cols-4">
            {STATS.map((st, i) => (
              <Reveal key={st.label} delay={i * 80}>
                <p className="font-display text-[clamp(3rem,6vw,5rem)] leading-none text-brass-deep">
                  <Counter value={st.value} suffix={st.suffix} />
                </p>
                <Rule className="my-5" />
                <p className="text-[0.95rem] text-bitumen">{st.label}</p>
                <p className="mt-1 text-[0.66rem] uppercase tracking-wider2 text-ash">{st.sub}</p>
              </Reveal>
            ))}
          </div>
        </Shell>
      </Section>

      {/* Ateliers */}
      <Section pad="lg" className="bg-parchment-deep/45">
        <Shell>
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div>
              <Reveal>
                <Eyebrow>The ateliers</Eyebrow>
              </Reveal>
              <MaskText
                as="h2"
                className="display mt-6 text-[clamp(2rem,4.4vw,3.4rem)] text-bitumen"
                lines={["Where the work happens."]}
              />
            </div>
            <Reveal delay={120}>
              <Button href="/connect" variant="link" arrow>
                Arrange a visit
              </Button>
            </Reveal>
          </div>
          <div className="mt-12 grid gap-7 md:grid-cols-3">
            {ATELIERS.map((a, i) => (
              <Reveal key={a.name} delay={i * 70} className="h-full">
                <div className="plate h-full rounded-card p-8">
                  <span className="ref text-brass-deep">0{i + 1}</span>
                  <h3 className="mt-4 font-display text-2xl text-bitumen">{a.name}</h3>
                  <p className="mt-1 text-[0.7rem] uppercase tracking-wider2 text-ash">{a.place}</p>
                  <Rule className="my-5" />
                  <p className="text-[0.92rem] leading-relaxed text-stone">{a.note}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Shell>
      </Section>

      {/* CTA */}
      <Section tint pad="lg" className="text-center">
        <Shell>
          <MaskText
            as="h2"
            className="display mx-auto max-w-3xl text-[clamp(2.2rem,5vw,4rem)] text-bitumen"
            lines={["Make something", <span key="o" className="serif-italic text-brass-deep">that outlasts us.</span>]}
          />
          <Reveal delay={160} className="mt-9 flex flex-wrap justify-center gap-5">
            <Button href="/connect" variant="brass" arrow magnetic>
              Commission a piece
            </Button>
            <Button href="/connect" variant="outline" arrow>
              Get in touch
            </Button>
          </Reveal>
        </Shell>
      </Section>
    </>
  );
}
