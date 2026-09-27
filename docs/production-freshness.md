# Production freshness investigation and changes

## Observed before changes (27 September 2026)

- `https://www.veloralivings.in/version.json` reported build `89cd2cbf45fe`, matching local HEAD.
- The apex domain redirected to `www`; both reached the same version endpoint/build from this network. No domain mismatch was observed. This does not verify every DNS resolver or Vercel project setting.
- The homepage returned `Cache-Control: s-maxage=60, stale-while-revalidate`, despite middleware comments claiming it could override ISR.
- `/api/catalog` returned `public, s-maxage=10, stale-while-revalidate=30`.
- `/api/health` reported `seed:blob-unconfigured`, no published timestamp, 66 seed products. Its warning that Blob was mandatory was obsolete: GitHub writes were already supported.
- `/faq` already existed, with links in both footer layouts. Its live accordion was verified in the browser.

## Root causes established in source

1. Reads and writes disagreed. Writes preferred GitHub, while reads preferred legacy Blob, then deployment-local `data/catalog.json`, using GitHub only as a last fallback on Vercel. The just-written GitHub data was not necessarily what visitors or another admin read.
2. `unstable_cache(loadRaw, ['velora-catalog'])` had no expiry and used a deployment-independent key. Next's Data Cache persists across deployments. Invalidating on publish could immediately refill it from the old deployment file or legacy Blob before the next deployment completed.
3. ISR and manually configured CDN stale-while-revalidate added independent stale response layers. Middleware runs before route rendering, not after; the existing comments were wrong, and the live homepage headers demonstrated the mismatch.
4. `VersionWatch` only checked code identity every five minutes. Content changes within the same deployment and prefetched/back-forward Router Cache payloads could remain visible in an open tab.
5. GitHub fetches did not explicitly disable the Next fetch cache; failures were swallowed and converted to missing/seed data.
6. Mutable `/media` URLs had a one-day browser lifetime plus a 30-day stale window. The image optimizer also had a 31-day minimum TTL. Replacing bytes under the same URL could retain old images independently of the catalogue.

The production health result proves fallback data was being served. It did not expose GitHub configuration or errors, so the original exact production credential/branch failure cannot be inferred from that result alone.

## Changes by area

- `src/lib/catalog-store.ts`: GitHub is authoritative whenever configured, consistently with writes. Reads use React request-scoped deduplication rather than persistent Next Data Cache. Configured remote failures propagate instead of silently serving seed. A confirmed missing GitHub catalogue is explicitly labelled `seed:github-empty` to support the first publish.
- `src/lib/github-commit.ts`: every GitHub request uses `cache: no-store`; failures remain errors. Missing-file bootstrap verifies branch access first. Publish compares the base version against the exact HEAD used as commit parent and uses a non-force ref update, rejecting concurrent changes. Git blob reads support larger files/photos.
- `src/app/layout.tsx`, home, collection routes and sitemap: dynamic rendering disables build-time/ISR catalogue snapshots. Removed product `generateStaticParams`. Sitemap points to `/about` instead of nonexistent routes.
- `src/middleware.ts`, `src/app/api/catalog/route.ts`: documents/RSC and mutable API responses use no-store for browser, generic CDN and Vercel CDN. Catalogue reads fail with 503 when storage is unavailable. Auth and validation remain enforced; stale/null-base publishes and unknown product collections are rejected.
- `src/app/version.json/route.ts`, `src/components/site/VersionWatch.tsx`: expose a content digest in addition to build identity; check visible tabs every 30 seconds, on return/focus, and after navigation. `router.refresh()` updates server content without discarding client form state. Code changes trigger one guarded reload. A URL guard works when sessionStorage is disabled; a DOM dirty flag protects admin work without relying on localStorage. Storage outages do not suppress the code-version beacon.
- `src/components/admin/AdminClient.tsx`: checks HTTP failures before accepting fetched catalogue data, detects drift from an initially unversioned catalogue, and exposes dirty/saving state to the watcher. Local drafts still restore only against their original published version.
- `src/lib/photo-shared.ts`: accepts the root-relative photo paths the real upload endpoint returns (previously rejected on publish), while retaining path traversal checks.
- `src/app/api/catalog/photo/[name]/route.ts` and middleware: resolve content-addressed photo URLs from GitHub even before a new static deployment is ready; verify the byte hash before immutable caching. Failures are never cached. Local development reads the corresponding file. Existing upload route changes already present in the workspace were preserved.
- `src/lib/upload-photo.ts`: images over 4 MB are resized/compressed in the browser before multipart upload, retaining the 15 MB selection allowance while avoiding Vercel's 4.5 MB request ceiling. Uncompressible/unsupported images produce an actionable error.
- `next.config.mjs`, `src/lib/media-url.ts`, `src/components/ui/SiteImage.tsx` and image consumers: mutable repository media URLs include a build identity; original media revalidates and optimizer minimum TTL is 60 seconds. Content-hashed JS/CSS and hash-verified uploaded photos keep immutable caching. Builds of the same commit also receive distinct fallback identities.
- `CatalogueClient`, `SpecimenDetail`, `SpecimenMedia`: reset invalidated filters/changed default finishes and failed media state when refreshed props change.
- `src/app/api/health/route.ts`, `.env.example`, `scripts/check-live.mjs`: GitHub-aware configuration/diagnostics, storage failures surfaced, updated no-store checks and FAQ/collections reachability checks.
- `tests/production-freshness.test.mjs`, `tests/helpers/load-source.mjs`, `scripts/test-production-local.mjs`: real-source regression tests and an isolated production HTTP publish test. Older tests still use separate helper implementations; they are not treated as proof of production correctness.

