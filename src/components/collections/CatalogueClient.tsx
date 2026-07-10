"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import type { Specimen } from "@/lib/data";
import { SpecimenCard } from "@/components/ui/SpecimenCard";
import { SILK } from "@/lib/motion";
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
                  "rounded-full border px-4 py-2 text-[0.68rem] uppercase tracking-wider2 transition-all duration-500 ease-silk",
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
            className="cursor-pointer rounded-full border border-line bg-parchment-pale px-3 py-1.5 text-[0.7rem] tracking-wide text-bitumen transition-colors hover:border-brass focus:border-brass focus:outline-none"
          >
            {SORTS.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* 4-up grid. Each card hinges up from the table on a bottom axis as it
         scrolls into view — a scroll-triggered 3D reveal, staggered by column.
         Layout/reflow lives on the outer node; the 3D transform lives on the
         inner node so framer's layout engine and the reveal never fight. */}
      <motion.div layout className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <AnimatePresence mode="popLayout">
          {filtered.map((s, i) => (
            <motion.div
              key={s.slug}
              layout
              exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.3, ease: SILK } }}
              className="h-full [perspective:1000px]"
            >
              <motion.div
                initial={
                  reduce
                    ? { opacity: 0 }
                    : { opacity: 0, y: 76, rotateX: 26, scale: 0.94 }
                }
                whileInView={
                  reduce
                    ? { opacity: 1 }
                    : { opacity: 1, y: 0, rotateX: 0, scale: 1 }
                }
                viewport={{ once: true, amount: 0.2, margin: "0px 0px -8% 0px" }}
                transition={{ duration: 0.85, ease: SILK, delay: (i % 4) * 0.08 }}
                style={{ transformOrigin: "center bottom", willChange: "transform, opacity" }}
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
