"use client";

import { motion } from "framer-motion";
import { SILK } from "@/lib/motion";

/** Plays on every route change — a quiet lift, with a brass thread that sweeps. */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: SILK }}
      >
        {children}
      </motion.div>
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-[2px] origin-left bg-gradient-to-r from-transparent via-brass to-transparent"
        initial={{ scaleX: 0, opacity: 1 }}
        animate={{ scaleX: 1, opacity: 0 }}
        transition={{ duration: 0.9, ease: SILK }}
      />
    </>
  );
}
