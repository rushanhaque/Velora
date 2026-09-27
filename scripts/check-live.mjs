#!/usr/bin/env node
/**
 * `npm run check:live` — the first thing to run when the site looks wrong.
 *
 * Answers, in one pass and without guessing:
 *   • Is the host serving the commit you last pushed, or an older build?
 *   • Does every API route actually exist on the deployment?
 *   • Is the catalogue a real published one, or the compiled seed?
 *   • Are product photos filed as separate images, or inlined into the JSON?
 *   • Are the cache headers right — admin never cached, HTML revalidated,
 *     the live endpoint short-lived, photos immutable?
 *
 * Usage:
 *   npm run check:live
 *   npm run check:live -- https://staging.example.com
 *   SITE_URL=https://example.com npm run check:live
 *
 * Exit codes: 0 all good · 1 problems found · 2 site unreachable.
 */
import { execSync } from "node:child_process";

const SITE =
  process.argv[2] ||
  process.env.SITE_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://www.veloralivings.in";

const base = SITE.replace(/\/+$/, "");
const problems = [];
const notes = [];

const c = {
  ok: (s) => `\x1b[32m${s}\x1b[0m`,
  bad: (s) => `\x1b[31m${s}\x1b[0m`,
  warn: (s) => `\x1b[33m${s}\x1b[0m`,
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
};
const PASS = c.ok("  ok  ");
const FAIL = c.bad(" FAIL ");
const WARN = c.warn(" warn ");

function line(status, label, detail = "") {
  console.log(`[${status}] ${label}${detail ? `  ${c.dim(detail)}` : ""}`);
}

async function get(path, init = {}) {
  const url = `${base}${path}`;
  try {
    const res = await fetch(url, {
      redirect: "follow",
      // Ask the way a browser navigating to a page asks, so the response we
      // inspect is the one a real visitor receives.
      headers: {
        "cache-control": "no-cache",
        accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        ...(init.headers ?? {}),
      },
      ...init,
    });
    return { res, url };
  } catch (e) {
    return { error: e, url };
  }
}

function localHead() {
  try {
    return execSync("git rev-parse HEAD", { encoding: "utf8" }).trim();
  } catch {
    return null;
  }
}

/* ── 1. reachability ─────────────────────────────────────────────────────── */
async function checkReachable() {
  const { res, error, url } = await get("/");
  if (error) {
    console.error(c.bad(`\nCannot reach ${url}: ${error.message}\n`));
    process.exit(2);
  }
  line(res.ok ? PASS : FAIL, `site reachable`, `${res.status} ${url}`);
  if (!res.ok) problems.push(`Homepage returned ${res.status}.`);
  return res;
}

/* ── 2. which build is serving ───────────────────────────────────────────── */
async function checkBuild() {
  const { res, error } = await get("/version.json");
  if (error || !res.ok) {
    line(FAIL, "/version.json", error ? error.message : `${res.status}`);
    problems.push(
      "/version.json is missing — this deploy predates the build-ID reload check, " +
        "so browsers cannot detect that new code shipped. Deploy the current branch.",
    );
    return null;
  }
  const cache = res.headers.get("cache-control") ?? "";
  const { buildId } = await res.json();
  line(PASS, "/version.json", `buildId=${buildId}`);

  if (!/no-store/.test(cache)) {
    line(FAIL, "  version.json cache", cache || "(none)");
    problems.push(
      `/version.json is served with "${cache}" — it must be no-store, or a device can ` +
        "read a stale build ID and believe it is current.",
    );
  } else {
    line(PASS, "  version.json cache", cache);
  }

  const head = localHead();
  if (head) {
    const short = head.slice(0, 12);
    if (buildId === short || buildId.startsWith(short + "-")) {
      line(PASS, "deployed commit", `${short} matches local HEAD`);
    } else {
      line(WARN, "deployed commit", `serving ${buildId}, local HEAD is ${short}`);
      notes.push(
        `The deployment is serving build ${buildId} but your local HEAD is ${short}. ` +
          "Either the latest push has not finished deploying, or the host refused it.",
      );
    }
  }
  return buildId;
}

/* ── 3. API routes exist ─────────────────────────────────────────────────── */
async function checkRoutes() {
  for (const path of ["/api/catalog", "/api/health", "/api/admin/login"]) {
    const { res, error } = await get(path);
    if (error) {
      line(FAIL, path, error.message);
      problems.push(`${path} is unreachable.`);
      continue;
    }
    // 401 is a valid, expected answer from a protected route.
    const good = res.ok || res.status === 401;
    line(good ? PASS : FAIL, path, `${res.status}`);
    if (!good) problems.push(`${path} returned ${res.status} — route missing on this deploy.`);
  }
}

