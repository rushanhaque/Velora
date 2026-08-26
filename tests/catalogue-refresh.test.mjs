import test from "node:test";
import assert from "node:assert/strict";
import { resolveCatalogue, STATIC_FALLBACK, BUNDLED_SNAPSHOT } from "./helpers/refresh-chain.mjs";

/**
 * The catalogue refresh chain.
 *
 * The storefront can obtain its catalogue from three places, and they are not
 * equally trustworthy: the live endpoint reflects the last publish, the static
 * build-time copy reflects the last *deploy*, and the bundled seed reflects
 * whenever data.ts was last edited. Preferring the wrong one is precisely how a
 * device ends up displaying products that were removed weeks ago.
 *
 * No browser, no network — `fetch` is stubbed.
 */

const live = (updatedAt, specimens = 1) => ({
  ok: true,
  body: { collections: [], specimens: Array(specimens).fill({ slug: "x" }), updatedAt },
});

test("the live endpoint is preferred over the static copy", async () => {
  const got = await resolveCatalogue({
    fetchImpl: async () => live("2026-08-20T10:00:00.000Z", 3),
  });
  assert.equal(got.source, "live");
  assert.equal(got.catalogue.specimens.length, 3);
});

test("the static copy is preferred over the bundled snapshot", async () => {
  const got = await resolveCatalogue({
    fetchImpl: async () => {
      throw new Error("endpoint down");
    },
    staticCopy: STATIC_FALLBACK,
  });
  assert.equal(got.source, "static");
  assert.deepEqual(got.catalogue, STATIC_FALLBACK);
});

test("the bundled snapshot is the last resort, never the first choice", async () => {
  const got = await resolveCatalogue({
    fetchImpl: async () => {
      throw new Error("endpoint down");
    },
    staticCopy: null,
  });
  assert.equal(got.source, "bundled");
  assert.deepEqual(got.catalogue, BUNDLED_SNAPSHOT);
});

test("a stale snapshot never overwrites a newer one already loaded", async () => {
  // A slow response from a previous request landing after a fresher one is a
  // real race, not a hypothetical: the drift poll and the initial load can be
  // in flight at the same time.
  const got = await resolveCatalogue({
    fetchImpl: async () => live("2026-08-01T00:00:00.000Z", 1),
    current: { collections: [], specimens: [{ slug: "a" }, { slug: "b" }], updatedAt: "2026-08-20T00:00:00.000Z" },
  });
  assert.equal(got.source, "current", "older payload must be refused");
  assert.equal(got.catalogue.specimens.length, 2);
});

test("an equally-fresh snapshot is not treated as an update", async () => {
  const at = "2026-08-20T00:00:00.000Z";
  const got = await resolveCatalogue({
    fetchImpl: async () => live(at, 1),
    current: { collections: [], specimens: [{ slug: "a" }], updatedAt: at },
  });
  assert.equal(got.source, "current");
});

test("a newer snapshot does replace what is loaded", async () => {
  const got = await resolveCatalogue({
    fetchImpl: async () => live("2026-08-21T00:00:00.000Z", 5),
    current: { collections: [], specimens: [{ slug: "a" }], updatedAt: "2026-08-20T00:00:00.000Z" },
  });
  assert.equal(got.source, "live");
  assert.equal(got.catalogue.specimens.length, 5, "a publish elsewhere must propagate");
});

test("the endpoint going down falls through gracefully, never throws", async () => {
  for (const failure of [
    async () => {
      throw new Error("network");
    },
    async () => ({ ok: false, status: 500, body: null }),
    async () => ({ ok: true, body: "not json at all" }),
    async () => ({ ok: true, body: { nonsense: true } }),
  ]) {
    const got = await resolveCatalogue({ fetchImpl: failure, staticCopy: STATIC_FALLBACK });
    assert.equal(got.source, "static", "must degrade, not explode");
  }
});

test("an untimestamped live payload is still accepted over a static copy", async () => {
  // A catalogue written before updatedAt existed has no timestamp. It is still
  // more current than the build-time copy.
  const got = await resolveCatalogue({
    fetchImpl: async () => ({ ok: true, body: { collections: [], specimens: [{ slug: "a" }] } }),
    staticCopy: STATIC_FALLBACK,
  });
  assert.equal(got.source, "live");
});
