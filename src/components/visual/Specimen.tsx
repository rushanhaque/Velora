import type { Shape, Tone } from "@/lib/data";

/* Turned-metal cylinder ramps, per tone. The bright band sits left of
   centre so every form reads as metal catching a single side light. */
const RAMP: Record<Tone, string[]> = {
  brass: ["#503614", "#7b5a26", "#c8a765", "#fff4d8", "#c8a765", "#a77e36", "#4a3312"],
  copper: ["#5a2f1c", "#8a4327", "#cf7e52", "#ffe0c4", "#cf7e52", "#a85a37", "#4a2616"],
  bronze: ["#2f2410", "#574022", "#9c7a44", "#ecd29a", "#9c7a44", "#6e5230", "#241c0d"],
  silver: ["#5f6163", "#8b8d8e", "#d9dadb", "#ffffff", "#d9dadb", "#9fa0a0", "#56585a"],
};
const INTERIOR: Record<Tone, [string, string]> = {
  brass: ["#3a2810", "#7b5a26"],
  copper: ["#3c1f12", "#8a4327"],
  bronze: ["#1f1809", "#574022"],
  silver: ["#54565a", "#9fa0a0"],
};

/* Deterministic per-piece variation — so two pieces that share a shape
   and tone read as siblings, never clones. */
