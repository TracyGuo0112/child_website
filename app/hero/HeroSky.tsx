import { ink } from "@/components/palette";
import HeroBlob from "@/components/hero-blob/HeroBlob";
import { SolidBtn } from "@/components/site";

// The live hero: a full-bleed sky scene. A big serif headline sits left with the
// candy blob under the nav's right half (blob behind the copy). Reuses HeroBlob
// (visibility-gated) and SolidBtn; only this layout is hero-specific. Tuned for the
// 1440-wide desktop comp.

// Split at the two sentence commas so the subcopy reads as three balanced lines.
const SUBCOPY = [
  "为 AI 玩具、故事机、教育机器人等儿童终端，",
  "提供标准化内容接入、账号权益与持续运营能力，",
  "帮助设备快速上线可用、可管、可持续的儿童内容服务。",
];

// Soft, photographic rainbow ribbons — refracted-light bands rather than hard
// ROYGBIV arcs. One sweeps over the blob's top-right, one along the subtitle's
// bottom-left. Heavy blur + low opacity keep them dewy; rendered before the blob
// so the blob occludes the upper band. viewBox tracks the 1440-wide desktop comp.

// One curve per ribbon, drawn three times (wide faint halo → mid wash → crisp
// core) so the stack reads as a layered refracted band rather than a flat stripe.
const RIBBONS = [
  { gradient: "rb-tr", d: "M 880 0 Q 1260 150 1520 470" },
  { gradient: "rb-bl", d: "M -100 540 Q 220 880 860 960" },
];
// strokes[i] = [strokeWidth, opacity] for RIBBONS[i] at that blur level.
const RIBBON_LAYERS = [
  { blur: 30, strokes: [[150, 0.34], [160, 0.34]] },
  { blur: 16, strokes: [[74, 0.42], [80, 0.42]] },
  { blur: 7, strokes: [[26, 0.5], [28, 0.48]] },
];

function RainbowRibbons() {
  return (
    // hidden below lg alongside the blob — without it a headless ribbon stub
    // floats in the corner on phones and reads as a rendering glitch
    <svg
      className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block"
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <defs>
        {/* full-spectrum sweeps — more stops than a 3-colour ramp so the bands
            (violet→blue→cyan→green→yellow→orange→pink) read distinctly */}
        <linearGradient id="rb-tr" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#b76bf0" />
          <stop offset="16%" stopColor="#7f9cff" />
          <stop offset="32%" stopColor="#5fd0e0" />
          <stop offset="48%" stopColor="#8fe09a" />
          <stop offset="62%" stopColor="#ffd76b" />
          <stop offset="78%" stopColor="#ff9a4d" />
          <stop offset="90%" stopColor="#ff7eb3" />
          <stop offset="100%" stopColor="#c77dff" />
        </linearGradient>
        <linearGradient id="rb-bl" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8fe0c0" />
          <stop offset="16%" stopColor="#8fd4ff" />
          {/* purple band toned 40% down per request — sky shows through more here */}
          <stop offset="34%" stopColor="#9f8cff" stopOpacity="0.6" />
          <stop offset="52%" stopColor="#c77dff" stopOpacity="0.6" />
          <stop offset="68%" stopColor="#ff8ac0" />
          <stop offset="84%" stopColor="#ffb07a" />
          <stop offset="100%" stopColor="#ffd76b" />
        </linearGradient>
      </defs>
      {RIBBON_LAYERS.map(({ blur, strokes }) => (
        <g key={blur} style={{ filter: `blur(${blur}px)` }}>
          {RIBBONS.map((r, i) => (
            <path
              key={r.gradient}
              d={r.d}
              fill="none"
              stroke={`url(#${r.gradient})`}
              strokeWidth={strokes[i][0]}
              strokeLinecap="round"
              opacity={strokes[i][1]}
            />
          ))}
        </g>
      ))}
    </svg>
  );
}

export function HeroSky() {
  return (
    // -mt/pt must cover the full nav band (NavBar outer pt + pill height) so the
    // hero scene reaches the viewport top with no seam — keep in sync with
    // NavBar's pt and the inner min-h calc below.
    <section id="hero" className="relative -mt-[6.25rem] min-h-[100svh] overflow-hidden pt-[6.25rem]">
      {/* refracted rainbow light, behind the blob (top-right) and subtitle (bottom-left) */}
      <RainbowRibbons />

      <div className="pointer-events-none absolute inset-y-0 left-0 w-[64%] bg-gradient-to-r from-white/45 via-white/20 to-transparent" />

      {/* blob sits under the right half of the nav (centerX ≈ 69%), behind
          the copy. resolution 60 overrides HeroBlob's perf default of 44 so the
          close-up surface stays glassy-smooth — marching cubes is O(res³)/frame
          on the CPU, and 72 cost ~70% more than 60 for no visible difference;
          the material override deepens transmission + iridescence for the dewy
          candy look of the reference. */}
      <div className="pointer-events-none absolute left-[72%] top-[50%] hidden h-[76%] w-[46%] -translate-x-1/2 -translate-y-1/2 lg:block">
        <HeroBlob
          cameraZ={2.3}
          className="absolute inset-0"
          blobs={[{
            shape: "star",
            theme: "candyHarmony",
            scale: 0.88,
            resolution: 60,
            material: { roughness: 0.18, transmission: 0.24, iridescence: 0.55, iridescenceIOR: 1.35, thickness: 0.65, clearcoat: 0.7, clearcoatRoughness: 0.25, envMapIntensity: 1.2 },
            // slow self-spin + gentle radial throb: a turning, twinkling candy star.
            // The core sits at field center, so it stays put while the arms orbit/pulse.
            // spin halved (0.25 -> 0.14 rad/s, ~45s/turn) for a calmer, more languid rotation.
            motion: { spin: 0.14, breathe: 0.09, bob: 0.02, wobble: 0, drift: 0.02 },
          }]}
        />
      </div>

      {/* copy — hero owns the first viewport, with the next section starting below it */}
      <div className="relative z-10 mx-auto grid min-h-[calc(100svh-6rem)] max-w-6xl items-center px-6 py-10 sm:px-8 sm:py-14 lg:min-h-[calc(100svh-6.25rem)] lg:grid-cols-[0.98fr_1.02fr] lg:px-10 lg:py-10">
        <div className="max-w-2xl">
          <h1
            className="font-bold text-[2.45rem] leading-tight sm:text-[3.1rem] xl:text-[3.55rem]"
            // line-height set inline: Tailwind's text-Nxl utilities ship their own
            // line-height, which can override leading-* classes.
            style={{ color: ink[900], fontFamily: "var(--font-noto-serif-sc)", letterSpacing: 0, lineHeight: 1.14 }}
          >
            <span className="block sm:whitespace-nowrap">把喜马拉雅内容，</span>
            <span className="block sm:whitespace-nowrap">
              带进每一台
              <span className="block sm:inline">儿童终端</span>
            </span>
          </h1>

          {/* the three hand-balanced line breaks only hold above sm — on phones the
              lines re-wrap anyway and forcing them produces ragged 6-line copy */}
          <p className="mt-7 max-w-lg text-[15px] leading-7 sm:whitespace-pre-line" style={{ color: ink[700] }}>
            {SUBCOPY.join("\n")}
          </p>

          <div className="mt-9 flex items-center gap-3">
            <SolidBtn href="/faq" size="lg">了解高频问题</SolidBtn>
          </div>
        </div>
      </div>
    </section>
  );
}
