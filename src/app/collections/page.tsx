import type { Metadata } from "next";
import Link from "next/link";
import { Section, Shell } from "@/components/ui/Section";
import { CollectionLanding } from "@/components/collections/CollectionLanding";
import { CatalogueClient } from "@/components/collections/CatalogueClient";
import { Reveal } from "@/components/motion/Reveal";
import { Eyebrow } from "@/components/ui/Atoms";
import { MaskText } from "@/components/motion/MaskText";
import { getCollection, specimensByCollection } from "@/lib/data";

export const metadata: Metadata = {
  title: "The Collections — brass, bronze & silver made by hand",
  description:
    "Browse the Velora catalogue across four houses of metal. Hand-raised vessels, tableware, lighting and objects. Trade pricing on application.",
};

export default function CollectionsPage({
  searchParams,
}: {
  searchParams: { house?: string };
}) {
  const houseParam = searchParams.house;
  const collection = houseParam ? getCollection(houseParam) : null;

  // ── Category landing ────────────────────────────────────────────────────────
  if (!collection) {
    return (
      <div className="pt-[80px]">
        <CollectionLanding />
      </div>
    );
  }

  // ── House product grid ──────────────────────────────────────────────────────
  const specimens = specimensByCollection(collection.slug);

  return (
    <Section pad="md" className="pt-[clamp(110px,13vw,160px)]">
      <Shell>
        <Reveal>
          <Link
            href="/collections"
            className="link-draw inline-flex items-center gap-2 text-[0.68rem] uppercase tracking-wider2 text-stone hover:text-bitumen"
          >
            <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            All collections
          </Link>
        </Reveal>

        <div className="mt-6 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <Reveal>
              <Eyebrow>House {collection.index}</Eyebrow>
            </Reveal>
            <MaskText
              as="h1"
              className="display mt-4 text-[clamp(2.4rem,6vw,4.4rem)] text-bitumen"
              lines={[collection.name + "."]}
            />
            <p className="mt-3 text-[0.72rem] uppercase tracking-wider2 text-brass-deep">
              {collection.material} · {collection.tagline}
            </p>
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
