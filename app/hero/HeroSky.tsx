import Link from "next/link";
import { ink } from "@/components/palette";
import HeroBlob from "@/components/hero-blob/HeroBlob";
import { SolidBtn } from "@/components/site";

// The live hero: a full-bleed sky scene. A big serif/gothic headline sits left
// with the candy blob floating right (slight overlap, blob behind the copy), and
// playful sky props — stars, a smiley, an orbit ring with sparkles — scatter
// around it. Reuses HeroBlob (visibility-gated + res44) and SolidBtn; only this
// layout is hero-specific. Tuned for the 1440-wide desktop comp.

const SUBCOPY = [
  "一次接入，适配多种 AI 硬件形态",
  "为 AI 玩具、机器人、App、小程序与各类硬件设备",
  "提供高品质儿童内容与交互能力。",
];

// ---- flat sky props (zero-asset inline SVG) ----

function Star({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="#FFFFFF" stroke="#1f2a3322" strokeWidth="1" strokeLinejoin="round" aria-hidden>
      <path d="M12 1.6l3 7.1 7.7.6-5.9 5 1.8 7.5L12 24.8 5.4 21.8l1.8-7.5-5.9-5 7.7-.6z" />
    </svg>
  );
}

function Smiley({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden>
      <circle cx="20" cy="20" r="18" fill="#FFD23F" />
      <circle cx="14.5" cy="17" r="2.2" fill="#3A2B12" />
      <circle cx="25.5" cy="17" r="2.2" fill="#3A2B12" />
      <path d="M13 23.5c2.6 3.8 11.4 3.8 14 0" fill="none" stroke="#3A2B12" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

export function HeroSky() {
  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* blob floating right, behind the copy */}
      <div className="pointer-events-none absolute right-[-8%] top-[50%] hidden h-[94%] w-[60%] -translate-y-1/2 lg:block">
        <HeroBlob
          cameraZ={2.3}
          className="absolute inset-0"
          blobs={[{ shape: "cloud", theme: "candy", scale: 1.25, motion: {} }]}
        />
        {/* tilted orbit ring — wider than the blob so its rim shows against the
            sky on both sides (over the pale blob it would vanish) + sparkles */}
        <div
          className="absolute left-1/2 top-[62%] h-[54%] w-[122%] -translate-x-1/2 rounded-full"
          style={{ border: "1.6px solid #FFFFFF", boxShadow: "0 0 7px #FFFFFF80", transform: "translateX(-50%) rotate(-12deg) scaleY(0.3)" }}
        />
        <span className="absolute bottom-[20%] right-[4%] text-2xl text-white drop-shadow" style={{ textShadow: "0 1px 3px #00000022" }}>✦</span>
        <span className="absolute bottom-[31%] right-[-2%] text-base text-white" style={{ textShadow: "0 1px 3px #00000022" }}>✦</span>
      </div>

      {/* scattered sky props */}
      <Smiley className="absolute left-[64%] top-[15%] h-10 w-10 drop-shadow-sm" />
      <Star className="absolute left-[4.5%] top-[27%] h-7 w-7 drop-shadow-sm" />
      <Star className="absolute right-[3.5%] top-[48%] h-6 w-6 drop-shadow-sm" />

      {/* copy */}
      <div className="relative z-10 flex min-h-screen flex-col justify-center pl-[7%] pr-6 pt-12">
        <h1
          className="font-bold leading-[1.05] tracking-tight text-5xl sm:text-6xl lg:text-8xl xl:text-[6.75rem]"
          style={{ color: ink[900] }}
        >
          儿童内容能力，
          <br />
          接入每一台
          <br />
          <span className="font-serif italic">AI</span>
          <span> 玩具</span>
        </h1>

        <div className="mt-9 space-y-1.5 text-base leading-relaxed lg:text-lg" style={{ color: ink[700] }}>
          <p className="font-semibold" style={{ color: ink[900] }}>{SUBCOPY[0]}</p>
          <p>{SUBCOPY[1]}</p>
          <p>{SUBCOPY[2]}</p>
        </div>

        <div className="mt-10 flex items-center gap-4">
          <Link href="/integration">
            <SolidBtn size="lg">
              <span className="inline-flex items-center">查看接入说明<span className="ml-8">→</span></span>
            </SolidBtn>
          </Link>
          <Link href="/process">
            <SolidBtn size="lg" bg="#FFFFFFcc" fg={ink[900]}>
              <span className="inline-flex items-center">了解合作流程<span className="ml-8">→</span></span>
            </SolidBtn>
          </Link>
        </div>
      </div>
    </section>
  );
}
