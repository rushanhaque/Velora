import Link from "next/link";

/**
 * Home hero — the stage the fixed <HeroBrand/> wordmark lives over.
 * The wordmark sits centred and docks into the header on scroll; this
 * section supplies the supporting frame: an eyebrow above, a tagline +
 * call-to-action below (phone/tablet, where the wordmark is short and
 * leaves room), and an animated scroll cue. Everything fades out via the
 * `--scroll-cue-o` variable that <HeroBrand/> drives, so the hero text
 * dissolves exactly as the wordmark lifts away.
 */
export function Hero() {
  const fade = {
    opacity: "var(--scroll-cue-o, 1)",
    transition: "opacity .5s var(--ease-silk)",
  };

  return (
    <section className="relative flex min-h-[100svh] flex-col overflow-hidden">
      {/* Ambient grounds — warm light pooling behind the mark */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(58% 46% at 50% 34%, #fcfbf7 0%, rgba(250,246,238,0) 62%), radial-gradient(90% 60% at 50% 118%, rgba(200,167,101,0.12), transparent 60%)",
        }}
      />

      {/* Faint rotating ornament, centred behind the wordmark */}
      <div
        aria-hidden="true"
        className="ornamental-mark left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2"
      >
        <svg
          viewBox="0 0 200 200"
          className="h-[min(78vw,420px)] w-[min(78vw,420px)]"
          fill="none"
          stroke="rgba(176,145,92,0.10)"
          strokeWidth="0.6"
        >
          <rect x="100" y="8" width="130" height="130" transform="rotate(45 100 8)" rx="2" />
          <rect x="100" y="30" width="98" height="98" transform="rotate(45 100 30)" rx="2" />
          <circle cx="100" cy="100" r="48" />
          <circle cx="100" cy="100" r="28" strokeDasharray="2 6" />
        </svg>
      </div>

      {/* Eyebrow — above the mark, all viewports */}
      <div
        className="absolute inset-x-0 top-[clamp(104px,19svh,200px)] flex justify-center px-6"
        style={fade}
      >
        <span className="eyebrow inline-flex items-center gap-3 text-brass-deep">
          <span className="h-px w-7 bg-current opacity-40 sm:w-10" aria-hidden="true" />
          Métaux d&apos;Art · Est. 1972
          <span className="h-px w-7 bg-current opacity-40 sm:w-10" aria-hidden="true" />
        </span>
      </div>

      {/* Tagline + CTA — below the mark. Phone/tablet only: on desktop the
          wordmark grows tall enough to want the space to itself. */}
      <div
        className="absolute inset-x-0 top-[63svh] flex flex-col items-center px-6 text-center lg:hidden"
        style={fade}
      >
        <p className="max-w-[17rem] font-display text-[clamp(1.4rem,6vw,2rem)] leading-[1.12] text-bitumen sm:max-w-sm">
          Hand-raised metalware for the{" "}
          <span className="serif-italic text-brass-deep">world&apos;s finest interiors.</span>
        </p>
        <Link
          href="/collections"
          className="link-draw group mt-7 inline-flex items-center gap-1.5 text-[0.72rem] uppercase tracking-wide3 text-bitumen"
        >
          Explore the collections
          <span className="text-brass-deep transition-transform duration-500 ease-silk group-hover:translate-x-1">
            →
          </span>
        </Link>
      </div>

      {/* Scroll cue — bottom, all viewports */}
      <div
        className="absolute inset-x-0 bottom-[max(1.5rem,env(safe-area-inset-bottom))] flex justify-center"
        style={fade}
      >
        <span className="flex flex-col items-center gap-3">
          <span className="hero-cue-line" aria-hidden="true" />
        </span>
      </div>

      {/* Bottom vignette — depth into the page below */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-48 bg-gradient-to-t from-parchment to-transparent"
      />
    </section>
  );
}
