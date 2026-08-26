import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { createHash } from "crypto";
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
 *    create a Blob store AND connect it to the project — creating the store on
 *    its own is not enough).
 *  • Local dev: falls back to `data/catalog.json` on disk, so `next dev` needs
 *    zero setup.
 *
 * Either way the compiled seed in data.ts is the last-resort fallback so the
 * storefront always renders.
 *
 * ── On silent failure ──────────────────────────────────────────────────────
 * The previous version wrapped every read in a bare `catch {}` that returned
 * the seed. That made four unrelated situations indistinguishable from outside:
 * Blob not configured, Blob unreachable, catalogue not yet written, and
 * catalogue corrupt. The live site served the seed and the CMS still reported
 * success. Every read now records *why* it returned what it did, and
 * `catalogSource()` exposes that to /api/health and the check:live diagnostic.
 */
export interface Catalog {
  collections: Collection[];
  specimens: Specimen[];
  /** Server-stamped on every successful write. Never trust a browser clock. */
  updatedAt?: string;
}

export const CATALOG_TAG = "catalog";
const BLOB_KEY = "catalog.json";
const DATA_DIR = path.join(process.cwd(), "data");
const FILE = path.join(DATA_DIR, "catalog.json");

// Photo path rules live in photo-shared.ts so the CMS's client code can import
// them too — this module is server-only and cannot cross that boundary.
export { PHOTO_PREFIX, PHOTO_PATTERN, isValidPhotoPath, isValidSha } from "./photo-shared";

export const usingBlob = Boolean(process.env.BLOB_READ_WRITE_TOKEN);

export type CatalogSource =
  | "blob"
  | "file"
  | "seed:blob-empty"
  | "seed:blob-error"
  | "seed:blob-unconfigured"
  | "seed:file-missing"
  | "seed:corrupt";

let lastSource: CatalogSource = usingBlob
  ? "seed:blob-empty"
  : "seed:blob-unconfigured";

/** How the most recent read resolved — surfaced by /api/health. */
export function catalogSource(): CatalogSource {
  return lastSource;
}

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

type Tagged = Catalog & { __source: CatalogSource };

async function loadRaw(): Promise<Tagged> {
  const tag = (c: Catalog, source: CatalogSource): Tagged => ({ ...c, __source: source });

  if (usingBlob) {
    try {
      const { list } = await import("@vercel/blob");
      const { blobs } = await list({ prefix: BLOB_KEY, limit: 100 });
      const found = blobs.find((b) => b.pathname === BLOB_KEY);
      if (!found) return tag(seed(), "seed:blob-empty");

      // The blob URL is stable across overwrites, so bust the fetch cache to
      // avoid serving a previous version's JSON. This only runs on a cache
      // miss (first read, or after revalidateTag), so it is cheap.
      const res = await fetch(`${found.url}?ts=${Date.now()}`, { cache: "no-store" });
      if (!res.ok) return tag(seed(), "seed:blob-error");
      const data = await res.json();
      if (!isCatalog(data)) return tag(seed(), "seed:corrupt");
      return tag(data, "blob");
    } catch {
      return tag(seed(), "seed:blob-error");
    }
  }

  try {
    const raw = await fs.readFile(FILE, "utf8");
    const data = JSON.parse(raw);
    if (!isCatalog(data)) return tag(seed(), "seed:corrupt");
    return tag(data, "file");
  } catch {
    // On Vercel with no Blob store connected, this is where every request
    // lands: process.cwd() is read-only and data/catalog.json will never exist.
    return tag(
      seed(),
      process.env.VERCEL ? "seed:blob-unconfigured" : "seed:file-missing",
    );
  }
}

const cachedLoad = unstable_cache(loadRaw, ["velora-catalog"], { tags: [CATALOG_TAG] });

/** Cross-request cached read; invalidated on save via revalidateTag(CATALOG_TAG). */
export async function readCatalog(): Promise<Catalog> {
  const { __source, ...catalog } = await cachedLoad();
  // unstable_cache replays a memoised value without re-running loadRaw, so a
  // module-level `lastSource` would go stale on every cache hit. Carry the
  // provenance inside the cached payload and restore it on the way out.
  lastSource = __source;
  return catalog;
}

/** Uncached read — the publish path must never diff against a cached copy. */
export async function readCatalogFresh(): Promise<Catalog> {
  const { __source, ...catalog } = await loadRaw();
  lastSource = __source;
  return catalog;
}

/** Derive collection counts from the specimens; drop empty subcategory arrays. */
export function normalizeCatalog(input: Catalog): Catalog {
  const specimens = Array.isArray(input.specimens) ? input.specimens : [];
  const collections = (Array.isArray(input.collections) ? input.collections : []).map((c) => ({
    ...c,
    count: specimens.filter((s) => s.collection === c.slug).length,
    subcategories:
      Array.isArray(c.subcategories) && c.subcategories.length ? c.subcategories : undefined,
  }));
  return { collections, specimens, updatedAt: input.updatedAt };
}

/** Raised when persistence is impossible, so callers can say so plainly. */
export class CatalogWriteError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "CatalogWriteError";
  }
}

export async function writeCatalog(input: Catalog): Promise<Catalog> {
  // Stamped here, on the server, from the server clock. A browser in another
  // timezone — or with a wrong clock — must not be able to write a catalogue
  // that looks older or newer than it really is.
  const data = normalizeCatalog({ ...input, updatedAt: new Date().toISOString() });
  const json = JSON.stringify(data, null, 2);

  if (usingBlob) {
    try {
      const { put } = await import("@vercel/blob");
      await put(BLOB_KEY, json, {
        access: "public",
        addRandomSuffix: false,
        allowOverwrite: true,
        contentType: "application/json",
      });
    } catch (e) {
      throw new CatalogWriteError(
        `Could not write the catalogue to Vercel Blob: ${
          e instanceof Error ? e.message : String(e)
        }`,
        502,
      );
    }
    return data;
  }

  if (process.env.VERCEL) {
    // Guard, rather than letting fs.writeFile throw EROFS deep in the stack and
    // surface as an opaque 500 the CMS reports as a generic failure.
    throw new CatalogWriteError(
      "No Blob store is connected to this project, so there is nowhere to save. " +
        "Vercel's filesystem is read-only. Create a Blob store (Storage → Create → Blob), " +
        "connect it to this project so BLOB_READ_WRITE_TOKEN is injected, then redeploy.",
      503,
    );
  }

  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(FILE, json, "utf8");
  } catch (e) {
    throw new CatalogWriteError(
      `Could not write ${FILE}: ${e instanceof Error ? e.message : String(e)}`,
      500,
    );
  }
  return data;
}

/* ---------- content-addressed product photos ---------- */

/**
 * Photo filename derived from the bytes themselves: the first 20 hex chars of
 * their SHA-256 plus the real extension. Two consequences worth the trouble —
 * the same photo uploaded twice yields the same name, so it is stored once; and
 * the content behind a URL can never change, so it is cacheable forever.
 */
export function photoName(bytes: Uint8Array, ext: string): string {
  const hash = createHash("sha256").update(bytes).digest("hex").slice(0, 20);
  return `${hash}.${ext}`;
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