## Caching layers inspected

| Layer | Result/policy |
| --- | --- |
| Next Data Cache | Removed persistent catalogue cache; GitHub fetches no-store |
| Full Route Cache / ISR | Dynamic pages; no prebuilt catalogue snapshots |
| Vercel / generic CDN | Explicit no-store for documents, RSC and mutable APIs |
| Browser HTTP cache / ETag | Documents no-store; unchanged static media may legitimately validate with ETag; versioned media URLs prevent cross-build reuse |
| JS/CSS | Next content-hashed filenames retain immutable caching |
| Image optimizer | Build-versioned mutable media inputs; uploaded photo hashes remain immutable |
| App Router cache / bfcache | Content beacon refreshes on navigation/return and visible polling |
| localStorage | Admin drafts/version base and dirty flag only; no public catalogue cache |
| sessionStorage | Reload loop guard only, with URL fallback |
| IndexedDB / Cache Storage | No application usage found |
| Service worker / PWA | Web manifest exists, but no service worker registration or offline cache implementation found |
| API / server process | No persistent catalogue memoization; response errors not cached |
| Domains/deployments | Public apex and www matched; dashboard aliases, production branch and preview routing require deployment-account verification |

## Future publish flow

Admin saves -> validate and compare current version -> commit to the configured GitHub branch -> invalidate legacy Next tags/paths -> return success. Fresh requests read that GitHub branch directly without waiting for a Vercel rebuild. Uploaded hash URLs resolve from GitHub immediately. Already-open visible storefront tabs discover content changes on their next successful check (normally within 30 seconds plus network/render time). Hidden tabs recheck when brought forward. Vercel continues deploying commits for code/static asset changes; new code identities trigger a guarded reload.

This guarantees that successfully fetched content is sourced consistently, rather than promising availability during GitHub outages or offline browsing. Every origin read now depends on GitHub availability/API limits, so monitor rate limits and latency. A higher-traffic deployment may need a dedicated authoritative content store with transactional writes and explicit invalidation; do not reintroduce a deployment-file fallback or indefinite cache.

## Verification and deployment

- TypeScript check and production build passed. The build marks catalogue/storefront pages dynamic.
- 42 tests passed, including actual-source reads, error handling, cache headers, path validation, conflict rejection, atomic GitHub write requests, immutable photo validation and content watcher/admin protection.
- The isolated built-server HTTP test passed: HTML/API no-store, desktop/mobile footer links, login, publish, independent visitor freshness, new content digest with unchanged build, product HTML, stale draft 409, unauthorized write 401 and logout. Test catalogue bytes are restored in finally.
- Public production was inspected read-only. No production catalogue was modified, and no commit/push/deployment was performed.

Before releasing, configure Production `GITHUB_TOKEN` (Contents read/write), `GITHUB_REPO`, `GITHUB_BRANCH`, `ADMIN_PASSWORD`, and `NEXT_PUBLIC_SITE_URL`. Ensure the Vercel production branch and custom-domain aliases target the intended project/deployment. Preview deployments should use a separate branch/backend to avoid modifying production data. Verify the target branch contains the intended catalogue; `seed:github-empty` means it has not been published there yet, and 503 means storage/access needs attention.

Deploy these changes, then run `npm run check:live -- https://www.veloralivings.in` and compare `/version.json` and `/api/health` through the apex and any other production aliases. Confirm `catalogSource: github` and the expected `catalogUpdatedAt`. The current public deployment still runs the old code until deployment completes. An old tab with no functioning update watcher cannot execute a fix that it has not received; its next navigation receives the corrected dynamic document.

For repeatable isolated local verification, build normally, then start Next in a dedicated PowerShell process with `GITHUB_TOKEN`, `GITHUB_REPO`, `BLOB_READ_WRITE_TOKEN` and `VERCEL` set to empty strings and `ADMIN_PASSWORD=local-freshness-test`. Run `node node_modules/next/dist/bin/next start -p 3100`, then `node scripts/test-production-local.mjs` from the repository root. Do not run the test against an active local editing session.

References: https://nextjs.org/docs/14/app/building-your-application/caching ; https://vercel.com/docs/caching/cache-control-headers ; https://nextjs.org/docs/14/app/api-reference/components/image ; https://vercel.com/docs/functions/limitations
