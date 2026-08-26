import test from "node:test";
import assert from "node:assert/strict";
import { publish } from "./helpers/publish.mjs";
import { isValidPhotoPath, isValidSha } from "./helpers/validation.mjs";

/**
 * The publish endpoint's server-side guarantees.
 *
 * Everything here is about *not trusting the client*. The CMS runs in a browser
 * an attacker can drive directly, so path validation, SHA validation and
 * conflict handling all have to hold on the server regardless of what the
 * front-end believes it sent.
 */

const authed = { token: "correct-secret" };
const base = {
  collections: [],
  specimens: [{ slug: "a", image: "product-photos/aaaaaaaaaaaaaaaaaaaa.jpg" }],
};

/* ── credentials ─────────────────────────────────────────────────────────── */

test("publishing without credentials is refused", async () => {
  const res = await publish({ body: base, secret: "correct-secret" });
  assert.equal(res.status, 401);
  assert.match(res.body.error, /authoris|credential/i);
});

test("publishing with the wrong credentials is refused", async () => {
  const res = await publish({ body: base, auth: { token: "guess" }, secret: "correct-secret" });
  assert.equal(res.status, 401);
});

test("a valid publish with a valid photo is committed", async () => {
  const store = { updatedAt: null, catalogue: null };
  const res = await publish({ body: base, auth: authed, secret: "correct-secret", store });
  assert.equal(res.status, 200);
  assert.equal(store.catalogue.specimens[0].image, "product-photos/aaaaaaaaaaaaaaaaaaaa.jpg");
});

/* ── photo path validation ───────────────────────────────────────────────── */

test("path traversal in a photo path is rejected", async () => {
  for (const evil of [
    "../../../etc/passwd",
    "product-photos/../../server.js",
    "/etc/passwd",
    "product-photos/aaaaaaaaaaaaaaaaaaaa.jpg/../../x",
    "..\\..\\windows\\system32\\config",
    "product-photos/subdir/aaaaaaaaaaaaaaaaaaaa.jpg",
  ]) {
    assert.equal(isValidPhotoPath(evil), false, `must reject: ${evil}`);
    const res = await publish({
      body: { collections: [], specimens: [{ slug: "a", image: evil }] },
      auth: authed,
      secret: "correct-secret",
    });
    assert.equal(res.status, 400, `must 400 on: ${evil}`);
    assert.match(res.body.error, /photo path/i);
  }
});

test("a photo path with the wrong shape or extension is rejected", async () => {
  for (const bad of [
    "product-photos/SHOUTING.jpg", // not lowercase hex
    "product-photos/aaaaaaaaaaaaaaaaaaaa.exe", // executable
    "product-photos/aaaaaaaaaaaaaaaaaaaa.svg", // scriptable
    "product-photos/tooshort.jpg",
    "product-photos/aaaaaaaaaaaaaaaaaaaaaaaaaaaa.jpg", // too long
    "product-photos/aaaaaaaaaaaaaaaaaaaa", // no extension
    "other-dir/aaaaaaaaaaaaaaaaaaaa.jpg", // outside the photo directory
  ]) {
    assert.equal(isValidPhotoPath(bad), false, `must reject: ${bad}`);
  }
});

test("every legitimate image extension is accepted", () => {
  for (const ext of ["jpg", "png", "webp", "avif", "gif"]) {
    assert.equal(isValidPhotoPath(`product-photos/0123456789abcdef0123.${ext}`), true, ext);
  }
});

test("an absolute Blob URL is accepted, since that is what an upload returns", async () => {
  const res = await publish({
    body: {
      collections: [],
      specimens: [
        {
          slug: "a",
          image:
            "https://store.public.blob.vercel-storage.com/product-photos/0123456789abcdef0123.jpg",
        },
      ],
    },
    auth: authed,
    secret: "correct-secret",
  });
  assert.equal(res.status, 200);
});

/* ── SHA validation ──────────────────────────────────────────────────────── */

test("only 40-char lowercase hex is accepted as a SHA", () => {
  assert.equal(isValidSha("a".repeat(40)), true);
  assert.equal(isValidSha("0123456789abcdef0123456789abcdef01234567"), true);
  for (const bad of [
    "A".repeat(40), // uppercase
    "a".repeat(39), // too short
    "a".repeat(41), // too long
    "g".repeat(40), // not hex
    "",
    "../../etc",
    "a".repeat(40) + " ",
  ]) {
    assert.equal(isValidSha(bad), false, `must reject: ${JSON.stringify(bad)}`);
  }
});

test("an invalid photo SHA is rejected by the endpoint", async () => {
  const res = await publish({
    body: base,
    auth: authed,
    secret: "correct-secret",
    photoShas: ["NOTAVALIDSHA"],
  });
  assert.equal(res.status, 400);
  assert.match(res.body.error, /sha/i);
});

/* ── conflicts ───────────────────────────────────────────────────────────── */

test("a branch conflict returns 409 and does not force-push", async () => {
  const store = { updatedAt: "2026-08-20T12:00:00.000Z", catalogue: { marker: "theirs" } };
  const res = await publish({
    body: { ...base, baseUpdatedAt: "2026-08-20T09:00:00.000Z" },
    auth: authed,
    secret: "correct-secret",
    store,
  });
  assert.equal(res.status, 409);
  assert.equal(res.body.conflict, true);
  assert.deepEqual(store.catalogue, { marker: "theirs" }, "the other publish must survive intact");
});

test("publishing from the current base succeeds", async () => {
  const store = { updatedAt: "2026-08-20T12:00:00.000Z", catalogue: { marker: "theirs" } };
  const res = await publish({
    body: { ...base, baseUpdatedAt: "2026-08-20T12:00:00.000Z" },
    auth: authed,
    secret: "correct-secret",
    store,
  });
  assert.equal(res.status, 200);
  assert.notDeepEqual(store.catalogue, { marker: "theirs" });
});

/* ── timestamps & payload ────────────────────────────────────────────────── */

test("updatedAt is stamped from the server clock, not the browser's", async () => {
  const store = { updatedAt: null, catalogue: null };
  const serverNow = "2026-08-26T00:00:00.000Z";
  const res = await publish({
    body: { ...base, updatedAt: "1999-01-01T00:00:00.000Z" },
    auth: authed,
    secret: "correct-secret",
    store,
    now: () => serverNow,
  });
  assert.equal(res.status, 200);
  assert.equal(store.updatedAt, serverNow, "a browser clock must not set the timestamp");
});

test("an oversized payload is reported as 413, clearly", async () => {
  const huge = {
    collections: [],
    specimens: [{ slug: "a", image: `data:image/jpeg;base64,${"A".repeat(6 * 1024 * 1024)}` }],
  };
  const res = await publish({ body: huge, auth: authed, secret: "correct-secret" });
  assert.equal(res.status, 413);
  assert.match(res.body.error, /too large|limit/i);
});

test("a malformed catalogue is rejected before anything is written", async () => {
  const store = { updatedAt: null, catalogue: null };
  for (const bad of [{}, { collections: [] }, { specimens: [] }, { collections: {}, specimens: [] }]) {
    const res = await publish({ body: bad, auth: authed, secret: "correct-secret", store });
    assert.equal(res.status, 400);
  }
  assert.equal(store.catalogue, null, "nothing may be written on a rejected publish");
});

test("duplicate product slugs are rejected", async () => {
  const res = await publish({
    body: { collections: [], specimens: [{ slug: "a" }, { slug: "a" }] },
    auth: authed,
    secret: "correct-secret",
  });
  assert.equal(res.status, 400);
  assert.match(res.body.error, /duplicate/i);
});
