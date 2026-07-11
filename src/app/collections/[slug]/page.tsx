import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Section, Shell } from "@/components/ui/Section";
import { SpecimenDetail } from "@/components/collections/SpecimenDetail";
import { SpecimenCard } from "@/components/ui/SpecimenCard";
import { MaskText } from "@/components/motion/MaskText";
import { Reveal } from "@/components/motion/Reveal";
import { Eyebrow } from "@/components/ui/Atoms";
import {
  readCatalog,
  selectSpecimen,
  selectCollection,
  selectRelated,
} from "@/lib/catalog-store";

export async function generateStaticParams() {
  const catalog = await readCatalog();
  return catalog.specimens.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const catalog = await readCatalog();
  const s = selectSpecimen(catalog, params.slug);
  if (!s) return { title: "Piece not found" };
  return {
    title: `${s.name} — ${s.ref}`,
    description: `${s.desc} ${s.material}${s.finish ? `, ${s.finish}` : ""}. Handcrafted in Moradabad, made to order.`,
  };
}

export default async function SpecimenPage({ params }: { params: { slug: string } }) {
  const catalog = await readCatalog();
  const s = selectSpecimen(catalog, params.slug);
  if (!s) notFound();
  const collection = selectCollection(catalog, s.collection);
  const related = selectRelated(catalog, s.slug, 3);

  return (
    <>
      <Section pad="md" className="pt-[clamp(88px,10vw,120px)]">
        <Shell>
          <SpecimenDetail s={s} collection={collection} />
        </Shell>
      </Section>

      {/* Related */}
      <Section pad="lg" className="bg-parchment-deep/45">
        <Shell>
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div>
              <Reveal>
                <Eyebrow>From the same hands</Eyebrow>
              </Reveal>
              <MaskText
                as="h2"
                className="display mt-6 text-[clamp(2rem,4.6vw,3.4rem)] text-bitumen"
                lines={["You may also like."]}
              />
            </div>
            <Reveal delay={120}>
              <Link
                href="/collections"
                className="link-draw text-[0.78rem] uppercase tracking-wide3 text-bitumen"
              >
                All pieces →
              </Link>
            </Reveal>
          </div>

          <div className="mt-14 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r, i) => (
              <Reveal key={r.slug} delay={i * 70} className="h-full">
                <SpecimenCard s={r} index={i} showCaption />
              </Reveal>
            ))}
          </div>
        </Shell>
      </Section>
    </>
  );
}
