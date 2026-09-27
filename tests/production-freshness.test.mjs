import test from 'node:test';
import assert from 'node:assert/strict';
import { loadSource } from './helpers/load-source.mjs';

const catalog = version => ({ collections: [{ slug: 'lighting' }], specimens: [{ slug: 'lamp', collection: 'lighting', image: '/product-photos/0123456789abcdef0123.webp' }], updatedAt: version });
const response = body => new Response(JSON.stringify(body), { headers: { 'Content-Type': 'application/json' } });
const photos = loadSource('src/lib/photo-shared.ts');

function store(github) {
  return loadSource('src/lib/catalog-store.ts', {
    'server-only': {}, './github-commit': { isGitHubConfigured: () => true, ...github },
    'next/cache': { unstable_noStore() {} }, react: { cache: fn => fn },
    './data': { COLLECTIONS: [], SPECIMENS: [] }, './photo-shared': photos,
    fs: { promises: { readFile: () => { throw new Error('Must not read deployment snapshot'); } } },
  });
}

test('real catalog store prefers GitHub and observes the next publish without revalidation', async () => {
  let live = catalog('one');
  const mod = store({ readFileFromGitHub: async () => JSON.stringify(live) });
  assert.equal((await mod.readCatalog()).updatedAt, 'one');
  live = catalog('two');
  assert.equal((await mod.readCatalog()).updatedAt, 'two');
  assert.equal(mod.catalogSource(), 'github');
});
test('remote errors cannot silently resurrect seed or bundled content', async () => {
  const mod = store({ readFileFromGitHub: async () => { throw new Error('GitHub unavailable'); } });
  await assert.rejects(mod.readCatalogFresh, /unavailable/);
});
test('first publish can initialize a confirmed missing GitHub catalogue', async () => {
  const mod = store({ readFileFromGitHub: async () => null });
  assert.deepEqual((await mod.readCatalogFresh()).specimens, []);
  assert.equal(mod.catalogSource(), 'seed:github-empty');
});
test('real validator accepts uploaded root-relative paths and rejects traversal', () => {
  assert.equal(photos.isValidPhotoPath('/product-photos/0123456789abcdef0123.webp'), true);
  assert.equal(photos.isValidPhotoPath('/product-photos/../bad.webp'), false);
});

function route({ live = catalog('one'), auth = true, fail = false } = {}) {
  const writes = [];
  class CatalogWriteError extends Error {}
  const mod = loadSource('src/app/api/catalog/route.ts', {
    'next/server': { NextResponse: Response },
    'next/cache': { revalidatePath() {}, revalidateTag() {} },
    '@/lib/catalog-store': {
      readCatalog: async () => { if (fail) throw new Error('offline'); return live; },
      readCatalogFresh: async () => live, catalogSource: () => 'github', CatalogWriteError,
      writeCatalog: async (input, base) => { writes.push({ input, base }); return input; },
    },
    '@/lib/photo-shared': photos, '@/lib/admin-auth': { isAuthed: () => auth },
  });
  return { ...mod, writes };
}
const request = body => new Request('http://localhost/api/catalog', { method: 'PUT', body: JSON.stringify(body) });
test('real GET is no-store at all cache layers; remote failure is 503', async () => {
  const res = await route().GET();
  for (const header of ['Cache-Control','CDN-Cache-Control','Vercel-CDN-Cache-Control']) assert.match(res.headers.get(header), /no-store/);
  assert.equal((await route({ fail: true }).GET()).status, 503);
});
test('real PUT rejects unauthorized, stale and unversioned writes without mutation', async () => {
  for (const [auth, baseUpdatedAt, status] of [[false,'one',401], [true,'old',409], [true,null,409]]) {
    const mod = route({ auth });
    assert.equal((await mod.PUT(request({ ...catalog('one'), baseUpdatedAt }))).status, status);
    assert.equal(mod.writes.length, 0);
  }
});
test('real PUT accepts uploaded photo URL and passes version to atomic GitHub write', async () => {
  const mod = route();
  const res = await mod.PUT(request({ ...catalog('one'), baseUpdatedAt: 'one' }));
  assert.equal(res.status, 200);
  assert.equal(mod.writes[0].base, 'one');
});
test('GitHub requests opt out of Next caching and ref update is non-force', async () => {
  const calls = [];
  const mod = loadSource('src/lib/github-commit.ts', { 'server-only': {} }, {
    process: { env: { GITHUB_TOKEN: 'test', GITHUB_REPO: 'test/repo', GITHUB_BRANCH: 'main' } },
    fetch: async (url, init) => {
      calls.push({ url, init });
      if (url.includes('/git/ref/')) return response({ object: { sha: 'head' } });
      if (url.includes('/contents/')) return response({ content: Buffer.from(JSON.stringify(catalog('one'))).toString('base64') });
      if (url.endsWith('/git/commits/head')) return response({ tree: { sha: 'tree' } });
      return response({ sha: 'new' });
    },
  });
  await mod.commitFiles([{ path: 'data/catalog.json', content: '{}' }], 'publish', 'one');
  assert.ok(calls.every(c => c.init.cache === 'no-store'));
  assert.ok(calls.some(c => c.url.includes('?ref=head')));
  assert.equal(JSON.parse(calls.at(-1).init.body).force, false);
  calls.length = 0;
  await assert.rejects(() => mod.commitFiles([{ path: 'data/catalog.json', content: '{}' }], 'publish', 'old'), error => error.status === 409);
  assert.ok(calls.every(c => !c.init.method));
});