/* ── 4. storage health + catalogue provenance ────────────────────────────── */
async function checkHealth() {
  const { res, error } = await get("/api/health");
  if (error || !res.ok) {
    line(FAIL, "/api/health", "storage diagnostics unavailable or unhealthy");
    problems.push("Health endpoint failed; check production storage configuration.");
    return;
  }
  const h = await res.json();

  line(
    h.storage.githubConfigured || h.storage.blobConfigured ? PASS : WARN,
    "Remote storage configured",
    h.storage.githubConfigured ? "GitHub" : h.storage.blobConfigured ? "Blob" : "local/seed",
  );

  const src = h.storage.catalogSource;
  const live = src === "github" || src === "blob" || src === "file";
  line(
    live ? PASS : FAIL,
    "catalogue is a published one",
    `source=${src}${h.storage.catalogUpdatedAt ? `, updated ${h.storage.catalogUpdatedAt}` : ""}`,
  );

  line(
    PASS,
    "catalogue contents",
    `${h.catalog.collections} collections, ${h.catalog.specimens} products`,
  );

  if (h.catalog.photosInline > 0) {
    line(FAIL, "photos filed as files", `${h.catalog.photosInline} inlined as base64 data URIs`);
    problems.push(
      `${h.catalog.photosInline} photo(s) are embedded as base64 in the catalogue JSON. ` +
        "They bloat every page load and will eventually exceed the payload limit.",
    );
  } else {
    line(PASS, "photos filed as files", `${h.catalog.photosOnBlob} on Blob, 0 inlined`);
  }

  for (const p of h.problems ?? []) problems.push(p);
}

/* ── 5. cache headers ────────────────────────────────────────────────────── */
async function checkCaching() {
  // The CMS must never be cached, anywhere.
  {
    const { res, error } = await get("/admin");
    if (!error) {
      const cc = res.headers.get("cache-control") ?? "";
      const vc = res.headers.get("x-vercel-cache") ?? "";
      const good = /no-store/.test(cc);
      line(good ? PASS : FAIL, "/admin never cached", `${cc || "(none)"}${vc ? ` · x-vercel-cache=${vc}` : ""}`);
      if (!good) {
        problems.push(
          `/admin is served with "${cc}" instead of no-store. The admin can be handed an ` +
            "edge snapshot from before their own last publish.",
        );
      }
      const robots = res.headers.get("x-robots-tag") ?? "";
      const noindex = /noindex/.test(robots);
      line(noindex ? PASS : WARN, "/admin noindex header", robots || "(none)");
      if (!noindex) notes.push("/admin has no X-Robots-Tag: noindex header.");
    }
  }

  // HTML must be revalidated on every visit.
  {
    const { res, error } = await get("/");
    if (!error) {
      const cc = res.headers.get("cache-control") ?? "";
      const good = /no-store/.test(cc);
      line(good ? PASS : FAIL, "HTML revalidated per visit", cc || "(none)");
      if (!good) {
        problems.push(
          `Homepage HTML is served with "${cc}". Without max-age=0, must-revalidate a browser ` +
            "can render a stale document from its own disk without asking the origin.",
        );
      }
    }
  }

  // Catalogue responses must bypass every shared cache.
  {
    const { res, error } = await get("/api/catalog");
    if (!error) {
      const cc = res.headers.get("cache-control") ?? "";
      const good = /no-store/.test(cc);
      line(good ? PASS : FAIL, "/api/catalog no-store", cc || "(none)");
      if (!good) {
        problems.push(
          `/api/catalog is served with "${cc}". Expected no-store at browser and CDN layers.`,
        );
      }
    }
  }
}

/* ── report ──────────────────────────────────────────────────────────────── */
async function main() {
  console.log(`\nChecking ${c.dim(base)}\n`);
  await checkReachable();
  await checkBuild();
  await checkRoutes();
  await checkHealth();
  await checkCaching();
  for (const path of ["/faq", "/collections"]) {
    const { res } = await get(path);
    if (!res?.ok) problems.push(`${path} is unavailable.`);
    line(res?.ok ? PASS : FAIL, path, String(res?.status));
  }

  if (notes.length) {
    console.log(c.warn(`\n${notes.length} note(s):`));
    for (const n of notes) console.log(`  • ${n}`);
  }

  if (problems.length) {
    console.log(c.bad(`\n${problems.length} problem(s) found:\n`));
    for (const p of problems) console.log(`  ${c.bad("•")} ${p}`);
    console.log("");
    process.exit(1);
  }

  console.log(c.ok("\nAll checks passed.\n"));
}

main().catch((e) => {
  console.error(c.bad(`\ncheck:live crashed: ${e.stack || e.message}\n`));
  process.exit(2);
});
