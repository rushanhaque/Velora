import type { Metadata } from "next";
import { Section, Shell } from "@/components/ui/Section";
import { DrumIndex } from "@/components/collections/DrumIndex";
import { CatalogueClient } from "@/components/collections/CatalogueClient";
import { MaskText } from "@/components/motion/MaskText";
import { readCatalog, selectCollection, selectByCollection } from "@/lib/catalog-store";

export const metadata: Metadata = {
  title: "The Collections — lighting, decor, tableware & more",
  description:
    "Browse the Velora catalogue across six collections — lighting, decor, kitchenware, accessories, clocks and wedding. Handcrafted objects in brass, glass, crystal, porcelain and silver.",
};

export default async function CollectionsPage({
  searchParams,
}: {
  searchParams: { house?: string };
}) {
  const catalog = await readCatalog();
  const houseParam = searchParams.house;
  const collection = houseParam ? selectCollection(catalog, houseParam) : null;

  // ── Category landing — the indexing drum ───────────────────────────────────
  if (!collection) {
    return <DrumIndex collections={catalog.collections} />;
  }

  // ── House product grid ──────────────────────────────────────────────────────
  const specimens = selectByCollection(catalog, collection.slug);

  return (
    <Section pad="md" className="pt-[clamp(110px,13vw,160px)]">
      <Shell>
        <div>
          <MaskText
            as="h1"
            className="display mt-4 text-[clamp(2.4rem,6vw,4.4rem)] text-bitumen"
            lines={[collection.name + "."]}
          />
        </div>

        <div className="mt-14">
          <CatalogueClient specimens={specimens} subcategories={collection.subcategories} />
        </div>
      </Shell>
    </Section>
  );
}
