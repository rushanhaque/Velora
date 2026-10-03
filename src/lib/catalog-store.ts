import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { createHash } from "crypto";
import {
  commitFiles,
  readFileFromGitHub,
  isGitHubConfigured,
  GitHubCommitError,
} from "./github-commit";
import { unstable_noStore } from "next/cache";
import { cache } from "react";
import {
  COLLECTIONS as SEED_COLLECTIONS,
  SPECIMENS as SEED_SPECIMENS,
  type Collection,
  type Specimen,
} from "./data";

/** Read and write the same authoritative backend; remote failures never become seed data. */
export interface Catalog {
  collections: Collection[];
  specimens: Specimen[];
  /** Server-stamped on every successful write. Never trust a browser clock. */
  updatedAt?: string;
}

export const CATALOG_TAG = "catalog";
const DATA_DIR = path.join(process.cwd(), "data");
const FILE = path.join(DATA_DIR, "catalog.json");

// Photo path rules live in photo-shared.ts so the CMS's client code can import
// them too — this module is server-only and cannot cross that boundary.
export { PHOTO_PREFIX, PHOTO_PATTERN, isValidPhotoPath, isValidSha } from "./photo-shared";

export type CatalogSource =
  | "seed:github-empty"
  | "github"
  | "file"
  | "seed:file-missing"
  | "seed:corrupt";

let lastSource: CatalogSource = "seed:file-missing";

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

  if (isGitHubConfigured()) {
    const raw = await readFileFromGitHub("data/catalog.json");
    if (raw === null) return tag(seed(), "seed:github-empty");
    const data = JSON.parse(raw);
    if (!isCatalog(data)) throw new Error("GitHub catalogue is invalid.");
    return tag(data, "github");
  }

  if (process.env.VERCEL) {
    throw new Error("GITHUB_TOKEN is not set. Configure the fine-grained token in Vercel and redeploy.");
  }

  // ── Local filesystem ─────────────────────────────────────────────────────
  try {
    const raw = await fs.readFile(FILE, "utf8");
    const data = JSON.parse(raw);
    if (!isCatalog(data)) return tag(seed(), "seed:corrupt");
    return tag(data, "file");
  } catch {
    // fall through
  }


  return tag(seed(), "seed:file-missing");
}

/** Request-scoped deduplication only. No persistent Next Data Cache. */
export const readCatalog = cache(async (): Promise<Catalog> => {
  unstable_noStore();
  return readCatalogFresh();
});

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

export async function writeCatalog(input: Catalog, expectedVersion?: string | null): Promise<Catalog> {
  // Stamped here, on the server, from the server clock. A browser in another
  // timezone — or with a wrong clock — must not be able to write a catalogue
  // that looks older or newer than it really is.
  const data = normalizeCatalog({ ...input, updatedAt: new Date().toISOString() });
  const json = JSON.stringify(data, null, 2);

  // ── GitHub (production on Vercel) ────────────────────────────────────────
  if (isGitHubConfigured()) {
    try {
      await commitFiles(
        [{ path: "data/catalog.json", content: json }],
        `📦 Update product catalogue — ${new Date().toISOString()}`,
        expectedVersion,
      );
    } catch (e) {
      if (e instanceof GitHubCommitError) {
        throw new CatalogWriteError(`GitHub commit failed: ${e.message}`, e.status);
      }
      throw e;
    }
    return data;
  }

  if (process.env.VERCEL) {
    throw new CatalogWriteError(
      "GITHUB_TOKEN is not set. Add your fine-grained GitHub token in Vercel and redeploy.",
      503,
    );
  }

  // ── Local dev: write to filesystem ───────────────────────────────────────
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
