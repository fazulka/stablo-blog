/**
 * Decorative SVG separators and accents — woven between sections to give
 * the site its hand-made, creative feel.
 *
 * Use:
 *   <WaveDivider color="rose" />               between two sections
 *   <ScallopDivider flip color="azure" />      flipped scalloped edge
 *   <Squiggle className="text-rose w-20" />    inline tiny accent
 *   <Blob className="text-azure-light w-72" /> background organic shape
 */

const fillByColor = {
  rose: "#E8809E",
  "rose-light": "#FCE6EC",
  "rose-soft": "#F4B5C6",
  azure: "#7BA0C4",
  "azure-light": "#DEEAF5",
  "azure-soft": "#A8C0D9",
  paper: "#FAF6F0",
  ink: "#241F35"
};

function resolveColor(color) {
  return fillByColor[color] || color || "#FAF6F0";
}

// ── Wave: full-width smooth sinusoidal divider ───────────────────────────
export function WaveDivider({
  color = "rose-light",
  height = 80,
  flip = false,
  className = ""
}) {
  const fill = resolveColor(color);
  return (
    <div
      className={`pointer-events-none w-full ${className}`}
      aria-hidden="true"
      style={{ height, transform: flip ? "scaleY(-1)" : undefined }}>
      <svg
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        className="block h-full w-full">
        <path
          d="M0,40 C160,80 320,0 480,30 C640,60 800,10 960,30 C1120,50 1280,80 1440,40 L1440,80 L0,80 Z"
          fill={fill}
        />
      </svg>
    </div>
  );
}

// ── Scallop: scalloped (half-circle bumps) divider ───────────────────────
export function ScallopDivider({
  color = "rose-light",
  height = 40,
  flip = false,
  className = ""
}) {
  const fill = resolveColor(color);
  return (
    <div
      className={`pointer-events-none w-full ${className}`}
      aria-hidden="true"
      style={{ height, transform: flip ? "scaleY(-1)" : undefined }}>
      <svg
        viewBox="0 0 1440 40"
        preserveAspectRatio="none"
        className="block h-full w-full">
        <path
          d="M0,40 L0,20 Q60,0 120,20 T240,20 T360,20 T480,20 T600,20 T720,20 T840,20 T960,20 T1080,20 T1200,20 T1320,20 T1440,20 L1440,40 Z"
          fill={fill}
        />
      </svg>
    </div>
  );
}

// ── Twirl: hand-drawn-style decorative divider with curls and dots ───────
export function TwirlDivider({
  color = "rose",
  width = 220,
  className = ""
}) {
  const stroke = resolveColor(color);
  return (
    <div
      className={`flex justify-center ${className}`}
      aria-hidden="true">
      <svg
        viewBox="0 0 220 30"
        width={width}
        height={(width * 30) / 220}
        fill="none"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round">
        <path d="M5,15 Q25,5 45,15 T85,15 T125,15 T165,15 T205,15" />
        <circle cx="110" cy="15" r="2.2" fill={stroke} stroke="none" />
        <path d="M205,15 q3,-3 6,0 q-3,3 -6,0 z" fill={stroke} />
        <path d="M5,15 q-3,-3 -6,0 q3,3 6,0 z" fill={stroke} />
      </svg>
    </div>
  );
}

// ── Squiggle: small hand-drawn zigzag accent (inline) ────────────────────
export function Squiggle({ className = "text-rose w-20" }) {
  return (
    <svg
      viewBox="0 0 80 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      className={className}
      aria-hidden="true">
      <path d="M3,7 Q12,1 21,7 T39,7 T57,7 T75,7" />
    </svg>
  );
}

// ── Blob: organic background shape (decorative) ──────────────────────────
export function Blob({ className = "text-rose-light w-72 h-72" }) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      fill="currentColor"
      aria-hidden="true">
      <path d="M48.4,-58.3 C61.2,-46.2 69,-29.1 71.8,-11 C74.6,7.1 72.4,26.1 62.4,38.6 C52.4,51.1 34.7,57.1 17.3,62.5 C-0.1,67.8 -17.2,72.5 -32.5,68 C-47.7,63.5 -61.1,49.8 -67.2,33.6 C-73.3,17.4 -72.2,-1.4 -66.7,-18.1 C-61.2,-34.8 -51.3,-49.5 -38,-60.3 C-24.6,-71.1 -7.8,-78.1 4.9,-83.6 C17.6,-89.1 35.7,-70.4 48.4,-58.3 Z" transform="translate(100 100)" />
    </svg>
  );
}

