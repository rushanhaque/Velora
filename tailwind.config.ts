import type { Config } from "tailwindcss";

/**
 * Velora International v3.0 — bespoke design tokens.
 * A palette drawn from worked metal: parchment grounds, bitumen ink,
 * a living brass accent with real depth, and a rare whisper of verdigris
 * (the green of aged copper) used only as a grace note.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Grounds — airy warm porcelain (the new light canvas)
        parchment: {
          DEFAULT: "#F0EBE1",
          pale: "#F8F6F0",
          deep: "#E4DECF",
          shell: "#D8D0BD",
        },
        // Ink — warm near-black, kept for the footer & rare dark accent
        bitumen: {
          DEFAULT: "#0A0907",
          ink: "#12100C",
          umber: "#1A1711",
          soft: "#26221A",
        },
        // Brass — refined champagne gold accent
        brass: {
          DEFAULT: "#B89B6A", // decorative champagne (borders, rings, swatches)
          leaf: "#D4B986", // highlight on dark
          gilt: "#EADEB3",
          deep: "#8C703A", // AA-compliant gold TEXT on light grounds
          ember: "#A38244",
        },
        // Material marks
        copper: "#A66A45",
        bronze: "#7A5C33",
        silver: "#9FA0A0",
        // The grace note — aged-copper patina (focus rings, tiny marks)
        verdigris: {
          DEFAULT: "#3D5A4D",
          light: "#5E7D6E",
        },
        // Warm neutrals for type & hairlines (AA on porcelain)
        stone: "#544E42", // body text (~7.4:1)
        ash: "#6E6657", // small functional labels (~5.3:1)
        haze: "#A89C86", // muted text on the dark footer only
        mist: "#C8BCA6",
        line: "#E3DCCD", // hairlines on light
      },
      fontFamily: {
        display: ["var(--font-display)", "Cormorant Garamond", "serif"],
        sans: ["var(--font-sans)", "Jost", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      letterSpacing: {
        ultra: "0.42em",
        wider2: "0.24em",
        wide3: "0.16em",
      },
      borderRadius: {
        card: "1.15rem",
        xl2: "1.6rem",
        xl3: "2.1rem",
        blob: "2.6rem",
      },
      boxShadow: {
        plate:
          "0 1px 0 rgba(255,255,255,0.5) inset, 0 18px 40px -24px rgba(34,26,12,0.45), 0 4px 14px -8px rgba(34,26,12,0.25)",
        plateHover:
          "0 1px 0 rgba(255,255,255,0.6) inset, 0 40px 70px -34px rgba(34,26,12,0.55), 0 10px 24px -12px rgba(34,26,12,0.32)",
        lift: "0 30px 60px -30px rgba(20,17,11,0.5)",
        ring: "0 0 0 1px rgba(167,126,54,0.4)",
        // v3.0 — glow variants for ambient effects
        "glow-brass":
          "0 0 40px rgba(176,145,92,0.22), 0 0 80px rgba(176,145,92,0.10)",
        "glow-brass-lg":
          "0 0 60px rgba(176,145,92,0.30), 0 0 120px rgba(176,145,92,0.14), 0 0 200px rgba(176,145,92,0.06)",
        "glow-copper":
          "0 0 40px rgba(166,106,69,0.22), 0 0 80px rgba(166,106,69,0.10)",
        "glow-warm":
          "0 0 80px rgba(200,167,101,0.18), 0 8px 32px rgba(34,26,12,0.14)",
        "inner-glow":
          "inset 0 0 60px rgba(200,167,101,0.08), inset 0 1px 0 rgba(255,255,255,0.5)",
      },
      transitionTimingFunction: {
        silk: "cubic-bezier(0.16, 1, 0.3, 1)",
        ease2: "cubic-bezier(0.22, 1, 0.36, 1)",
        anticipate: "cubic-bezier(0.68, -0.4, 0.27, 1.3)",
        spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
      maxWidth: {
        shell: "1320px",
        prose2: "62ch",
      },
      backdropBlur: {
        xl2: "24px",
        xl3: "40px",
      },
      keyframes: {
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        marqueeRev: {
          from: { transform: "translateX(-50%)" },
          to: { transform: "translateX(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        floaty: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        spinSlow: {
          to: { transform: "rotate(360deg)" },
        },
        // v3.0 keyframes
        pulseGlow: {
          "0%,100%": { opacity: "0.5", transform: "scale(1)" },
          "50%": { opacity: "0.8", transform: "scale(1.06)" },
        },
        drawIn: {
          from: { strokeDashoffset: "1" },
          to: { strokeDashoffset: "0" },
        },
        shimmerSweep: {
          "0%": { transform: "translateX(-100%) skewX(-15deg)" },
          "100%": { transform: "translateX(200%) skewX(-15deg)" },
        },
        floatGentle: {
          "0%,100%": { transform: "translateY(0) rotate(0deg)" },
          "33%": { transform: "translateY(-6px) rotate(0.5deg)" },
          "66%": { transform: "translateY(-3px) rotate(-0.3deg)" },
        },
        rotateSlow: {
          to: { transform: "rotate(360deg)" },
        },
        fadeInUp: {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          from: { opacity: "0", transform: "scale(0.92)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        ripple: {
          to: { transform: "scale(2.5)", opacity: "0" },
        },
        breathe: {
          "0%,100%": { boxShadow: "0 0 0 0 rgba(176,145,92,0)" },
          "50%": { boxShadow: "0 0 40px 4px rgba(176,145,92,0.15)" },
        },
      },
      animation: {
        marquee: "marquee var(--marquee-dur,42s) linear infinite",
        marqueeRev: "marqueeRev var(--marquee-dur,42s) linear infinite",
        shimmer: "shimmer 3.5s linear infinite",
        floaty: "floaty 7s ease-in-out infinite",
        spinSlow: "spinSlow 26s linear infinite",
        // v3.0
        "pulse-glow": "pulseGlow 4s ease-in-out infinite",
        "draw-in": "drawIn 1.2s cubic-bezier(0.16,1,0.3,1) forwards",
        "shimmer-sweep": "shimmerSweep 1.6s cubic-bezier(0.16,1,0.3,1)",
        "float-gentle": "floatGentle 8s ease-in-out infinite",
        "rotate-slow": "rotateSlow 60s linear infinite",
        "fade-in-up": "fadeInUp 0.7s cubic-bezier(0.16,1,0.3,1) both",
        "scale-in": "scaleIn 0.6s cubic-bezier(0.16,1,0.3,1) both",
        ripple: "ripple 0.6s ease-out forwards",
        breathe: "breathe 5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
