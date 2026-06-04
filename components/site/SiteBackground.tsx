// Site-wide fixed backdrop: a photographic blue sky — rich even blue up top, a
// bright cloud bank welling up from the bottom, thin wisps top-left — plus two
// rainbow ribbons framing opposite corners (the WIX "Year of Love" cue). Pure
// CSS/SVG, zero assets: clouds are fractal-noise (feTurbulence), not images.
// fixed + -z-10 underlays every route without touching NavBar's sticky or any
// page's overflow-hidden.

// Pastel rainbow bands, painted outer→inner: stacking same-path strokes of
// shrinking width reveals each wider color as a rim, reading as parallel bands
// in true rainbow order (warm outer rim → cool inner). Decorative page chrome —
// kept local rather than coupling to the blob THEMES.
const RIBBON = ["#F4A6BC", "#F7C98E", "#F4E79A", "#AEE0B2", "#A8CCF2", "#C6ABE8"];

// One swoosh = the rainbow stroked along a single S-curve at descending widths.
function Ribbon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 200"
      className={className}
      fill="none"
      style={{ filter: "blur(0.6px)" }}
      aria-hidden
    >
      {RIBBON.map((color, i) => (
        <path
          key={color}
          d="M 510 28 C 400 36, 360 96, 230 100 S 60 120, -30 168"
          stroke={color}
          strokeWidth={42 - i * 6}
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
}

// Cloud coverage: where the noise is painted. Bottom bank wells up wide; a soft
// top-left patch adds wisps; the upper-centre sky stays clear blue.
const CLOUD_MASK =
  "radial-gradient(150% 72% at 50% 126%, #000 48%, transparent 82%)," +
  "radial-gradient(60% 46% at 7% 3%, #000 6%, transparent 64%)," +
  "radial-gradient(38% 28% at 90% 44%, #000 0%, transparent 70%)";

export function SiteBackground() {
  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      style={{
        // rich, even sky blue up top easing to a hazy near-white at the horizon
        // where the cloud bank sits.
        background:
          "linear-gradient(177deg, #4E9EE3 0%, #5FAAE7 20%, #7FBDED 44%, #ACD7F3 70%, #DCEFFA 100%)",
      }}
    >
      {/* fractal-noise clouds, masked into a bottom bank + top-left wisps. Two
          octaves' worth of detail read as billows; soft alpha keeps edges hazy. */}
      <svg
        className="absolute inset-0 h-full w-full"
        style={{ WebkitMaskImage: CLOUD_MASK, maskImage: CLOUD_MASK, opacity: 1 }}
        aria-hidden
      >
        <filter id="sky-clouds" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.010 0.013" numOctaves="5" seed="7" stitchTiles="stitch" result="n" />
          {/* paint noise white; steep alpha → bright puffy cores with hazy gaps */}
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 -1.5 1.18" />
        </filter>
        <rect width="100%" height="100%" filter="url(#sky-clouds)" />
      </svg>

      {/* opposite-corner rainbows; bottom-left is the top-right mirrored 180°. */}
      <Ribbon className="absolute right-[-2%] top-[-2%] w-[52vw] max-w-[820px] opacity-95" />
      <Ribbon className="absolute bottom-0 left-0 w-[30vw] max-w-[460px] rotate-180 opacity-85" />
    </div>
  );
}
