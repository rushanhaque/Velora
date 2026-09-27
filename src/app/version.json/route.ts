import { NextResponse } from "next/server";
import { readCatalogFresh } from "@/lib/catalog-store";
import { createHash } from "crypto";
import { BUILD_ID } from "@/lib/build-id";

/**
 * The freshness beacon. Every public page polls this and compares the `buildId`
 * here against the one compiled into its own bundle; a mismatch means the
 * browser is running a previous deploy's JavaScript and it reloads once.
 *
 * This response must NEVER be cached — by the CDN, by the browser, or by an
 * intermediate proxy. If it were, a device could read a stale build ID and
 * conclude it was up to date while serving code from an old deploy, which is
 * the exact failure this endpoint exists to prevent.
 */
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  let catalogVersion: string | undefined;
  try {
    const catalog = await readCatalogFresh();
    catalogVersion = createHash("sha256").update(JSON.stringify(catalog)).digest("hex");
  } catch {
    // A storage outage must not prevent clients discovering a code deployment.
  }
  return NextResponse.json(
    { buildId: BUILD_ID, catalogVersion, serverTime: new Date().toISOString() },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        "CDN-Cache-Control": "no-store",
        "Vercel-CDN-Cache-Control": "no-store",
        "Pragma": "no-cache",
      },
    },
  );
}
