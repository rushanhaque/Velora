#!/usr/bin/env node
/**
 * Re-encode everything in public/media to WebP at sensible dimensions.
 *
 * Two problems this fixes. The source files were maximum-quality encodes far
 * larger than any layout needs — the twelve 1024x1024 "about" images averaged
 * 760 KB each (and were JPEGs wearing a .png extension). And next/image has to
 * decode and re-encode each original on the first request for every size and
 * format, so an oversized source makes the *first* visitor wait seconds for an
 * image the CDN will then serve instantly to everyone else.
 *
 * Shrinking the source shrinks that cold cost as well as the bytes.
 *
 * Idempotent: skips a file whose .webp already exists and is newer.
 * Run with --dry to see what it would do.
 */
import { readdirSync, statSync, existsSync, unlinkSync } from "node:fs";
import { join, basename, dirname, sep } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const MEDIA = join(ROOT, "public", "media");
const DRY = process.argv.includes("--dry");
const PRUNE = process.argv.includes("--prune");

/** Nothing in this design is displayed above these widths. */
const MAX_WIDTH = { about: 1200, catalog: 1400, signature: 1600, _default: 1800 };
const QUALITY = 78;

function* walk(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else yield p;
  }
}

const results = [];
let before = 0;
let after = 0;

for (const file of walk(MEDIA)) {
  if (!/\.(png|jpe?g)$/i.test(file)) continue;
  const out = file.replace(/\.(png|jpe?g)$/i, ".webp");
  const srcSize = statSync(file).size;

  if (existsSync(out) && statSync(out).mtimeMs >= statSync(file).mtimeMs) {
    before += srcSize;
    after += statSync(out).size;
    continue;
  }

  const bucket = basename(dirname(file));
  const maxW = MAX_WIDTH[bucket] ?? MAX_WIDTH._default;
  const meta = await sharp(file).metadata();

  if (!DRY) {
    await sharp(file)
      .resize({ width: Math.min(meta.width ?? maxW, maxW), withoutEnlargement: true })
      .webp({ quality: QUALITY, effort: 6 })
      .toFile(out);
  }

  const outSize = DRY ? 0 : statSync(out).size;
  before += srcSize;
  after += outSize;
  results.push({
    file: file.replace(ROOT, "").split(sep).join("/"),
    from: srcSize,
    to: outSize,
    w: `${meta.width}→${Math.min(meta.width ?? maxW, maxW)}`,
  });
}

for (const r of results.sort((a, b) => b.from - a.from).slice(0, 15)) {
  const pct = r.to ? Math.round((1 - r.to / r.from) * 100) : 0;
  console.log(
    `${(r.from / 1024).toFixed(0).padStart(6)} KB → ${(r.to / 1024).toFixed(0).padStart(5)} KB  ` +
      `(-${String(pct).padStart(2)}%)  ${r.w.padEnd(12)} ${r.file}`,
  );
}
if (results.length > 15) console.log(`  … and ${results.length - 15} more`);

console.log(
  `\n${results.length} converted · ${(before / 1048576).toFixed(2)} MB → ` +
    `${(after / 1048576).toFixed(2)} MB (-${Math.round((1 - after / before) * 100)}%)`,
);

if (PRUNE && !DRY) {
  let removed = 0;
  for (const file of walk(MEDIA)) {
    if (!/\.(png|jpe?g)$/i.test(file)) continue;
    if (existsSync(file.replace(/\.(png|jpe?g)$/i, ".webp"))) {
      unlinkSync(file);
      removed++;
    }
  }
  console.log(`Pruned ${removed} original file(s).`);
}