function hashSeed(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
function rng(seed: number) {
  let x = seed || 1;
  return () => {
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    return (x >>> 0) / 4294967296;
  };
}
interface Delta {
  tilt: number; // light-angle tilt
  rim: number;
  handle: number;
  neck: number;
  spread: number;
}

export function Specimen({
  shape,
  tone,
  seed,
  className,
  ground = true,
}: {
  shape: Shape;
  tone: Tone;
  seed: string;
  className?: string;
  ground?: boolean;
}) {
  const uid = `sp-${seed}`.replace(/[^a-z0-9-]/gi, "");
  const ramp = RAMP[tone];
  const [iA, iB] = INTERIOR[tone];

  const r = rng(hashSeed(seed));
  const d: Delta = {
    tilt: (r() - 0.5) * 0.34,
    rim: (r() - 0.5) * 9,
    handle: (r() - 0.5) * 7,
    neck: (r() - 0.5) * 7,
    spread: (r() - 0.5) * 8,
  };

  return (
    <svg
      viewBox="0 0 240 300"
      className={className}
      role="img"
      aria-label={`${tone} ${shape}, hand-raised metalware`}
      style={{ display: "block", width: "100%", height: "100%" }}
    >
      <defs>
        <linearGradient
          id={`${uid}-body`}
          x1="0"
          y1={`${0.5 - d.tilt}`}
          x2="1"
          y2={`${0.5 + d.tilt}`}
        >
          {ramp.map((c, i) => (
            <stop key={i} offset={`${(i / (ramp.length - 1)) * 100}%`} stopColor={c} />
          ))}
        </linearGradient>
        <linearGradient id={`${uid}-int`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={iA} />
          <stop offset="100%" stopColor={iB} />
        </linearGradient>
        <radialGradient id={`${uid}-shadow`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(20,17,11,0.45)" />
          <stop offset="70%" stopColor="rgba(20,17,11,0.18)" />
          <stop offset="100%" stopColor="rgba(20,17,11,0)" />
        </radialGradient>
        <linearGradient id={`${uid}-spec`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,0.0)" />
          <stop offset="45%" stopColor="rgba(255,255,255,0.55)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.0)" />
        </linearGradient>
      </defs>

      {ground && <ellipse cx="120" cy="262" rx="84" ry="13" fill={`url(#${uid}-shadow)`} />}

      <g fill={`url(#${uid}-body)`} stroke="rgba(20,17,11,0.18)" strokeWidth="0.6">
        {renderShape(shape, uid, d)}
      </g>

      {/* fine top specular sliver shared by upright forms */}
      {["vase", "ewer", "urn", "goblet"].includes(shape) && (
        <rect
          x={`${92 + d.neck}`}
          y="70"
          width="7"
          height="150"
          rx="3.5"
          fill={`url(#${uid}-spec)`}
          opacity="0.5"
        />
      )}
    </svg>
  );
}

function renderShape(shape: Shape, uid: string, d: Delta) {
  const intFill = `url(#${uid}-int)`;
  switch (shape) {
    case "bowl":
      return (
        <>
          <path d="M110,232 h20 v8 q0,6 -10,6 q-10,0 -10,-6 Z" />
          <path d="M44,158 q0,-10 12,-10 h128 q12,0 12,10 q-6,52 -38,72 q-18,10 -38,10 q-20,0 -38,-10 q-32,-20 -38,-72 Z" />
          <ellipse cx="120" cy="158" rx={`${76 + d.rim}`} ry="17" fill={intFill} stroke="rgba(20,17,11,0.22)" />
          <ellipse cx="120" cy="156" rx={`${76 + d.rim}`} ry="15" fill="none" stroke="rgba(255,244,216,0.35)" strokeWidth="1.4" />
        </>
      );
    case "vase":
      return (
        <>
          <path d="M104,236 h32 l-4,8 h-24 Z" />
          <path
            d={`M120,52 q-9,0 -10,8 l-3,30 q-${26 + d.spread},18 -${26 + d.spread},62 q0,58 ${39 + d.spread / 2},82 q${39 + d.spread / 2},-24 ${39 + d.spread / 2},-82 q0,-44 -${26 + d.spread},-62 l-3,-30 q-1,-8 -10,-8 Z`}
          />
          <ellipse cx="120" cy="54" rx={`${13 + d.neck}`} ry="5" fill={intFill} stroke="rgba(20,17,11,0.25)" />
        </>
      );
    case "ewer":
      return (
        <>
          <path d="M104,238 h32 l-4,8 h-24 Z" />
          <path
            d={`M150,96 q${40 + d.handle},8 ${30 + d.handle},66 q-8,40 -30,52`}
            fill="none"
            stroke={`url(#${uid}-body)`}
            strokeWidth="12"
            strokeLinecap="round"
          />
          <path d="M120,70 q-10,0 -12,9 l-4,22 q-26,16 -26,60 q0,52 42,78 q42,-26 42,-78 q0,-44 -26,-60 l-4,-22 q-2,-9 -12,-9 Z" />
          <path d="M118,72 q-6,-14 -20,-22 q14,0 26,12 Z" />
          <ellipse cx="120" cy="72" rx="12" ry="4.5" fill={intFill} stroke="rgba(20,17,11,0.25)" />
        </>
      );
    case "urn":
      return (
        <>
          <path d="M100,238 h40 l-6,10 h-28 Z" />
          <path d={`M66,128 q-${22 + d.handle},2 -16,40`} fill="none" stroke={`url(#${uid}-body)`} strokeWidth="11" strokeLinecap="round" />
          <path d={`M174,128 q${22 + d.handle},2 16,40`} fill="none" stroke={`url(#${uid}-body)`} strokeWidth="11" strokeLinecap="round" />
          <path d="M120,74 q-16,0 -18,10 l-2,16 q-36,18 -36,74 q0,42 56,64 q56,-22 56,-64 q0,-56 -36,-74 l-2,-16 q-2,-10 -18,-10 Z" />
          <ellipse cx="120" cy="78" rx={`${20 + d.rim}`} ry="7" fill={intFill} stroke="rgba(20,17,11,0.25)" />
        </>
      );
    case "platter":
      return (
        <>
          <ellipse cx="120" cy="200" rx="98" ry="40" />
          <ellipse cx="120" cy="196" rx="98" ry="40" fill={intFill} opacity="0.55" />
          <ellipse cx="120" cy="196" rx={`${72 + d.rim}`} ry={`${29 + d.rim / 3}`} fill="none" stroke="rgba(255,244,216,0.4)" strokeWidth="1.4" />
          <ellipse cx="120" cy="196" rx={`${44 - d.rim}`} ry={`${18 - d.rim / 3}`} fill="none" stroke="rgba(20,17,11,0.18)" strokeWidth="1" />
        </>
      );
    case "lamp":
      return (
        <>
          <path d="M108,244 h24 v-6 h-24 Z" />
          <path d="M112,238 q-2,-40 8,-86 q10,46 8,86 Z" />
          <path d={`M${74 - d.spread},150 l16,-58 q30,-9 60,0 l16,58 Z`} />
          <path d={`M${74 - d.spread},150 h${92 + d.spread * 2} v6 h-${92 + d.spread * 2} Z`} />
        </>
      );
    case "box":
      return (
        <>
          <path d="M62,150 q0,-8 8,-8 h100 q8,0 8,8 v66 q0,8 -8,8 h-100 q-8,0 -8,-8 Z" />
          <path d="M58,150 q0,-8 8,-8 h108 q8,0 8,8 v8 q0,4 -6,4 h-112 q-6,0 -6,-4 Z" fill={intFill} />
          <rect x={`${112 - d.neck}`} y="126" width={`${16 + d.neck * 2}`} height="14" rx="6" />
        </>
      );
    case "goblet":
      return (
        <>
          <ellipse cx="120" cy="240" rx={`${26 + d.rim}`} ry="7" />
          <path d="M116,168 h8 v66 h-8 Z" />
          <path d={`M${86 - d.spread},96 q0,46 ${34 + d.spread},66 q${34 + d.spread},-20 ${34 + d.spread},-66 q-${34 + d.spread},12 -${68 + d.spread * 2},0 Z`} />
          <ellipse cx="120" cy="96" rx={`${34 + d.spread}`} ry="9" fill={intFill} stroke="rgba(20,17,11,0.25)" />
        </>
      );
    case "candelabra":
      return (
        <>
          <ellipse cx="120" cy="246" rx="30" ry="7" />
          <path d="M116,150 h8 v92 h-8 Z" />
          <path d={`M120,158 q-${44 + d.handle},-6 -52,-44`} fill="none" stroke={`url(#${uid}-body)`} strokeWidth="7" strokeLinecap="round" />
          <path d={`M120,158 q${44 + d.handle},-6 52,-44`} fill="none" stroke={`url(#${uid}-body)`} strokeWidth="7" strokeLinecap="round" />
          <path d="M120,168 q-24,-6 -28,-40" fill="none" stroke={`url(#${uid}-body)`} strokeWidth="7" strokeLinecap="round" />
          <path d="M120,168 q24,-6 28,-40" fill="none" stroke={`url(#${uid}-body)`} strokeWidth="7" strokeLinecap="round" />
          {[
            [68, 110],
            [92, 124],
            [120, 132],
            [148, 124],
            [172, 110],
          ].map(([x, y], i) => (
            <g key={i}>
              <rect x={x - 9} y={y - 4} width="18" height="12" rx="3" />
              <ellipse cx={x} cy={y - 4} rx="9" ry="3" fill={intFill} />
            </g>
          ))}
        </>
      );
    case "tray":
      return (
        <>
          <ellipse cx="120" cy="206" rx="104" ry="46" />
          <ellipse cx="120" cy="200" rx="104" ry="46" fill={intFill} opacity="0.5" />
          <ellipse cx="120" cy="200" rx={`${92 + d.rim}`} ry={`${39 + d.rim / 3}`} fill="none" stroke="rgba(255,244,216,0.4)" strokeWidth="1.4" />
        </>
      );
    default:
      return <ellipse cx="120" cy="160" rx="70" ry="70" />;
  }
}
