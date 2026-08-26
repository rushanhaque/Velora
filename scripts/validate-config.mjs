#!/usr/bin/env node
/**
 * Validate vercel.json before every build.
 *
 * Vercel's deployment schema sets `additionalProperties: false` on essentially
 * every object, so a single unrecognised key rejects the *entire* deployment.
 * The failure mode is nasty: the push is refused server-side, no build log is
 * produced, and the site simply never updates. The most common culprit is a
 * "//" key used as a comment — JSON has no comments, and Vercel does not make
 * an exception for that convention.
 *
 * This runs as `prebuild`, so the same mistake fails loudly here in one second
 * instead of quietly on the host.
 *
 * Exit codes: 0 valid · 1 invalid · 2 could not read/parse.
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const FILE = resolve(ROOT, "vercel.json");

/** Top-level keys Vercel accepts. Anything else rejects the deploy. */
const KNOWN_TOP_LEVEL = new Set([
  "$schema",
  "buildCommand",
  "cleanUrls",
  "crons",
  "devCommand",
  "framework",
  "functions",
  "git",
  "headers",
  "ignoreCommand",
  "images",
  "installCommand",
  "outputDirectory",
  "public",
  "redirects",
  "regions",
  "rewrites",
  "trailingSlash",
]);

const errors = [];
const warnings = [];

/** Walk every object in the tree looking for comment-style keys. */
function scanForCommentKeys(node, path = "") {
  if (Array.isArray(node)) {
    node.forEach((v, i) => scanForCommentKeys(v, `${path}[${i}]`));
    return;
  }
  if (!node || typeof node !== "object") return;
  for (const key of Object.keys(node)) {
    const here = path ? `${path}.${key}` : key;
    if (key === "//" || key.startsWith("//") || key.startsWith("#")) {
      errors.push(
        `Comment key ${JSON.stringify(key)} at "${here}". Vercel sets ` +
          "additionalProperties:false, so this silently rejects the whole deploy. Remove it.",
      );
    }
    scanForCommentKeys(node[key], here);
  }
}

function main() {
  if (!existsSync(FILE)) {
    console.log("✓ vercel.json  no config file — Vercel uses its defaults. Nothing to validate.");
    return 0;
  }

  let raw;
  try {
    raw = readFileSync(FILE, "utf8");
  } catch (e) {
    console.error(`✗ vercel.json  could not be read: ${e.message}`);
    return 2;
  }

  let config;
  try {
    config = JSON.parse(raw);
  } catch (e) {
    console.error(`✗ vercel.json  is not valid JSON: ${e.message}`);
    console.error("  Vercel refuses the deploy without a usable error. Fix the syntax.");
    return 2;
  }

  if (!config || typeof config !== "object" || Array.isArray(config)) {
    errors.push("Top level must be a JSON object.");
  } else {
    scanForCommentKeys(config);

    for (const key of Object.keys(config)) {
      if (key === "//" || key.startsWith("//") || key.startsWith("#")) continue; // already reported
      if (!KNOWN_TOP_LEVEL.has(key)) {
        errors.push(
          `Unknown top-level key ${JSON.stringify(key)}. Vercel rejects deploys containing ` +
            "properties outside its schema.",
        );
      }
    }

    // A stray `builds` key silently disables Vercel's zero-config framework
    // detection, which turns a working Next.js app into a directory listing.
    if ("builds" in config) {
      errors.push(
        '"builds" disables zero-config framework detection. Remove it unless you know ' +
          "you need a custom build pipeline.",
      );
    }
    if (config.framework !== undefined && config.framework !== "nextjs") {
      warnings.push(
        `"framework" is ${JSON.stringify(config.framework)} but this is a Next.js project.`,
      );
    }
    for (const arrayKey of ["headers", "redirects", "rewrites", "crons"]) {
      if (arrayKey in config && !Array.isArray(config[arrayKey])) {
        errors.push(`"${arrayKey}" must be an array.`);
      }
    }
  }

  for (const w of warnings) console.warn(`  ! ${w}`);

  if (errors.length) {
    console.error(`\n✗ vercel.json is invalid — ${errors.length} problem(s):\n`);
    for (const e of errors) console.error(`  • ${e}`);
    console.error(
      "\n  Left unfixed, Vercel refuses every push while reporting nothing: the site just\n" +
        "  never updates. Fix the above and build again.\n",
    );
    return 1;
  }

  console.log(`✓ vercel.json  valid (${Object.keys(config).length} key(s), no comment keys)`);
  return 0;
}

process.exit(main());
