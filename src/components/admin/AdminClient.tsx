"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FINISHES, type Collection, type Specimen } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Field, TextInput, TextArea, SelectInput, Toggle, Chips, ImagePicker } from "./AdminInputs";

interface Catalog {
  collections: Collection[];
  specimens: Specimen[];
}

const TONES = ["brass", "copper", "bronze", "silver"] as const;
const SHAPES = ["bowl", "vase", "ewer", "urn", "platter", "lamp", "box", "goblet", "candelabra", "tray"] as const;
const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];

const opt = (v: string) => ({ value: v, label: v[0].toUpperCase() + v.slice(1) });

function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);
}
function uniqueSlug(base: string, taken: Set<string>): string {
  let s = base || "item";
  let i = 2;
  while (taken.has(s)) s = `${base}-${i++}`;
  return s;
}
function nextRef(specimens: Specimen[]): string {
  const nums = specimens
    .map((s) => Number(/VL-(\d+)/.exec(s.ref || "")?.[1]))
    .filter((n) => !Number.isNaN(n));
  const max = nums.length ? Math.max(...nums) : 0;
  return `VL-${String(max + 1).padStart(2, "0")}`;
}
const clone = <T,>(v: T): T => JSON.parse(JSON.stringify(v));

type Pending = Record<string, { file: File; url: string }>;
type Toast = { kind: "ok" | "err"; msg: string } | null;

