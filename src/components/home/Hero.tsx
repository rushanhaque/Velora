import Image from "next/image";

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
  // Soft cream glow bound to the glyphs — lifts the dark copy off the
  // photograph without laying a whitish sheet over the whole hero.
  const glow = {
    textShadow:
      "0 1px 1px rgba(250,247,240,0.6), 0 1px 14px rgba(250,247,240,0.72), 0 0 30px rgba(250,247,240,0.4)",
  };

  return (
    <section className="relative flex min-h-[100svh] flex-col overflow-hidden">
      {/* Landing photograph — the golden-hour terrace, behind everything.
         Left vivid: no flat wash — legibility is handled locally on the text. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-20">
        <Image
          src="/media/landing-bg.jpg"
          alt=""
          fill
          priority
          quality={80}
          sizes="100vw"
          className="object-cover object-[center_70%]"
        />
      </div>

      {/* A whisper of light seated behind the mark + a faint warm floor glow —
         just enough to hold the dark wordmark, nowhere near a full wash. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(30% 24% at 50% 45%, rgba(252,251,247,0.26) 0%, rgba(250,246,238,0) 72%), radial-gradient(90% 55% at 50% 122%, rgba(200,167,101,0.10), transparent 60%)",
        }}
      />

      {/* Breathing forge-light behind the wordmark — barely there, alive */}
      <div
        aria-hidden="true"
        className="animate-pulse-glow pointer-events-none absolute left-1/2 top-[38%] -z-10 h-[min(60vw,420px)] w-[min(80vw,640px)] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background: "radial-gradient(ellipse at center, rgba(176,145,92,0.16), transparent 68%)",
          animationDuration: "9s",
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
          stroke="rgba(176,145,92,0.12)"
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
        <span
          className="eyebrow eyebrow-settle inline-flex items-center gap-3 text-brass-deep"
          style={glow}
        >
          <span className="h-px w-7 bg-current opacity-40 sm:w-10" aria-hidden="true" />
          Métaux d&apos;Art · Est. 1972
          <span className="h-px w-7 bg-current opacity-40 sm:w-10" aria-hidden="true" />
        </span>
      </div>

      {/* Tagline + CTA — below the mark, all viewports. */}
      <div
        className="absolute inset-x-0 top-[63svh] flex flex-col items-center px-6 text-center"
        style={fade}
      >
        <p
          className="max-w-[17rem] font-display text-[clamp(1.5rem,6.2vw,2.15rem)] font-medium leading-[1.12] text-bitumen sm:max-w-sm"
          style={glow}
        >
          Hand-raised metalware for the{" "}
          <span className="serif-italic text-brass-deep">world&apos;s finest interiors.</span>
        </p>
      </div>

    </section>
  );
}
