import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { filePhotos } from "./helpers/photo-filing.mjs";

/**
 * The photo filing path.
 *
 * The rule this protects: a photo belongs in the catalogue as a *path*, never
 * as bytes. A base64 data URI inlined into the JSON bloats every page load, is
 * re-downloaded on every catalogue read, and eventually pushes the payload past
 * the request limit — at which point publishing fails outright.
 */

const bytesFor = (s) => new TextEncoder().encode(s);
const hash20 = (s) => createHash("sha256").update(bytesFor(s)).digest("hex").slice(0, 20);

const uploader = (calls) => async (bytes, ext) => {
  const h = createHash("sha256").update(bytes).digest("hex").slice(0, 20);
  const name = `product-photos/${h}.${ext}`;
  calls.push(name);
  return `https://store.public.blob.vercel-storage.com/${name}`;
};

test("the same photo uploaded twice is committed exactly once", async () => {
  const calls = [];
  const same = bytesFor("identical-pixels");
  const result = await filePhotos({
    catalogue: {
      collections: [],
      specimens: [
        { slug: "a", image: null },
        { slug: "b", image: null },
      ],
    },
    pending: [
      { slug: "a", bytes: same, ext: "jpg" },
      { slug: "b", bytes: same, ext: "jpg" },
    ],
    upload: uploader(calls),
  });

  assert.equal(new Set(calls).size, 1, "one distinct object should be stored");
  assert.equal(
    result.catalogue.specimens[0].image,
    result.catalogue.specimens[1].image,
    "both products should point at the same content-addressed file",
  );
  assert.equal(result.uploaded, 1);
  assert.equal(result.deduplicated, 1);
});

test("different photos are filed separately", async () => {
  const calls = [];
  const result = await filePhotos({
    catalogue: { collections: [], specimens: [{ slug: "a" }, { slug: "b" }] },
    pending: [
      { slug: "a", bytes: bytesFor("one"), ext: "jpg" },
      { slug: "b", bytes: bytesFor("two"), ext: "png" },
    ],
    upload: uploader(calls),
  });
  assert.equal(new Set(calls).size, 2);
  assert.notEqual(result.catalogue.specimens[0].image, result.catalogue.specimens[1].image);
});

test("filenames are the content hash, so they are stable across sessions", async () => {
  const calls = [];
  await filePhotos({
    catalogue: { collections: [], specimens: [{ slug: "a" }] },
    pending: [{ slug: "a", bytes: bytesFor("stable"), ext: "webp" }],
    upload: uploader(calls),
  });
  assert.equal(calls[0], `product-photos/${hash20("stable")}.webp`);
});

test("an inline data URI is replaced by a path", async () => {
  const result = await filePhotos({
    catalogue: {
      collections: [],
      specimens: [{ slug: "a", image: "data:image/jpeg;base64,AAAABBBBCCCC" }],
    },
    pending: [{ slug: "a", bytes: bytesFor("real-photo"), ext: "jpg" }],
    upload: uploader([]),
  });
  const img = result.catalogue.specimens[0].image;
  assert.ok(!img.startsWith("data:"), "no data URI may survive into the catalogue");
  assert.match(img, /product-photos\/[a-f0-9]{20}\.jpg$/);
});

test("collection covers are filed the same way as product photos", async () => {
  const result = await filePhotos({
    catalogue: { collections: [{ slug: "lighting" }], specimens: [] },
    pending: [{ slug: "lighting", kind: "collection", bytes: bytesFor("cover"), ext: "jpg" }],
    upload: uploader([]),
  });
  assert.match(result.catalogue.collections[0].cover, /product-photos\/[a-f0-9]{20}\.jpg$/);
});

test("with no upload endpoint, photos stay inline rather than being lost", async () => {
  // Graceful degradation: an unreachable endpoint must not silently drop the
  // admin's photo. Keeping the inline preview is worse than a filed photo but
  // far better than discarding it.
  const result = await filePhotos({
    catalogue: { collections: [], specimens: [{ slug: "a", image: "data:image/jpeg;base64,ZZZZ" }] },
    pending: [{ slug: "a", bytes: bytesFor("x"), ext: "jpg" }],
    upload: null,
  });
  assert.equal(result.catalogue.specimens[0].image, "data:image/jpeg;base64,ZZZZ");
  assert.equal(result.degraded, true);
  assert.equal(result.uploaded, 0);
});

test("an oversized photo is reported as an error, not swallowed", async () => {
  await assert.rejects(
    () =>
      filePhotos({
        catalogue: { collections: [], specimens: [{ slug: "a" }] },
        pending: [{ slug: "a", bytes: new Uint8Array(16 * 1024 * 1024), ext: "jpg" }],
        upload: uploader([]),
      }),
    /15 MB|too large/i,
  );
});

test("a photo above the 4.5 MB function limit still files via direct upload", async () => {
  // The regression that broke every phone photo: routing bytes through a
  // serverless function caps them at Vercel's 4.5 MB request-body limit.
  const calls = [];
  const big = new Uint8Array(8 * 1024 * 1024);
  const result = await filePhotos({
    catalogue: { collections: [], specimens: [{ slug: "a" }] },
    pending: [{ slug: "a", bytes: big, ext: "jpg" }],
    upload: uploader(calls),
  });
  assert.equal(result.uploaded, 1);
  assert.match(result.catalogue.specimens[0].image, /product-photos\/[a-f0-9]{20}\.jpg$/);
});

test("an upload failure surfaces rather than publishing a broken catalogue", async () => {
  await assert.rejects(
    () =>
      filePhotos({
        catalogue: { collections: [], specimens: [{ slug: "a" }] },
        pending: [{ slug: "a", bytes: bytesFor("x"), ext: "jpg" }],
        upload: async () => {
          throw new Error("blob store unreachable");
        },
      }),
    /unreachable/,
  );
});
