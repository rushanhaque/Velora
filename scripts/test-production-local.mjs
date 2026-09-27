import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir, unlink } from 'node:fs/promises';
import path from 'node:path';

// Run ONLY against the isolated local server described in docs/production-freshness.md.
const base = process.argv[2] || 'http://localhost:3100';
if (!['localhost', '127.0.0.1'].includes(new URL(base).hostname)) throw new Error('Local test server required.');
const file = path.resolve('data/catalog.json');
let original;
try { original = await readFile(file); } catch (e) { if (e.code !== 'ENOENT') throw e; }
const req = (route, init) => fetch(base + route, init);
try {
  for (const route of ['/', '/faq', '/admin', '/collections', '/api/catalog', '/api/admin/login', '/version.json']) {
    const r = await req(route);
    assert.equal(r.status, 200, route);
    assert.match(r.headers.get('cache-control'), /no-store/, route);
    if (route === '/faq') {
      const html = await r.text();
      assert.match(html, /What is the minimum order/);
      assert.ok((html.match(/href="\/faq"/g) || []).length >= 2, 'FAQ linked in both footer layouts');
    }
  }
  const catalogResponse = await req('/api/catalog');
  assert.ok(['file', 'seed:file-missing'].includes(catalogResponse.headers.get('x-catalog-source')), 'Refuse to test a remote backend');
  const before = await catalogResponse.json();
  const beacon = await (await req('/version.json')).json();
  const login = await req('/api/admin/login', { method: 'POST', body: JSON.stringify({ password: 'local-freshness-test' }) });
  assert.equal(login.status, 200);
  const cookie = login.headers.get('set-cookie').split(';')[0];
  const draft = structuredClone(before);
  draft.specimens[0].name = 'Freshness integration check';
  const publish = await req('/api/catalog', { method: 'PUT', headers: { Cookie: cookie, 'Content-Type': 'application/json' }, body: JSON.stringify({ ...draft, baseUpdatedAt: before.updatedAt ?? null }) });
  assert.equal(publish.status, 200, await publish.text());
  // No cookie: independent visitor, not the publishing admin's session.
  const otherVisitor = await (await req('/api/catalog')).json();
  assert.equal(otherVisitor.specimens[0].name, draft.specimens[0].name);
  const nextBeacon = await (await req('/version.json')).json();
  assert.equal(nextBeacon.buildId, beacon.buildId, 'No rebuild needed for content');
  assert.notEqual(nextBeacon.catalogVersion, beacon.catalogVersion);
  const page = await req('/collections/' + draft.specimens[0].slug);
  assert.match(await page.text(), /Freshness integration check/);
  const conflict = await req('/api/catalog', { method: 'PUT', headers: { Cookie: cookie, 'Content-Type': 'application/json' }, body: JSON.stringify({ ...before, baseUpdatedAt: before.updatedAt ?? null }) });
  assert.equal(conflict.status, 409);
  const unauth = await req('/api/catalog', { method: 'PUT', body: JSON.stringify(draft) });
  assert.equal(unauth.status, 401);
  const logout = await req('/api/admin/login', { method: 'DELETE', headers: { Cookie: cookie } });
  assert.equal(logout.status, 200);
  console.log('PASS: production HTML/API headers, both FAQ footer links, login, publish, separate visitor, unchanged build/new content, product HTML, conflict, unauthorized write, logout.');
} finally {
  if (original) { await mkdir(path.dirname(file), { recursive: true }); await writeFile(file, original); }
  else { await unlink(file).catch(e => { if (e.code !== 'ENOENT') throw e; }); }
}
