import type { Metadata } from "next";
import { PageHero } from "@/components/site/PageHero";
import { Section, Shell } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { FAQ } from "@/lib/data";

export const metadata: Metadata = {
  title: "Trade FAQ — minimums, lead times, shipping & care",
  description:
    "Answers to common trade questions for Velora International — minimum orders, lead times, pricing, private label, shipping, customs and caring for metal.",
};

export default function FaqPage() {
  return (
    <>
      <PageHero
        eyebrow="Trade FAQ"
        titleLines={["Questions,", <span key="a" className="serif-italic text-brass-deep">answered.</span>]}
        intro="The things designers, galleries and hospitality groups ask us most — about ordering, trade pricing, shipping and caring for hand-raised metal."
      />

      <Section pad="md" className="pt-0">
        <Shell>
          <div className="mx-auto max-w-3xl space-y-16">
            {FAQ.map((group, gi) => (
              <div key={group.title}>
                <Reveal>
                  <h2 className="font-display text-[clamp(1.6rem,3vw,2.2rem)] text-bitumen">
                    {group.title}
                  </h2>
                  <div className="hairline mt-5" />
                </Reveal>
                <div className="mt-2">
                  {group.items.map((item, i) => (
                    <Reveal key={item.q} delay={i * 40}>
                      <details className="group border-b border-line">
                        <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 [&::-webkit-details-marker]:hidden">
                          <span className="font-display text-xl text-bitumen">{item.q}</span>
                          <span
                            aria-hidden="true"
                            className="relative grid h-7 w-7 shrink-0 place-items-center rounded-full border border-line text-brass-deep transition-colors duration-500 group-open:border-brass"
                          >
                            <span className="absolute h-px w-3 bg-current" />
                            <span className="absolute h-3 w-px bg-current transition-transform duration-500 ease-silk group-open:rotate-90 group-open:opacity-0" />
                          </span>
                        </summary>
                        <p className="max-w-prose2 pb-7 leading-relaxed text-stone">{item.a}</p>
                      </details>
                    </Reveal>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <Reveal>
            <div className="mx-auto mt-16 max-w-3xl rounded-xl2 border border-line bg-parchment-deep/50 p-8 text-center sm:p-12">
              <p className="eyebrow text-brass-deep">Still have a question?</p>
              <h2 className="mt-4 font-display text-[clamp(1.8rem,3.4vw,2.6rem)] text-bitumen">
                Our trade desk is happy to help.
              </h2>
              <div className="mt-7 flex flex-wrap justify-center gap-5">
                <Button href="/connect" variant="solid" arrow magnetic>
                  Get in touch
                </Button>
                <Button href="/connect" variant="link" arrow>
                  Start a commission
                </Button>
              </div>
            </div>
          </Reveal>
        </Shell>
      </Section>
    </>
  );
}
