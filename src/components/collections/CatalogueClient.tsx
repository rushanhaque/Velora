"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import type { Specimen } from "@/lib/data";
import { SpecimenCard } from "@/components/ui/SpecimenCard";
import { SILK } from "@/lib/motion";
import { prefersLite } from "@/lib/perf";
import { cn } from "@/lib/utils";

const SORTS = ["Featured", "A–Z"] as const;

export function CatalogueClient({
  specimens,
  subcategories = [],
}: {
  specimens: Specimen[];
  subcategories?: string[];
}) {
  const [sort, setSort] = useState<(typeof SORTS)[number]>("Featured");
  const [cat, setCat] = useState<string>("All");
  const reduce = useReducedMotion();
  // One clean rise + fade on every device — no 3D hinge/tilt. (The old hinge
  // read the viewport in an effect, so phones captured the desktop `rotateX`
  // at first paint and the mobile target never reset it — cards sat leaned.)
  const [lite, setLite] = useState(false);
  useEffect(() => {
    setLite(prefersLite());
  }, []);
  const still = reduce || lite;

  // Only surface filter groups that actually have pieces in this collection.
  const groups = useMemo(
    () => subcategories.filter((g) => specimens.some((s) => s.subcategory === g)),
    [subcategories, specimens],
  );

  const filtered = useMemo(() => {
    const scoped = cat === "All" ? specimens : specimens.filter((s) => s.subcategory === cat);
    if (sort === "A–Z") return [...scoped].sort((a, b) => a.name.localeCompare(b.name));
    return [...scoped].sort(
      (a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)),
    );
  }, [specimens, sort, cat]);

  return (
    <div>
      {/* Filter chips — one per subcategory, plus All */}
      {groups.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2.5">
          {["All", ...groups].map((g) => {
            const on = cat === g;
            return (
              <button
                key={g}
                type="button"
                onClick={() => setCat(g)}
                data-cursor="link"
                className={cn(
                  "rounded-full border px-4 py-2.5 text-[0.68rem] uppercase tracking-wider2 transition-all duration-500 ease-silk sm:py-2",
                  on
                    ? "border-brass bg-brass/10 text-brass-deep"
                    : "border-line text-ash hover:border-brass/50 hover:text-bitumen",
                )}
              >
                {g}
              </button>
            );
          })}
        </div>
      )}

      <div className="mb-8 flex items-center justify-between">
        <p className="text-[0.7rem] uppercase tracking-wider2 text-ash">
          {filtered.length} {filtered.length === 1 ? "piece" : "pieces"}
        </p>
        <label className="flex items-center gap-2 text-[0.62rem] uppercase tracking-wider2 text-ash">
          Sort
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as (typeof SORTS)[number])}
            className="cursor-pointer rounded-full border border-line bg-parchment-pale px-3 py-2 text-[0.7rem] tracking-wide text-bitumen transition-colors hover:border-brass focus:border-brass focus:outline-none sm:py-1.5"
          >
            {SORTS.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* 4-up grid. Cards rise + fade cleanly as they enter view — a flat,
         uniform reveal on every device, no 3D tilt. */}
      <motion.div layout className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
        <AnimatePresence mode="popLayout">
          {filtered.map((s, i) => (
            <motion.div
              key={s.slug}
              layout
              exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.3, ease: SILK } }}
              className="h-full"
            >
              <motion.div
                initial={still ? { opacity: 0 } : { opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2, margin: "0px 0px -8% 0px" }}
                transition={{ duration: 0.55, ease: SILK }}
                className="h-full"
              >
                <SpecimenCard s={s} index={i} showCaption />
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 && (
        <p className="py-24 text-center font-display text-2xl text-stone">
          No pieces found.
        </p>
      )}
    </div>
  );
}
