import { NextResponse } from "next/server";
import { readCatalogFresh, catalogSource } from "@/lib/catalog-store";
import { isGitHubConfigured, githubTarget } from "@/lib/github-commit";
import { BUILD_ID } from "@/lib/build-id";

export const dynamic = "force-dynamic";

/** Non-secret publishing diagnostics, consumed by npm run check:live. */
export async function GET() {
  let catalog;
  try { catalog = await readCatalogFresh(); }
  catch {
    return NextResponse.json({ ok: false, buildId: BUILD_ID, problems: ["Authoritative catalogue storage is unreachable or invalid."] },
      { status: 503, headers: { "Cache-Control": "no-store" } });
  }
  const source = catalogSource();

  const problems: string[] = [];
  if (process.env.VERCEL && !isGitHubConfigured()) {
    problems.push(
      "No writable catalogue backend is configured. Set GITHUB_TOKEN.",
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
        githubTarget: githubTarget(),
        githubConfigured: isGitHubConfigured(),
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
