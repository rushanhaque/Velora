import { isValidPhotoPath, isValidSha } from "./validation.mjs";

/** Serverless request-body ceiling. Beyond this the platform refuses the call. */
export const MAX_PAYLOAD_BYTES = 4.5 * 1024 * 1024;

const json = (status, body) => ({ status, body });

/**
 * The publish endpoint's decision logic, isolated from Next.js so it can be
 * exercised without a server.
 *
 * Order matters, and is deliberate: credentials, then payload size, then shape,
 * then every untrusted path and SHA, and only then the conflict check. Nothing
 * is written until all of it passes — a rejected publish must leave the stored
 * catalogue byte-for-byte unchanged.
 */
export async function publish({
  body,
  auth = null,
  secret,
  store = { updatedAt: null, catalogue: null },
  photoShas = [],
  now = () => new Date().toISOString(),
} = {}) {
  // 1. Credentials.
  if (!auth || auth.token !== secret) {
    return json(401, { error: "Not authorised — a valid publish credential is required." });
  }

  // 2. Payload size, before parsing anything expensive.
  if (JSON.stringify(body ?? {}).length > MAX_PAYLOAD_BYTES) {
    return json(413, {
      error:
        "This publish is too large for the request limit. Photos must be filed as separate " +
        "images rather than embedded in the catalogue.",
    });
  }

  // 3. Shape.
  if (!body || !Array.isArray(body.collections) || !Array.isArray(body.specimens)) {
    return json(400, { error: "Malformed catalogue — expected { collections[], specimens[] }." });
  }

  const slugs = new Set();
  for (const s of body.specimens) {
    if (!s.slug || typeof s.slug !== "string") {
      return json(400, { error: "A product is missing a slug." });
    }
    if (slugs.has(s.slug)) return json(400, { error: `Duplicate product slug: ${s.slug}.` });
    slugs.add(s.slug);
  }

  // 4. Every photo reference the client supplied.
  for (const s of body.specimens) {
    if (s.image && !s.image.startsWith("/media/") && !isValidPhotoPath(s.image)) {
      return json(400, { error: `Rejected photo path for "${s.slug}": ${s.image}` });
    }
  }
  for (const c of body.collections) {
    if (c.cover && !c.cover.startsWith("/media/") && !isValidPhotoPath(c.cover)) {
      return json(400, { error: `Rejected photo path for collection "${c.slug}": ${c.cover}` });
    }
  }

  // 5. Every SHA the client supplied.
  for (const sha of photoShas) {
    if (!isValidSha(sha)) return json(400, { error: `Rejected photo SHA: ${sha}` });
  }

  // 6. Conflict. Report it — never overwrite, never force-push.
  const requestedBase = body.baseUpdatedAt ?? null;
  if (requestedBase !== null && store.updatedAt && store.updatedAt !== requestedBase) {
    return json(409, {
      error: "The catalogue changed while you were editing.",
      conflict: true,
      liveUpdatedAt: store.updatedAt,
      yourBase: requestedBase,
    });
  }

  // 7. Commit, stamping the time from the server clock.
  const stamped = now();
  store.updatedAt = stamped;
  store.catalogue = {
    collections: body.collections,
    specimens: body.specimens,
    updatedAt: stamped,
  };
  return json(200, { ok: true, catalogue: store.catalogue });
}
