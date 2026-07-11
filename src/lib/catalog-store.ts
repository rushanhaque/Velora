import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { unstable_cache } from "next/cache";
import {
  COLLECTIONS as SEED_COLLECTIONS,
  SPECIMENS as SEED_SPECIMENS,
  type Collection,
  type Specimen,
} from "./data";

/**
 * Runtime catalog store — works in two modes:
 *
 *  • Vercel (production): reads/writes a JSON blob in **Vercel Blob** storage,
 *    which survives deploys and the read-only serverless filesystem. Active
 *    whenever BLOB_READ_WRITE_TOKEN is present (Vercel injects it once you
 *    connect a Blob store to the project).
 *  • Local dev: falls back to `data/catalog.json` on disk, so `next dev` needs
 *    zero setup.
 *
 * Either way the compiled seed in data.ts is the fallback until a catalog has
 * been saved, so the storefront always renders. The CMS saves the whole
 * catalog at once; readCatalog is cached and invalidated with
 * `revalidateTag("catalog")` on save.
 */
export interface Catalog {
  collections: Collection[];
  specimens: Specimen[];
}

export const CATALOG_TAG = "catalog";
const BLOB_KEY = "catalog.json";
const DATA_DIR = path.join(process.cwd(), "data");
const FILE = path.join(DATA_DIR, "catalog.json");

export const usingBlob = Boolean(process.env.BLOB_READ_WRITE_TOKEN);

function seed(): Catalog {
  return {
    collections: JSON.parse(JSON.stringify(SEED_COLLECTIONS)),
    specimens: JSON.parse(JSON.stringify(SEED_SPECIMENS)),
  };
}

function isCatalog(x: unknown): x is Catalog {
  return (
    !!x &&
    typeof x === "object" &&
    Array.isArray((x as Catalog).collections) &&
    Array.isArray((x as Catalog).specimens)
  );
}

async function loadRaw(): Promise<Catalog> {
  if (usingBlob) {
    try {
      const { list } = await import("@vercel/blob");
      const { blobs } = await list({ prefix: BLOB_KEY, limit: 100 });
      const found = blobs.find((b) => b.pathname === BLOB_KEY);
      if (found) {
        // The blob URL is stable across overwrites, so bust the fetch cache to
        // avoid serving a previous version's JSON. This only runs on a cache
        // miss (first read or after revalidateTag), so it is cheap.
        const res = await fetch(`${found.url}?ts=${Date.now()}`);
        if (res.ok) {
          const data = await res.json();
          if (isCatalog(data)) return data;
        }
      }
    } catch {
      // blob not reachable / not configured yet — fall back to seed
    }
    return seed();
  }

  try {
    const raw = await fs.readFile(FILE, "utf8");
    const data = JSON.parse(raw);
    if (isCatalog(data)) return data;
  } catch {
    // no file yet, or malformed — fall back to seed
  }
  return seed();
}

/** Cross-request cached read; invalidated on save via revalidateTag(CATALOG_TAG). */
export const readCatalog = unstable_cache(loadRaw, ["velora-catalog"], {
  tags: [CATALOG_TAG],
});

/** Derive collection counts from the specimens; drop empty subcategory arrays. */
export function normalizeCatalog(input: Catalog): Catalog {
  const specimens = Array.isArray(input.specimens) ? input.specimens : [];
  const collections = (Array.isArray(input.collections) ? input.collections : []).map((c) => ({
    ...c,
    count: specimens.filter((s) => s.collection === c.slug).length,
    subcategories:
      Array.isArray(c.subcategories) && c.subcategories.length ? c.subcategories : undefined,
  }));
  return { collections, specimens };
}

export async function writeCatalog(input: Catalog): Promise<Catalog> {
  const data = normalizeCatalog(input);
  const json = JSON.stringify(data, null, 2);

  if (usingBlob) {
    const { put } = await import("@vercel/blob");
    await put(BLOB_KEY, json, {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
    });
  } else {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(FILE, json, "utf8");
  }
  return data;
}

/* ---------- server-side selectors over a given catalog ---------- */
export function selectCollection(cat: Catalog, slug: string) {
  return cat.collections.find((c) => c.slug === slug);
}
export function selectByCollection(cat: Catalog, slug: string) {
  return cat.specimens.filter((s) => s.collection === slug);
}
export function selectSpecimen(cat: Catalog, slug: string) {
  return cat.specimens.find((s) => s.slug === slug);
}
export function selectRelated(cat: Catalog, slug: string, n = 3) {
  const me = selectSpecimen(cat, slug);
  if (!me) return cat.specimens.slice(0, n);
  const same = cat.specimens.filter((s) => s.slug !== slug && s.collection === me.collection);
  const rest = cat.specimens.filter((s) => s.slug !== slug && s.collection !== me.collection);
  return [...same, ...rest].slice(0, n);
}
