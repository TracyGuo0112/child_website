import Link from "next/link";
import { ink } from "@/components/palette";
import HeroBlob from "@/components/hero-blob/HeroBlob";
import { SolidBtn } from "@/components/site";

// The live hero: a full-bleed sky scene. A big serif headline sits left with the
// candy blob under the nav's 接入说明 item (blob behind the copy). Reuses HeroBlob
// (visibility-gated) and SolidBtn; only this layout is hero-specific. Tuned for the
// 1440-wide desktop comp.

const SUBCOPY =
  "为 AI 玩具、故事机、教育机器人等儿童终端，提供标准化内容接入、账号权益与持续运营能力，帮助设备快速上线可用、可管、可持续的儿童内容服务。";

// Soft, photographic rainbow ribbons — refracted-light bands rather than hard
// ROYGBIV arcs. One sweeps over the blob's top-right, one along the subtitle's
// bottom-left. Heavy blur + low opacity keep them dewy; rendered before the blob
// so the blob occludes the upper band. viewBox tracks the 1440-wide desktop comp.
function RainbowRibbons() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
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
      {/* three nested layers per ribbon — wide faint halo, mid wash, crisp core —
          stack into a layered refracted band rather than a flat stripe */}
      <g style={{ filter: "blur(30px)" }}>
        <path d="M 880 0 Q 1260 150 1520 470" fill="none" stroke="url(#rb-tr)" strokeWidth="150" strokeLinecap="round" opacity="0.34" />
        <path d="M -100 540 Q 220 880 860 960" fill="none" stroke="url(#rb-bl)" strokeWidth="160" strokeLinecap="round" opacity="0.34" />
      </g>
      <g style={{ filter: "blur(16px)" }}>
        <path d="M 880 0 Q 1260 150 1520 470" fill="none" stroke="url(#rb-tr)" strokeWidth="74" strokeLinecap="round" opacity="0.42" />
        <path d="M -100 540 Q 220 880 860 960" fill="none" stroke="url(#rb-bl)" strokeWidth="80" strokeLinecap="round" opacity="0.42" />
      </g>
      <g style={{ filter: "blur(7px)" }}>
        <path d="M 880 0 Q 1260 150 1520 470" fill="none" stroke="url(#rb-tr)" strokeWidth="26" strokeLinecap="round" opacity="0.5" />
        <path d="M -100 540 Q 220 880 860 960" fill="none" stroke="url(#rb-bl)" strokeWidth="28" strokeLinecap="round" opacity="0.48" />
      </g>
    </svg>
  );
}

export function HeroSky() {
  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* refracted rainbow light, behind the blob (top-right) and subtitle (bottom-left) */}
      <RainbowRibbons />

      {/* blob sits directly under the nav's 接入说明 item (centerX ≈ 69%), behind
          the copy. resolution 72 overrides HeroBlob's perf default of 44 so the
          close-up surface stays glassy-smooth; the material override deepens
          transmission + iridescence for the dewy candy look of the reference. */}
      <div className="pointer-events-none absolute left-[69.4%] top-[48%] hidden h-[84%] w-[52%] -translate-x-1/2 -translate-y-1/2 lg:block">
        <HeroBlob
          cameraZ={2.3}
          className="absolute inset-0"
          blobs={[{
            shape: "star",
            theme: "candy",
            scale: 1.1,
            resolution: 72,
            material: { roughness: 0.18, transmission: 0.24, iridescence: 0.55, iridescenceIOR: 1.35, thickness: 0.65, clearcoat: 0.7, clearcoatRoughness: 0.25, envMapIntensity: 1.2 },
            // slow self-spin + gentle radial throb: a turning, twinkling candy star.
            // The core sits at field center, so it stays put while the arms orbit/pulse.
            motion: { spin: 0.25, breathe: 0.09, bob: 0.02, wobble: 0, drift: 0.02 },
          }]}
        />
      </div>

      {/* copy — nudged up ~5 line-units from dead-centre for a higher-anchored hero */}
      <div className="relative z-10 flex min-h-screen flex-col justify-center pl-[8%] pr-6 -translate-y-20">
        <h1
          className="font-bold leading-[1.25] text-4xl sm:text-5xl xl:text-6xl"
          style={{ color: ink[900], fontFamily: "var(--font-noto-serif-sc)", letterSpacing: "0.02em" }}
        >
          把喜马拉雅内容，
          <br />
          带进每一台儿童终端
        </h1>

        <p className="mt-7 max-w-md text-sm leading-7" style={{ color: ink[700] }}>
          {SUBCOPY}
        </p>

        <div className="mt-9 flex items-center gap-3">
          <Link href="/integration">
            <SolidBtn>查看接入说明</SolidBtn>
          </Link>
          <Link href="/process">
            <SolidBtn bg="#FFFFFFcc" fg={ink[900]}>了解合作流程</SolidBtn>
          </Link>
        </div>
      </div>
    </section>
  );
}
