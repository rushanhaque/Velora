/**
 * Plays on every route change — a quiet lift + brass thread sweep.
 *
 * ── Why this is not a client component ──────────────────────────────────────
 * It used to be. It rendered the whole page inside `style={{ opacity: 0 }}` and
 * cleared that in a `useEffect`, which meant the server sent a complete,
 * fully-rendered document that the browser was instructed to paint as blank —
 * and it stayed blank until every JavaScript chunk had downloaded, React had
 * hydrated, an effect had run, a frame had passed, and a 0.7s transition had
 * finished. All the work of server rendering was thrown away, and first paint
 * of real content was gated on hydration.
 *
 * A CSS animation does the same thing without any of that. It starts at first
 * paint, needs no JavaScript, and cannot be delayed by a slow bundle — so the
 * page is visible and animating while the JS is still arriving.
 *
 * Being a server component now also means this no longer ships any JS at all.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="page-enter">{children}</div>

      {/* Brass thread sweep across the top on each navigation. */}
      <div
        aria-hidden="true"
        className="page-thread pointer-events-none fixed inset-x-0 top-0 z-[70] h-[2px] origin-left bg-gradient-to-r from-transparent via-brass to-transparent"
      />
    </>
  );
}
