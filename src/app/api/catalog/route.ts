import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import {
  readCatalog,
  readCatalogFresh,
  writeCatalog,
  catalogSource,
  CatalogWriteError,
  CATALOG_TAG,
  type Catalog,
} from "@/lib/catalog-store";
import { isValidPhotoPath, isRepoMediaPath } from "@/lib/photo-shared";
import { isAuthed } from "@/lib/admin-auth";

// The CMS must always read/write live data, never a cached response.
export const dynamic = "force-dynamic";

const LIVE_CACHE = "no-store, max-age=0";

export async function GET() {
  let catalog: Catalog;
  try { catalog = await readCatalog(); }
  catch { return NextResponse.json({ error: "Catalogue storage unavailable. Please try again." }, {
    status: 503, headers: { "Cache-Control": LIVE_CACHE, "CDN-Cache-Control": LIVE_CACHE, "Vercel-CDN-Cache-Control": LIVE_CACHE },
  }); }
  return NextResponse.json(catalog, {
    headers: {
      "Cache-Control": LIVE_CACHE,
      "CDN-Cache-Control": LIVE_CACHE,
      "Vercel-CDN-Cache-Control": LIVE_CACHE,
      // Lets the CMS and check:live tell "the seed, because nothing is
      // configured" apart from "a real published catalogue" without guessing.
      "X-Catalog-Source": catalogSource(),
    },
  });
}

export async function PUT(req: Request) {
  if (!isAuthed()) {
    return NextResponse.json({ error: "Not authorised." }, { status: 401 });
  }

  let body: Catalog & { baseUpdatedAt?: string | null };
  try {
    body = (await req.json()) as Catalog & { baseUpdatedAt?: string | null };
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!body || !Array.isArray(body.collections) || !Array.isArray(body.specimens)) {
    return NextResponse.json(
      { error: "Malformed catalog — expected { collections[], specimens[] }." },
      { status: 400 },
    );
  }

  // Guard: every specimen must have a slug and belong to a real collection.
  const collectionSlugs = new Set<string>();
  for (const c of body.collections) {
    if (!c || typeof c.slug !== "string" || !c.slug || collectionSlugs.has(c.slug)) {
      return NextResponse.json({ error: "Collection slugs must be unique and non-empty." }, { status: 400 });
    }
    collectionSlugs.add(c.slug);
  }
  const slugs = new Set<string>();
  for (const s of body.specimens) {
    if (!s || !s.slug || typeof s.slug !== "string") {
      return NextResponse.json({ error: `A product is missing a slug.` }, { status: 400 });
    }
    if (slugs.has(s.slug)) {
      return NextResponse.json({ error: `Duplicate product slug: ${s.slug}.` }, { status: 400 });
    }
    if (!collectionSlugs.has(s.collection)) return NextResponse.json({ error: "Product collection does not exist." }, { status: 400 });
    slugs.add(s.slug);
  }

  // ── Photo references are untrusted input ────────────────────────────────
  // The CMS runs in a browser that can be driven directly, so every path is
  // re-checked here. Only a content-addressed photo (bare or as a Blob URL) or
  // a repo asset under /media/ is allowed; traversal and scriptable extensions
  // such as .svg are refused outright.
  const badPath = (label: string, value: string) =>
    NextResponse.json(
      { error: `Rejected photo path for ${label}: ${value}` },
      { status: 400 },
    );
  for (const s of body.specimens) {
    for (const [field, value] of [
      ["image", s.image],
      ["poster", s.poster],
    ] as const) {
      if (value && !isRepoMediaPath(value) && !isValidPhotoPath(value)) {
        return badPath(`"${s.slug}" (${field})`, value);
      }
    }
    for (const g of s.gallery ?? []) {
      if (g && !isRepoMediaPath(g) && !isValidPhotoPath(g)) {
        return badPath(`"${s.slug}" (gallery)`, g);
      }
    }
  }
  for (const c of body.collections) {
    if (c.cover && !isRepoMediaPath(c.cover) && !isValidPhotoPath(c.cover)) {
      return badPath(`collection "${c.slug}"`, c.cover);
    }
  }

  // ── Conflict detection ──────────────────────────────────────────────────
  // The CMS sends back the `updatedAt` it originally loaded. If the stored
  // catalogue has moved on since then, somebody else published in the meantime
  // and blindly writing would erase their work. Report the conflict and let a
  // human decide — never overwrite silently.
  let current: Catalog;
  try { current = await readCatalogFresh(); }
  catch { return NextResponse.json({ error: "Cannot verify the live catalogue. Publish was not attempted." }, { status: 503 }); }
  const base = body.baseUpdatedAt ?? null;
  if ((current.updatedAt ?? null) !== base) {
    return NextResponse.json(
      {
        error:
          "The live catalogue changed while you were editing — someone else published from " +
          "another device or browser. Reload to pick up their version, then re-apply your edits.",
        conflict: true,
        liveUpdatedAt: current.updatedAt,
        yourBase: base,
      },
      { status: 409 },
    );
  }

  let saved: Catalog;
  try {
    saved = await writeCatalog({ collections: body.collections, specimens: body.specimens }, base);
  } catch (e) {
    if (e instanceof CatalogWriteError) {
      // A real, actionable message instead of an opaque 500. This is the path
      // that fires when no Blob store is connected — previously it surfaced as
      // a generic failure while the CMS had already claimed success.
      return NextResponse.json({ error: e.message, storage: catalogSource() }, { status: e.status });
    }
    throw e;
  }

  // Invalidate the cached catalog read, then the rendered storefront pages.
  revalidateTag(CATALOG_TAG);
  revalidatePath("/");
  revalidatePath("/collections");
  revalidatePath("/collections/[slug]", "page");
  revalidatePath("/sitemap.xml");

  return NextResponse.json(
    { ok: true, catalog: saved },
    { headers: { "Cache-Control": "no-store" } },
  );
}