test('photo route verifies immutable content and never caches failures', async () => {
  const { createHash } = await import('node:crypto');
  const bytes = new Uint8Array([1, 2, 3]);
  const photoName = (b, ext) => createHash('sha256').update(b).digest('hex').slice(0,20) + '.' + ext;
  const mod = loadSource('src/app/api/catalog/photo/[name]/route.ts', {
    'next/server': { NextResponse: Response },
    '@/lib/github-commit': { isGitHubConfigured: () => true, readPhotoFromGitHub: async () => bytes },
    '@/lib/photo-shared': photos, '@/lib/catalog-store': { photoName },
  });
  const res = await mod.GET(new Request('http://localhost'), { params: { name: photoName(bytes, 'webp') } });
  assert.equal(res.status, 200);
  assert.match(res.headers.get('cache-control'), /immutable/);
  const bad = await mod.GET(new Request('http://localhost'), { params: { name: '0123456789abcdef0123.webp' } });
  assert.equal(bad.status, 503);
  assert.match(bad.headers.get('cache-control'), /no-store/);
});

test('real VersionWatch refreshes content without rebuild and protects dirty admin without storage', async () => {
  for (const admin of [false, true]) {
    let effect, tick, now = 100000, version = 'one', refreshes = 0;
    const win = {
      location: { href: 'https://example.test/', replace() { throw new Error('Unexpected reload'); } },
      sessionStorage: { getItem() { throw new Error('disabled'); }, setItem() { throw new Error('disabled'); } },
      addEventListener() {}, removeEventListener() {},
      setInterval(fn) { tick = fn; return 1; }, clearInterval() {},
      setTimeout() { return 2; }, clearTimeout() {},
    };
    const mod = loadSource('src/components/site/VersionWatch.tsx', {
      react: { useEffect(fn) { effect = fn; } },
      'next/navigation': { useRouter: () => ({ refresh() { refreshes++; } }), usePathname: () => admin ? '/admin' : '/' },
      '@/lib/build-id': { BUILD_ID: 'same-build', RELOAD_GUARD_KEY: 'guard' },
    }, { window: win, document: { visibilityState: 'visible', documentElement: { dataset: { adminDirty: String(admin) } }, addEventListener() {}, removeEventListener() {} },
      process: { env: { NODE_ENV: 'production' } }, Date: { now: () => now },
      fetch: async () => response({ buildId: 'same-build', catalogVersion: version }),
    });
    mod.VersionWatch(); const cleanup = effect();
    await tick(); now += 31000; version = 'two'; await tick();
    assert.equal(refreshes, admin ? 0 : 2);
    cleanup();
  }
});