// ── Star: tiny 4-point sparkle for accents ───────────────────────────────
export function Sparkle({ className = "text-rose w-5 h-5", style }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      style={style}
      aria-hidden="true">
      <path d="M12 2 L13.5 10.5 L22 12 L13.5 13.5 L12 22 L10.5 13.5 L2 12 L10.5 10.5 Z" />
    </svg>
  );
}

// ── Heart: tiny doodle heart for accents ─────────────────────────────────
export function Heart({ className = "text-rose w-5 h-5", style }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      style={style}
      aria-hidden="true">
      <path d="M12 21s-7-4.5-9.5-9C.7 8.5 2 4 6 4c2 0 3.5 1 6 3.5C14.5 5 16 4 18 4c4 0 5.3 4.5 3.5 8-2.5 4.5-9.5 9-9.5 9z" />
    </svg>
  );
}

// ── DoodleField: scattered floating sparkles + hearts across a section ───
//
// Drop inside a `relative overflow-hidden` parent. Positions are fixed
// (not random) so SSR markup matches client. Each doodle has its own
// size, color, animation, and stagger delay for an organic feel.
//
// `variant` picks a preset constellation:
//   "default" — 10 doodles, balanced rose/azure
//   "rose"    — 8 doodles, pink-leaning
//   "azure"   — 8 doodles, blue-leaning
//   "dense"   — 16 doodles, edges of section
//
const DOODLE_PRESETS = {
  default: [
    { I: "S", t: "6%",  l: "4%",   s: "w-4 h-4",  c: "text-rose-soft/60",  a: "animate-float",  d: "0s"   },
    { I: "H", t: "12%", l: "92%",  s: "w-3 h-3",  c: "text-azure-soft/70", a: "animate-wiggle", d: "0.4s" },
    { I: "S", t: "24%", l: "10%",  s: "w-5 h-5",  c: "text-rose/40",       a: "animate-wiggle", d: "1.1s" },
    { I: "S", t: "34%", l: "94%",  s: "w-3.5 h-3.5", c: "text-azure/50",   a: "animate-float",  d: "0.8s" },
    { I: "H", t: "48%", l: "6%",   s: "w-3 h-3",  c: "text-rose-soft/50",  a: "animate-float",  d: "1.6s" },
    { I: "S", t: "58%", l: "90%",  s: "w-4 h-4",  c: "text-rose/40",       a: "animate-wiggle", d: "2.1s" },
    { I: "H", t: "72%", l: "14%",  s: "w-4 h-4",  c: "text-azure-soft/60", a: "animate-wiggle", d: "0.6s" },
    { I: "S", t: "82%", l: "88%",  s: "w-3 h-3",  c: "text-rose-soft/60",  a: "animate-float",  d: "1.3s" },
    { I: "H", t: "90%", l: "30%",  s: "w-3 h-3",  c: "text-azure/40",      a: "animate-float",  d: "2.4s" },
    { I: "S", t: "16%", l: "60%",  s: "w-3 h-3",  c: "text-rose-soft/40",  a: "animate-wiggle", d: "1.9s" }
  ],
  rose: [
    { I: "S", t: "8%",  l: "5%",   s: "w-4 h-4",  c: "text-rose-soft/60", a: "animate-float",  d: "0s"   },
    { I: "H", t: "20%", l: "90%",  s: "w-3 h-3",  c: "text-rose/40",      a: "animate-wiggle", d: "0.5s" },
    { I: "S", t: "36%", l: "12%",  s: "w-5 h-5",  c: "text-rose/40",      a: "animate-wiggle", d: "1.2s" },
    { I: "H", t: "50%", l: "85%",  s: "w-3.5 h-3.5", c: "text-rose-soft/60", a: "animate-float", d: "1.8s" },
    { I: "S", t: "66%", l: "8%",   s: "w-3 h-3",  c: "text-rose-soft/70", a: "animate-float",  d: "2.2s" },
    { I: "H", t: "78%", l: "92%",  s: "w-4 h-4",  c: "text-rose/40",      a: "animate-wiggle", d: "0.9s" },
    { I: "S", t: "88%", l: "20%",  s: "w-3 h-3",  c: "text-rose-soft/50", a: "animate-float",  d: "1.5s" },
    { I: "H", t: "14%", l: "55%",  s: "w-3 h-3",  c: "text-rose-soft/40", a: "animate-wiggle", d: "2.5s" }
  ],
  azure: [
    { I: "S", t: "10%", l: "6%",   s: "w-4 h-4",  c: "text-azure-soft/60", a: "animate-float",  d: "0s"   },
    { I: "H", t: "22%", l: "88%",  s: "w-3 h-3",  c: "text-azure/40",      a: "animate-wiggle", d: "0.6s" },
    { I: "S", t: "38%", l: "14%",  s: "w-5 h-5",  c: "text-azure/40",      a: "animate-wiggle", d: "1.3s" },
    { I: "H", t: "52%", l: "84%",  s: "w-3.5 h-3.5", c: "text-azure-soft/70", a: "animate-float", d: "1.7s" },
    { I: "S", t: "68%", l: "10%",  s: "w-3 h-3",  c: "text-azure-soft/60", a: "animate-float",  d: "2.3s" },
    { I: "H", t: "80%", l: "90%",  s: "w-4 h-4",  c: "text-azure/40",      a: "animate-wiggle", d: "1s"   },
    { I: "S", t: "90%", l: "22%",  s: "w-3 h-3",  c: "text-azure-soft/50", a: "animate-float",  d: "1.4s" },
    { I: "H", t: "16%", l: "58%",  s: "w-3 h-3",  c: "text-azure-soft/40", a: "animate-wiggle", d: "2.6s" }
  ],
  dense: [
    { I: "S", t: "4%",  l: "3%",   s: "w-4 h-4",  c: "text-rose-soft/60",  a: "animate-float",  d: "0s"   },
    { I: "H", t: "8%",  l: "48%",  s: "w-3 h-3",  c: "text-azure-soft/50", a: "animate-wiggle", d: "0.3s" },
    { I: "S", t: "10%", l: "94%",  s: "w-5 h-5",  c: "text-azure/40",      a: "animate-wiggle", d: "0.7s" },
    { I: "H", t: "22%", l: "20%",  s: "w-3 h-3",  c: "text-rose/40",       a: "animate-float",  d: "1.1s" },
    { I: "S", t: "26%", l: "72%",  s: "w-3.5 h-3.5", c: "text-rose-soft/50", a: "animate-float", d: "1.5s" },
    { I: "H", t: "40%", l: "5%",   s: "w-4 h-4",  c: "text-azure-soft/60", a: "animate-wiggle", d: "1.9s" },
    { I: "S", t: "44%", l: "92%",  s: "w-3 h-3",  c: "text-rose/40",       a: "animate-wiggle", d: "0.5s" },
    { I: "H", t: "55%", l: "40%",  s: "w-3 h-3",  c: "text-rose-soft/60",  a: "animate-float",  d: "2.2s" },
    { I: "S", t: "60%", l: "80%",  s: "w-4 h-4",  c: "text-azure/40",      a: "animate-float",  d: "1.3s" },
    { I: "H", t: "70%", l: "12%",  s: "w-3.5 h-3.5", c: "text-rose/40",   a: "animate-wiggle", d: "0.8s" },
    { I: "S", t: "76%", l: "60%",  s: "w-3 h-3",  c: "text-azure-soft/50", a: "animate-wiggle", d: "2.6s" },
    { I: "H", t: "82%", l: "94%",  s: "w-4 h-4",  c: "text-rose-soft/50",  a: "animate-float",  d: "1.7s" },
    { I: "S", t: "88%", l: "28%",  s: "w-3 h-3",  c: "text-azure/40",      a: "animate-float",  d: "2.1s" },
    { I: "H", t: "94%", l: "70%",  s: "w-3 h-3",  c: "text-rose/40",       a: "animate-wiggle", d: "0.4s" },
    { I: "S", t: "32%", l: "32%",  s: "w-3 h-3",  c: "text-rose-soft/40",  a: "animate-float",  d: "2.4s" },
    { I: "H", t: "62%", l: "55%",  s: "w-3 h-3",  c: "text-azure-soft/40", a: "animate-wiggle", d: "1s"   }
  ]
};

export function DoodleField({ variant = "default" }) {
  const doodles = DOODLE_PRESETS[variant] || DOODLE_PRESETS.default;
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true">
      {doodles.map((d, i) => {
        const Icon = d.I === "H" ? Heart : Sparkle;
        return (
          <Icon
            key={i}
            className={`absolute ${d.s} ${d.c} ${d.a}`}
            style={{ top: d.t, left: d.l, animationDelay: d.d }}
          />
        );
      })}
    </div>
  );
}
