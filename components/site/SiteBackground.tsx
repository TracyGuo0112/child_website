// Site-wide fixed backdrop: a photographic blue sky — rich even blue up top, a
// bright cloud bank welling up from the bottom, thin wisps top-left. Pure CSS/SVG,
// zero assets: clouds are fractal-noise (feTurbulence), not images. fixed + -z-10
// underlays every route without touching NavBar's sticky or any page's overflow-hidden.

// Cloud coverage: where the noise is painted. Bottom bank wells up wide; tall
// banks hug the left + right edges so the sides read cloudier; a denser mass
// piles into the bottom-right corner; the upper-centre sky stays clear blue.
const CLOUD_MASK =
  "radial-gradient(150% 72% at 50% 126%, #000 48%, transparent 82%)," +
  "radial-gradient(52% 78% at -4% 36%, #000 14%, transparent 74%)," +
  "radial-gradient(50% 80% at 104% 52%, #000 12%, transparent 74%)," +
  "radial-gradient(62% 58% at 100% 102%, #000 30%, transparent 76%)";

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
          {/* paint noise white; steeper alpha slope sculpts the cloud — solid white
              cores, cleaner blue gaps → ~20% more cloud/sky contrast and visible shape */}
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 -2.4 1.5" />
        </filter>
        <rect width="100%" height="100%" filter="url(#sky-clouds)" />
      </svg>

      {/* uniform white veil — softens the whole sky + clouds by ~20% for an airier,
          paler backdrop without retuning every gradient */}
      <div className="absolute inset-0" style={{ background: "#FFFFFF", opacity: 0.4 }} />
    </div>
  );
}