export function AdminClient() {
  const [loaded, setLoaded] = useState<Catalog | null>(null);
  const [draft, setDraft] = useState<Catalog>({ collections: [], specimens: [] });
  const [pending, setPending] = useState<Pending>({});
  const [tab, setTab] = useState<"products" | "collections">("products");
  const [query, setQuery] = useState("");
  const [filterCol, setFilterCol] = useState("");
  const [editSpec, setEditSpec] = useState<{ spec: Specimen; originalSlug: string | null } | null>(null);
  const [editCol, setEditCol] = useState<{ col: Collection; originalSlug: string | null } | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<Toast>(null);
  const [error, setError] = useState<string | null>(null);

  /* ── auth gate ── */
  const [authChecked, setAuthChecked] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [configured, setConfigured] = useState(true);
  const [pw, setPw] = useState("");
  const [loginErr, setLoginErr] = useState<string | null>(null);
  const [loggingIn, setLoggingIn] = useState(false);

  useEffect(() => {
    fetch("/api/admin/login")
      .then((r) => r.json())
      .then((d: { authed: boolean; configured: boolean }) => {
        setAuthed(Boolean(d.authed));
        setConfigured(Boolean(d.configured));
      })
      .catch(() => {})
      .finally(() => setAuthChecked(true));
  }, []);

  const login = async () => {
    setLoggingIn(true);
    setLoginErr(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pw }),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || "Login failed.");
      setAuthed(true);
      setPw("");
    } catch (e) {
      setLoginErr(e instanceof Error ? e.message : "Login failed.");
    } finally {
      setLoggingIn(false);
    }
  };

  const logout = async () => {
    await fetch("/api/admin/login", { method: "DELETE" }).catch(() => {});
    setAuthed(false);
    setLoaded(null);
  };

  /* ── load (only once authed) ── */
  useEffect(() => {
    if (!authed) return;
    fetch("/api/catalog")
      .then((r) => r.json())
      .then((data: Catalog) => {
        setLoaded(data);
        setDraft(clone(data));
      })
      .catch(() => setError("Could not load the catalog."));
  }, [authed]);

  /* ── dirty tracking ── */
  const dirty = useMemo(
    () => (loaded ? JSON.stringify(draft) !== JSON.stringify(loaded) : false) || Object.keys(pending).length > 0,
    [draft, loaded, pending],
  );

  const changes = useMemo(() => {
    if (!loaded) return { added: 0, edited: 0, removed: 0 };
    let added = 0, edited = 0, removed = 0;
    const oldMap = new Map(loaded.specimens.map((s) => [s.slug, s]));
    const newMap = new Map(draft.specimens.map((s) => [s.slug, s]));
    for (const [slug, s] of newMap) {
      if (!oldMap.has(slug)) added++;
      else if (JSON.stringify(oldMap.get(slug)) !== JSON.stringify(s) || pending[`spec:${slug}`]) edited++;
    }
    for (const slug of oldMap.keys()) if (!newMap.has(slug)) removed++;
    // collection edits count as edits too
    const oc = new Map(loaded.collections.map((c) => [c.slug, c]));
    for (const c of draft.collections) {
      if (!oc.has(c.slug)) added++;
      else if (JSON.stringify({ ...oc.get(c.slug), count: 0 }) !== JSON.stringify({ ...c, count: 0 }) || pending[`col:${c.slug}`]) edited++;
    }
    for (const slug of oc.keys()) if (!draft.collections.some((c) => c.slug === slug)) removed++;
    return { added, edited, removed };
  }, [draft, loaded, pending]);

  /* ── warn before leaving with unsaved changes ── */
  useEffect(() => {
    const h = (e: BeforeUnloadEvent) => {
      if (dirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", h);
    return () => window.removeEventListener("beforeunload", h);
  }, [dirty]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  const imgFor = useCallback(
    (kind: "spec" | "col", slug: string, path?: string) => pending[`${kind}:${slug}`]?.url ?? path ?? "",
    [pending],
  );

  /* ── save (upload pending images, then PUT the whole catalog) ── */
  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      const next = clone(draft);
      for (const [token, { file }] of Object.entries(pending)) {
        const [kind, slug] = token.split(":");
        const fd = new FormData();
        fd.append("file", file);
        fd.append("slug", slug);
        const up = await fetch("/api/catalog/upload", { method: "POST", body: fd });
        if (!up.ok) throw new Error((await up.json().catch(() => ({}))).error || "Image upload failed.");
        const { path } = await up.json();
        if (kind === "spec") {
          const s = next.specimens.find((x) => x.slug === slug);
          if (s) s.image = path;
        } else {
          const c = next.collections.find((x) => x.slug === slug);
          if (c) c.cover = path;
        }
      }
      const res = await fetch("/api/catalog", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(next),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || "Save failed.");
      const { catalog } = await res.json();
      Object.values(pending).forEach((p) => URL.revokeObjectURL(p.url));
      setPending({});
      setLoaded(catalog);
      setDraft(clone(catalog));
      setToast({ kind: "ok", msg: "Saved — your storefront is now live." });
    } catch (e) {
      setToast({ kind: "err", msg: e instanceof Error ? e.message : "Something went wrong." });
    } finally {
      setSaving(false);
    }
  };

  const discard = () => {
    if (!loaded) return;
    if (dirty && !window.confirm("Discard all unsaved changes?")) return;
    Object.values(pending).forEach((p) => URL.revokeObjectURL(p.url));
    setPending({});
    setDraft(clone(loaded));
    setToast({ kind: "ok", msg: "Changes discarded." });
  };

  /* ── product ops ── */
  const openNewSpec = () => {
    const col = draft.collections[0];
    setEditSpec({
      originalSlug: null,
      spec: {
        ref: nextRef(draft.specimens),
        slug: "",
        name: "",
        collection: col?.slug ?? "",
        subcategory: undefined,
        material: "",
        tone: "brass",
        shape: "vase",
        desc: "",
        story: "",
        tags: [],
      },
    });
  };
  const duplicateSpec = (s: Specimen) => {
    const taken = new Set(draft.specimens.map((x) => x.slug));
    const slug = uniqueSlug(`${s.slug}-copy`, taken);
    setDraft((d) => ({
      ...d,
      specimens: [{ ...clone(s), slug, name: `${s.name} (copy)`, ref: nextRef(d.specimens) }, ...d.specimens],
    }));
    setToast({ kind: "ok", msg: "Duplicated — remember to Save." });
  };
  const deleteSpec = (s: Specimen) => {
    if (!window.confirm(`Delete “${s.name}”? This is staged until you Save.`)) return;
    setDraft((d) => ({ ...d, specimens: d.specimens.filter((x) => x.slug !== s.slug) }));
    setPending((p) => {
      const n = { ...p };
      const k = `spec:${s.slug}`;
      if (n[k]) { URL.revokeObjectURL(n[k].url); delete n[k]; }
      return n;
    });
  };
  const applySpec = (spec: Specimen, originalSlug: string | null, file: { file: File; url: string } | null) => {
    setDraft((d) => {
      const specimens = originalSlug
        ? d.specimens.map((x) => (x.slug === originalSlug ? spec : x))
        : [spec, ...d.specimens];
      return { ...d, specimens };
    });
    if (file || (originalSlug && originalSlug !== spec.slug)) {
      setPending((p) => {
        const n = { ...p };
        if (originalSlug && originalSlug !== spec.slug && n[`spec:${originalSlug}`]) {
          n[`spec:${spec.slug}`] = n[`spec:${originalSlug}`];
          delete n[`spec:${originalSlug}`];
        }
        if (file) {
          if (n[`spec:${spec.slug}`]) URL.revokeObjectURL(n[`spec:${spec.slug}`].url);
          n[`spec:${spec.slug}`] = file;
        }
        return n;
      });
    }
    setEditSpec(null);
  };

  /* ── collection ops ── */
  const openNewCol = () => {
    setEditCol({
      originalSlug: null,
      col: {
        slug: "",
        name: "",
        material: "",
        count: 0,
        tagline: "",
        blurb: "",
        tone: "brass",
        index: ROMAN[draft.collections.length] ?? String(draft.collections.length + 1),
        subcategories: undefined,
      },
    });
  };
  const deleteCol = (c: Collection) => {
    const n = draft.specimens.filter((s) => s.collection === c.slug).length;
    if (n > 0) {
      window.alert(`“${c.name}” still has ${n} product${n === 1 ? "" : "s"}. Move or delete them first.`);
      return;
    }
    if (!window.confirm(`Delete the “${c.name}” collection?`)) return;
    setDraft((d) => ({ ...d, collections: d.collections.filter((x) => x.slug !== c.slug) }));
  };
  const applyCol = (col: Collection, originalSlug: string | null, file: { file: File; url: string } | null) => {
    setDraft((d) => {
      let specimens = d.specimens;
      // keep products pointing at the collection if its slug changed
      if (originalSlug && originalSlug !== col.slug) {
        specimens = d.specimens.map((s) => (s.collection === originalSlug ? { ...s, collection: col.slug } : s));
      }
      const collections = originalSlug
        ? d.collections.map((x) => (x.slug === originalSlug ? col : x))
        : [...d.collections, col];
      return { collections, specimens };
    });
    if (file || (originalSlug && originalSlug !== col.slug)) {
      setPending((p) => {
        const n = { ...p };
        if (originalSlug && originalSlug !== col.slug && n[`col:${originalSlug}`]) {
          n[`col:${col.slug}`] = n[`col:${originalSlug}`];
          delete n[`col:${originalSlug}`];
        }
        if (file) {
          if (n[`col:${col.slug}`]) URL.revokeObjectURL(n[`col:${col.slug}`].url);
          n[`col:${col.slug}`] = file;
        }
        return n;
      });
    }
    setEditCol(null);
  };

  /* ── derived list ── */
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return draft.specimens.filter(
      (s) =>
        (!filterCol || s.collection === filterCol) &&
        (!q || s.name.toLowerCase().includes(q) || s.slug.includes(q) || (s.ref ?? "").toLowerCase().includes(q)),
    );
  }, [draft.specimens, query, filterCol]);

  const colName = (slug: string) => draft.collections.find((c) => c.slug === slug)?.name ?? "—";

  if (!authChecked) {
    return (
      <div className="grid min-h-svh place-items-center bg-parchment">
        <p className="animate-pulse text-[0.7rem] uppercase tracking-wider2 text-ash">Checking access…</p>
      </div>
    );
  }
  if (!authed) {
    return (
      <div className="grid min-h-svh place-items-center bg-parchment px-6">
        <div className="w-full max-w-sm rounded-2xl border border-line bg-white p-8 text-center shadow-[0_20px_50px_-30px_rgba(34,26,12,0.4)]">
          <p className="font-display text-2xl text-bitumen">Velora CMS</p>
          <p className="mt-1 text-[0.58rem] uppercase tracking-wider2 text-ash">Restricted access</p>
          {configured ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                login();
              }}
              className="mt-7 space-y-3"
            >
              <input
                type="password"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                placeholder="Admin password"
                autoFocus
                className="w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-center text-sm text-bitumen outline-none transition-colors focus:border-brass focus:ring-2 focus:ring-brass/15"
              />
              {loginErr && <p className="text-[0.68rem] text-red-700">{loginErr}</p>}
              <button
                type="submit"
                disabled={loggingIn || !pw}
                className="w-full rounded-full bg-bitumen py-2.5 text-[0.62rem] uppercase tracking-wider2 text-parchment-pale transition-colors hover:bg-bitumen-umber disabled:opacity-40"
              >
                {loggingIn ? "…" : "Enter"}
              </button>
            </form>
          ) : (
            <p className="mt-6 text-[0.75rem] leading-relaxed text-stone">
              Set an <code className="text-brass-deep">ADMIN_PASSWORD</code> environment variable
              on the server to enable the CMS.
            </p>
          )}
        </div>
      </div>
    );
  }
  if (error && !loaded) {
    return (
      <div className="grid min-h-svh place-items-center p-6 text-center">
        <p className="max-w-sm text-sm text-stone">{error}</p>
      </div>
    );
  }
  if (!loaded) {
    return (
      <div className="grid min-h-svh place-items-center">
        <p className="animate-pulse text-[0.7rem] uppercase tracking-wider2 text-ash">Loading catalogue…</p>
      </div>
    );
  }

  return (
    <div className="min-h-svh bg-parchment pb-24 text-bitumen">
      {/* ── Top bar ── */}
      <header className="sticky top-0 z-30 border-b border-line/70 bg-parchment/85 backdrop-blur">
        <div className="flex w-full items-center justify-between gap-3 px-5 py-3 sm:px-8">
          <div className="min-w-0">
            <p className="font-display text-lg leading-none text-bitumen sm:text-xl">Velora CMS</p>
            <p className="mt-0.5 truncate text-[0.58rem] uppercase tracking-wider2 text-ash">
              {dirty
                ? `${changes.added} added · ${changes.edited} edited · ${changes.removed} removed`
                : "All changes saved"}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button
              onClick={logout}
              className="hidden rounded-full px-3 py-2 text-[0.62rem] uppercase tracking-wider2 text-ash transition-colors hover:text-stone sm:block"
            >
              Log out
            </button>
            {dirty && (
              <button
                onClick={discard}
                disabled={saving}
                className="rounded-full border border-line px-3.5 py-2 text-[0.62rem] uppercase tracking-wider2 text-stone transition-colors hover:border-stone/40 disabled:opacity-40"
              >
                Discard
              </button>
            )}
            <button
              onClick={save}
              disabled={!dirty || saving}
              className={cn(
                "rounded-full px-5 py-2 text-[0.62rem] uppercase tracking-wider2 transition-all duration-300",
                dirty && !saving
                  ? "bg-bitumen text-parchment-pale hover:bg-bitumen-umber"
                  : "cursor-not-allowed bg-line text-ash",
              )}
            >
              {saving ? "Saving…" : dirty ? "Save & publish" : "Saved"}
            </button>
          </div>
        </div>
        {/* Tabs */}
        <div className="flex w-full gap-1 px-5 sm:px-8">
          {(["products", "collections"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "relative -mb-px border-b-2 px-3 py-2.5 text-[0.7rem] uppercase tracking-wide3 transition-colors",
                tab === t ? "border-brass text-bitumen" : "border-transparent text-ash hover:text-stone",
              )}
            >
              {t === "products" ? `Products (${draft.specimens.length})` : `Collections (${draft.collections.length})`}
            </button>
          ))}
        </div>
      </header>

      <main className="w-full px-5 py-6 sm:px-8">
        {tab === "products" ? (
          <>
            {/* Controls */}
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
              <TextInput
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products…"
                className="sm:max-w-xs"
              />
              <div className="flex items-center gap-3">
                <SelectInput
                  value={filterCol}
                  onChange={setFilterCol}
                  placeholder="All collections"
                  options={draft.collections.map((c) => ({ value: c.slug, label: c.name }))}
                  className="min-w-[10rem]"
                />
                <button
                  onClick={openNewSpec}
                  disabled={draft.collections.length === 0}
                  className="ml-auto shrink-0 rounded-full bg-brass px-4 py-2.5 text-[0.62rem] uppercase tracking-wider2 text-bitumen transition-colors hover:bg-brass-leaf disabled:opacity-40 sm:ml-0"
                >
                  + Add product
                </button>
              </div>
            </div>

            {filtered.length === 0 ? (
              <p className="py-16 text-center text-sm text-ash">No products match.</p>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {filtered.map((s) => (
                  <div
                    key={s.slug}
                    className="group flex flex-col overflow-hidden rounded-xl border border-line bg-white transition-shadow hover:shadow-[0_14px_30px_-20px_rgba(34,26,12,0.35)]"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-parchment-pale">
                      {imgFor("spec", s.slug, s.image) ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={imgFor("spec", s.slug, s.image)} alt="" className="absolute inset-0 h-full w-full object-cover" />
                      ) : (
                        <span className="absolute inset-0 grid place-items-center text-[0.6rem] uppercase tracking-wider2 text-ash/60">
                          No image
                        </span>
                      )}
                      {s.featured && (
                        <span className="absolute left-2 top-2 rounded-full bg-brass/90 px-2 py-0.5 text-[0.52rem] uppercase tracking-wider2 text-bitumen">
                          Featured
                        </span>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-3.5">
                      <p className="font-display text-[1.05rem] leading-tight text-bitumen">{s.name || "Untitled"}</p>
                      <p className="mt-1 text-[0.62rem] uppercase tracking-wider2 text-ash">
                        {colName(s.collection)}
                        {s.subcategory ? ` · ${s.subcategory}` : ""}
                      </p>
                      <p className="mt-1 text-[0.62rem] text-ash/70">{s.ref}</p>
                      <div className="mt-3 flex items-center gap-1.5 border-t border-line/70 pt-3 text-[0.62rem] uppercase tracking-wider2">
                        <button onClick={() => setEditSpec({ spec: clone(s), originalSlug: s.slug })} className="rounded-full px-2.5 py-1 text-brass-deep transition-colors hover:bg-brass/10">
                          Edit
                        </button>
                        <button onClick={() => duplicateSpec(s)} className="rounded-full px-2.5 py-1 text-stone transition-colors hover:bg-line/60">
                          Duplicate
                        </button>
                        <button onClick={() => deleteSpec(s)} className="ml-auto rounded-full px-2.5 py-1 text-red-700/80 transition-colors hover:bg-red-700/10">
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            <div className="mb-5 flex items-center justify-between">
              <p className="text-sm text-stone">Manage collections & their subcategories.</p>
              <button
                onClick={openNewCol}
                className="rounded-full bg-brass px-4 py-2.5 text-[0.62rem] uppercase tracking-wider2 text-bitumen transition-colors hover:bg-brass-leaf"
              >
                + Add collection
              </button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {draft.collections.map((c) => {
                const n = draft.specimens.filter((s) => s.collection === c.slug).length;
                return (
                  <div key={c.slug} className="flex gap-3.5 rounded-xl border border-line bg-white p-3.5">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-parchment-pale">
                      {imgFor("col", c.slug, c.cover) && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={imgFor("col", c.slug, c.cover)} alt="" className="absolute inset-0 h-full w-full object-cover" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline gap-2">
                        <span className="text-[0.6rem] text-brass-deep">{c.index}</span>
                        <p className="truncate font-display text-lg text-bitumen">{c.name}</p>
                      </div>
                      <p className="mt-0.5 text-[0.62rem] uppercase tracking-wider2 text-ash">
                        {n} piece{n === 1 ? "" : "s"}
                        {c.subcategories?.length ? ` · ${c.subcategories.length} categories` : ""}
                      </p>
                      <div className="mt-2.5 flex gap-1.5 text-[0.62rem] uppercase tracking-wider2">
                        <button onClick={() => setEditCol({ col: clone(c), originalSlug: c.slug })} className="rounded-full px-2.5 py-1 text-brass-deep transition-colors hover:bg-brass/10">
                          Edit
                        </button>
                        <button onClick={() => deleteCol(c)} className="rounded-full px-2.5 py-1 text-red-700/80 transition-colors hover:bg-red-700/10">
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </main>

      {/* ── Editors ── */}
      {editSpec && (
        <SpecEditor
          key={editSpec.originalSlug ?? "new"}
          initial={editSpec.spec}
          originalSlug={editSpec.originalSlug}
          collections={draft.collections}
          existingSlugs={draft.specimens.map((s) => s.slug)}
          initialImage={imgFor("spec", editSpec.spec.slug, editSpec.spec.image)}
          onCancel={() => setEditSpec(null)}
          onApply={applySpec}
        />
      )}
      {editCol && (
        <ColEditor
          key={editCol.originalSlug ?? "new"}
          initial={editCol.col}
          originalSlug={editCol.originalSlug}
          existingSlugs={draft.collections.map((c) => c.slug)}
          initialImage={imgFor("col", editCol.col.slug, editCol.col.cover)}
          onCancel={() => setEditCol(null)}
          onApply={applyCol}
        />
      )}

      {/* ── Toast ── */}
      {toast && (
        <div
          className={cn(
            "fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-full px-5 py-2.5 text-[0.7rem] uppercase tracking-wide3 shadow-lg",
            toast.kind === "ok" ? "bg-bitumen text-parchment-pale" : "bg-red-800 text-white",
          )}
        >
          {toast.msg}
        </div>
      )}
    </div>
  );
}

/* ══════════════ Drawer shell ══════════════ */
function Drawer({ title, onCancel, children, footer }: { title: string; onCancel: () => void; children: React.ReactNode; footer: React.ReactNode }) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === "Escape" && onCancel();
    document.addEventListener("keydown", h);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", h);
      document.body.style.overflow = "";
    };
  }, [onCancel]);
  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <div className="absolute inset-0 bg-bitumen/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative flex h-full w-full flex-col bg-parchment shadow-2xl sm:max-w-md">
        <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
          <p className="font-display text-lg text-bitumen">{title}</p>
          <button onClick={onCancel} aria-label="Close" className="grid h-8 w-8 place-items-center rounded-full text-ash transition-colors hover:bg-line/60">
            ✕
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-5">{children}</div>
        <div className="flex items-center gap-3 border-t border-line px-5 py-3.5">{footer}</div>
      </div>
    </div>
  );
}

/* Small labelled divider that groups fields inside an editor drawer. */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="border-t border-line/70 pt-4 text-[0.58rem] font-semibold uppercase tracking-[0.2em] text-brass-deep first:border-0 first:pt-0">
      {children}
    </p>
  );
}

/* ══════════════ Product editor ══════════════ */
function SpecEditor({
  initial,
  originalSlug,
  collections,
  existingSlugs,
  initialImage,
  onCancel,
  onApply,
}: {
  initial: Specimen;
  originalSlug: string | null;
  collections: Collection[];
  existingSlugs: string[];
  initialImage: string;
  onCancel: () => void;
  onApply: (spec: Specimen, originalSlug: string | null, file: { file: File; url: string } | null) => void;
}) {
  const [f, setF] = useState<Specimen>(initial);
  const [slugTouched, setSlugTouched] = useState(Boolean(originalSlug));
  const [file, setFile] = useState<{ file: File; url: string } | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const set = <K extends keyof Specimen>(k: K, v: Specimen[K]) => setF((p) => ({ ...p, [k]: v }));

  const activeCol = collections.find((c) => c.slug === f.collection);
  const slug = slugTouched ? f.slug : slugify(f.name);
  const preview = file?.url ?? initialImage;

  const submit = () => {
    const finalSlug = slugify(slug);
    if (!f.name.trim()) return setErr("Name is required.");
    if (!finalSlug) return setErr("A URL slug is required.");
    if (!f.collection) return setErr("Choose a collection.");
    const clash = existingSlugs.filter((s) => s !== originalSlug).includes(finalSlug);
    if (clash) return setErr("That slug is already used by another product.");
    onApply({ ...f, slug: finalSlug, tags: f.tags ?? [] }, originalSlug, file);
  };

  return (
    <Drawer
      title={originalSlug ? "Edit product" : "New product"}
      onCancel={onCancel}
      footer={
        <>
          {err && <span className="text-[0.68rem] text-red-700">{err}</span>}
          <button onClick={onCancel} className="ml-auto rounded-full border border-line px-4 py-2 text-[0.62rem] uppercase tracking-wider2 text-stone transition-colors hover:border-stone/40">
            Cancel
          </button>
          <button onClick={submit} className="rounded-full bg-bitumen px-5 py-2 text-[0.62rem] uppercase tracking-wider2 text-parchment-pale transition-colors hover:bg-bitumen-umber">
            {originalSlug ? "Apply" : "Add"}
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <SectionLabel>Photograph</SectionLabel>
        <Field label="Product image">
          <ImagePicker
            url={preview}
            onFile={(file) => setFile({ file, url: URL.createObjectURL(file) })}
            onClear={file || initialImage ? () => { setFile(null); set("image", undefined); } : undefined}
          />
        </Field>

        <SectionLabel>Basic info</SectionLabel>
        <Field label="Product name" required>
          <TextInput value={f.name} onChange={(e) => set("name", e.target.value)} placeholder="Shikar Cheetah Table Lamp" />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="URL slug" required hint="in the address bar">
            <TextInput
              value={slug}
              onChange={(e) => { setSlugTouched(true); set("slug", e.target.value); }}
              placeholder="auto from name"
            />
          </Field>
          <Field label="Reference code">
            <TextInput value={f.ref} onChange={(e) => set("ref", e.target.value)} placeholder="VL-01" />
          </Field>
        </div>

        <SectionLabel>Category</SectionLabel>
        <Field label="Collection" required>
          <SelectInput
            value={f.collection}
            onChange={(v) => { set("collection", v); set("subcategory", undefined); }}
            placeholder="Choose a collection…"
            options={collections.map((c) => ({ value: c.slug, label: c.name }))}
          />
        </Field>
        <Field label="Subcategory" hint={activeCol?.subcategories?.length ? "" : "none set on this collection"}>
          <SelectInput
            value={f.subcategory ?? ""}
            onChange={(v) => set("subcategory", v || undefined)}
            placeholder="—"
            options={(activeCol?.subcategories ?? []).map((s) => ({ value: s, label: s }))}
          />
        </Field>

        <SectionLabel>Craft details</SectionLabel>
        <Field label="Material" hint="doubles as the card caption">
          <TextInput value={f.material} onChange={(e) => set("material", e.target.value)} placeholder="Cast brass & amber glass" />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Tone / metal">
            <SelectInput value={f.tone} onChange={(v) => set("tone", v as Specimen["tone"])} options={TONES.map(opt)} />
          </Field>
          <Field label="Shape" hint="for the SVG fallback">
            <SelectInput value={f.shape} onChange={(v) => set("shape", v as Specimen["shape"])} options={SHAPES.map(opt)} />
          </Field>
        </div>
        <Field label="Finish" hint="optional">
          <SelectInput
            value={f.finish ?? ""}
            onChange={(v) => set("finish", v || undefined)}
            placeholder="—"
            options={FINISHES.map((x) => ({ value: x.name, label: x.name }))}
          />
        </Field>

        <SectionLabel>Description</SectionLabel>
        <Field label="Short description" hint="sits under the title">
          <TextArea rows={2} value={f.desc} onChange={(e) => set("desc", e.target.value)} placeholder="One line that sits under the title." />
        </Field>
        <Field label="Story" hint="the longer detail-page copy">
          <TextArea rows={4} value={f.story} onChange={(e) => set("story", e.target.value)} />
        </Field>
        <Field label="Tags">
          <Chips values={f.tags ?? []} onChange={(v) => set("tags", v)} placeholder="Statement, Bedside…" />
        </Field>

        <SectionLabel>Visibility</SectionLabel>
        <Toggle checked={Boolean(f.featured)} onChange={(v) => set("featured", v || undefined)} label="Feature this piece" />
      </div>
    </Drawer>
  );
}

/* ══════════════ Collection editor ══════════════ */
function ColEditor({
  initial,
  originalSlug,
  existingSlugs,
  initialImage,
  onCancel,
  onApply,
}: {
  initial: Collection;
  originalSlug: string | null;
  existingSlugs: string[];
  initialImage: string;
  onCancel: () => void;
  onApply: (col: Collection, originalSlug: string | null, file: { file: File; url: string } | null) => void;
}) {
  const [f, setF] = useState<Collection>(initial);
  const [slugTouched, setSlugTouched] = useState(Boolean(originalSlug));
  const [file, setFile] = useState<{ file: File; url: string } | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const set = <K extends keyof Collection>(k: K, v: Collection[K]) => setF((p) => ({ ...p, [k]: v }));

  const slug = slugTouched ? f.slug : slugify(f.name);
  const preview = file?.url ?? initialImage;

  const submit = () => {
    const finalSlug = slugify(slug);
    if (!f.name.trim()) return setErr("Name is required.");
    if (!finalSlug) return setErr("A URL slug is required.");
    if (existingSlugs.filter((s) => s !== originalSlug).includes(finalSlug)) return setErr("That slug is already used.");
    onApply({ ...f, slug: finalSlug, subcategories: f.subcategories?.length ? f.subcategories : undefined }, originalSlug, file);
  };

  return (
    <Drawer
      title={originalSlug ? "Edit collection" : "New collection"}
      onCancel={onCancel}
      footer={
        <>
          {err && <span className="text-[0.68rem] text-red-700">{err}</span>}
          <button onClick={onCancel} className="ml-auto rounded-full border border-line px-4 py-2 text-[0.62rem] uppercase tracking-wider2 text-stone transition-colors hover:border-stone/40">
            Cancel
          </button>
          <button onClick={submit} className="rounded-full bg-bitumen px-5 py-2 text-[0.62rem] uppercase tracking-wider2 text-parchment-pale transition-colors hover:bg-bitumen-umber">
            {originalSlug ? "Apply" : "Add"}
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <Field label="Cover image">
          <ImagePicker
            url={preview}
            aspect="aspect-[16/10]"
            onFile={(file) => setFile({ file, url: URL.createObjectURL(file) })}
            onClear={file || initialImage ? () => { setFile(null); set("cover", undefined); } : undefined}
          />
        </Field>
        <div className="grid grid-cols-[1fr_5rem] gap-3">
          <Field label="Name" required>
            <TextInput value={f.name} onChange={(e) => set("name", e.target.value)} placeholder="Lighting" />
          </Field>
          <Field label="Numeral">
            <TextInput value={f.index} onChange={(e) => set("index", e.target.value)} placeholder="I" />
          </Field>
        </div>
        <Field label="URL slug" required>
          <TextInput value={slug} onChange={(e) => { setSlugTouched(true); set("slug", e.target.value); }} placeholder="auto from name" />
        </Field>
        <Field label="Material line">
          <TextInput value={f.material} onChange={(e) => set("material", e.target.value)} placeholder="Brass, bronze & crystal" />
        </Field>
        <Field label="Tagline">
          <TextInput value={f.tagline} onChange={(e) => set("tagline", e.target.value)} placeholder="Light & shadow" />
        </Field>
        <Field label="Blurb">
          <TextArea rows={3} value={f.blurb} onChange={(e) => set("blurb", e.target.value)} />
        </Field>
        <Field label="Tone">
          <SelectInput value={f.tone} onChange={(v) => set("tone", v as Collection["tone"])} options={TONES.map(opt)} />
        </Field>
        <Field label="Subcategories" hint="filter chips within the collection">
          <Chips values={f.subcategories ?? []} onChange={(v) => set("subcategories", v)} placeholder="Lamps, Candle Stands…" />
        </Field>
      </div>
    </Drawer>
  );
}
