"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Specimen } from "@/lib/data";
import { SpecimenCard } from "@/components/ui/SpecimenCard";
import { SILK } from "@/lib/motion";

const SORTS = ["Featured", "A–Z", "Newest"] as const;

export function CatalogueClient({ specimens }: { specimens: Specimen[] }) {
  const [sort, setSort] = useState<(typeof SORTS)[number]>("Featured");

  const filtered = useMemo(() => {
    if (sort === "A–Z") return [...specimens].sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "Newest") return [...specimens].sort((a, b) => b.year - a.year || a.name.localeCompare(b.name));
    return [...specimens].sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)));
  }, [specimens, sort]);

  return (
    <div>
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

      <motion.div layout className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((s, i) => (
            <motion.div
              key={s.slug}
              layout
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.6, ease: SILK, delay: Math.min(i * 0.055, 0.5) }}
              className="h-full"
            >
              <SpecimenCard s={s} index={i} showCaption />
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

