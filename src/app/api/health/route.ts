import { NextResponse } from "next/server";
import { readCatalogFresh, catalogSource, usingBlob } from "@/lib/catalog-store";
import { BUILD_ID } from "@/lib/build-id";

export const dynamic = "force-dynamic";

/**
 * Machine-readable answer to "why is the live site not showing my changes?".
 *
 * This exists because the single hardest bug in this project was invisible from
 * outside: with no Blob store connected, every read silently fell back to the
 * compiled seed while the CMS reported a successful publish. Nothing in any
 * response distinguished "nothing has ever been published" from "the catalogue
 * loaded fine". Now it does.
 *
 * Deliberately leaks no secrets — only whether a token is present, never its
 * value. Consumed by `npm run check:live`.
 */
export async function GET() {
  const catalog = await readCatalogFresh();
  const source = catalogSource();

  const problems: string[] = [];
  if (!usingBlob) {
    problems.push(
      "BLOB_READ_WRITE_TOKEN is not set. Publishing cannot persist: Vercel's filesystem " +
        "is read-only. Create a Blob store and connect it to this project.",
    );
  }
  if (source.startsWith("seed:")) {
    problems.push(
      `The catalogue being served is the compiled seed (${source}), not a published ` +
        "catalogue. Nothing saved from the CMS is reaching the storefront.",
    );
  }

  return NextResponse.json(
    {
      ok: problems.length === 0,
      buildId: BUILD_ID,
      storage: {
        blobConfigured: usingBlob,
        catalogSource: source,
        catalogUpdatedAt: catalog.updatedAt ?? null,
      },
      catalog: {
        collections: catalog.collections.length,
        specimens: catalog.specimens.length,
        photosOnBlob: catalog.specimens.filter((s) =>
          s.image?.includes("blob.vercel-storage"),
        ).length,
        photosInline: catalog.specimens.filter((s) => s.image?.startsWith("data:")).length,
      },
      problems,
      serverTime: new Date().toISOString(),
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
