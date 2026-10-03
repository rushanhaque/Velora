import test from 'node:test';
import assert from 'node:assert/strict';
import { loadSource } from './helpers/load-source.mjs';

const load = (env, fetch) => loadSource('src/lib/github-commit.ts', { 'server-only': {} }, { process: { env }, fetch });
test('token alone configures publishing to the project repository', () => {
  const mod = load({ GITHUB_TOKEN: ' token ', GITHUB_REPO: ' ' });
  assert.equal(mod.isGitHubConfigured(), true);
  assert.deepEqual(mod.githubTarget(), { repository: 'rushanhaque/Velora', branch: 'main' });
  assert.equal(load({}).isGitHubConfigured(), false);
});
test('Vercel repository metadata and explicit overrides resolve consistently', () => {
  const env = { VERCEL_GIT_REPO_OWNER: 'owner', VERCEL_GIT_REPO_SLUG: 'shop', VERCEL_GIT_COMMIT_REF: 'preview' };
  assert.deepEqual(load(env).githubTarget(), { repository: 'owner/shop', branch: 'main' });
  assert.deepEqual(load({ ...env, GITHUB_REPO: ' custom/repo ', GITHUB_BRANCH: ' production ' }).githubTarget(), { repository: 'custom/repo', branch: 'production' });
});
test('token-only configuration commits photos and catalogue through GitHub', async () => {
  const calls = [];
  const mod = load({ GITHUB_TOKEN: 'fine-grained-test' }, async (url, init) => {
    calls.push({ url, init });
    let data = { sha: 'new' };
    if (url.includes('/git/ref/')) data = { object: { sha: 'head' } };
    if (url.endsWith('/git/commits/head')) data = { tree: { sha: 'base' } };
    return Response.json(data);
  });
  await mod.commitFiles([
    { path: 'public/product-photos/test.webp', content: Buffer.from([1,2,3]) },
    { path: 'data/catalog.json', content: '{}' },
  ], 'Admin publish');
  assert.ok(calls.every(c => c.url.startsWith('https://api.github.com/repos/rushanhaque/Velora/')));
  assert.ok(calls.every(c => c.init.headers.Authorization === 'Bearer fine-grained-test' && c.init.cache === 'no-store'));
  const tree = JSON.parse(calls.find(c => c.url.endsWith('/git/trees')).init.body);
  assert.deepEqual(tree.tree.map(f => f.path), ['public/product-photos/test.webp', 'data/catalog.json']);
  assert.equal(calls.at(-1).url.endsWith('/git/refs/heads/main'), true);
  assert.equal(JSON.parse(calls.at(-1).init.body).force, false);
});
test('invalid token fails explicitly before any GitHub mutation', async () => {
  const mod = load({ GITHUB_TOKEN: 'expired' }, async () => new Response('{}', { status: 401 }));
  await assert.rejects(() => mod.commitFiles([{ path: 'data/catalog.json', content: '{}' }], 'Publish'), /invalid or expired/);
});

test('Vercel without a token refuses both reads and writes instead of using stale local or Blob data', async () => {
  const mod = loadSource('src/lib/catalog-store.ts', {
    'server-only': {}, './github-commit': { isGitHubConfigured: () => false },
    'next/cache': { unstable_noStore() {} }, react: { cache: fn => fn },
    './data': { COLLECTIONS: [], SPECIMENS: [] },
    './photo-shared': loadSource('src/lib/photo-shared.ts'),
    fs: { promises: { readFile() { throw new Error('Unexpected filesystem read'); }, writeFile() { throw new Error('Unexpected filesystem write'); } } },
  }, { process: { env: { VERCEL: '1', BLOB_READ_WRITE_TOKEN: 'legacy' }, cwd: () => '.' } });
  await assert.rejects(mod.readCatalogFresh, /GITHUB_TOKEN/);
  await assert.rejects(() => mod.writeCatalog({ collections: [], specimens: [] }), error => error.status === 503 && /GITHUB_TOKEN/.test(error.message));
});
