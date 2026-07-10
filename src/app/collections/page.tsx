import type { Metadata } from "next";
import { Section, Shell } from "@/components/ui/Section";
import { DrumIndex } from "@/components/collections/DrumIndex";
import { CatalogueClient } from "@/components/collections/CatalogueClient";
import { Reveal } from "@/components/motion/Reveal";
import { MaskText } from "@/components/motion/MaskText";
import { getCollection, specimensByCollection } from "@/lib/data";

export const metadata: Metadata = {
  title: "The Collections — brass, bronze & silver made by hand",
  description:
    "Browse the Velora catalogue across five houses of metal. Hand-raised vessels, tableware, lighting and objects. Trade pricing on application.",
};

export default function CollectionsPage({
  searchParams,
}: {
  searchParams: { house?: string };
}) {
  const houseParam = searchParams.house;
  const collection = houseParam ? getCollection(houseParam) : null;

  // ── Category landing — the indexing drum ───────────────────────────────────
  if (!collection) {
    return (
      <div className="pt-[72px]">
        <DrumIndex />
      </div>
    );
  }

  // ── House product grid ──────────────────────────────────────────────────────
  const specimens = specimensByCollection(collection.slug);

  return (
    <Section pad="md" className="pt-[clamp(110px,13vw,160px)]">
      <Shell>
        <div className="mt-6 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <MaskText
              as="h1"
              className="display mt-4 text-[clamp(2.4rem,6vw,4.4rem)] text-bitumen"
              lines={[collection.name + "."]}
            />

          </div>
          <Reveal delay={120}>
            <p className="max-w-sm text-[0.88rem] leading-relaxed text-stone">
              {collection.blurb}
            </p>
          </Reveal>
        </div>

        <div className="mt-14">
          <CatalogueClient specimens={specimens} />
        </div>
      </Shell>
    </Section>
  );
}
