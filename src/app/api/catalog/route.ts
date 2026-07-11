import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { readCatalog, writeCatalog, CATALOG_TAG, type Catalog } from "@/lib/catalog-store";
import { isAuthed } from "@/lib/admin-auth";

// The CMS must always read/write live data, never a cached response.
export const dynamic = "force-dynamic";

export async function GET() {
  const catalog = await readCatalog();
  return NextResponse.json(catalog);
}

export async function PUT(req: Request) {
  if (!isAuthed()) {
    return NextResponse.json({ error: "Not authorised." }, { status: 401 });
  }

  let body: Catalog;
  try {
    body = (await req.json()) as Catalog;
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
  const slugs = new Set<string>();
  for (const s of body.specimens) {
    if (!s.slug || typeof s.slug !== "string") {
      return NextResponse.json({ error: `A product is missing a slug.` }, { status: 400 });
    }
    if (slugs.has(s.slug)) {
      return NextResponse.json({ error: `Duplicate product slug: ${s.slug}.` }, { status: 400 });
    }
    slugs.add(s.slug);
  }

  const saved = await writeCatalog(body);

  // Invalidate the cached catalog read, then the rendered storefront pages.
  revalidateTag(CATALOG_TAG);
  revalidatePath("/");
  revalidatePath("/collections");
  revalidatePath("/collections/[slug]", "page");
  revalidatePath("/sitemap.xml");

  return NextResponse.json({ ok: true, catalog: saved });
}
