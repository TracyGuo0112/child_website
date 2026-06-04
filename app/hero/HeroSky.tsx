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

export function HeroSky() {
  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* blob sits directly under the nav's 接入说明 item (centerX ≈ 69%), behind
          the copy. resolution 72 overrides HeroBlob's perf default of 44 so the
          close-up surface stays glassy-smooth; the material override deepens
          transmission + iridescence for the dewy candy look of the reference. */}
      <div className="pointer-events-none absolute left-[69.4%] top-[48%] hidden h-[84%] w-[52%] -translate-x-1/2 -translate-y-1/2 lg:block">
        <HeroBlob
          cameraZ={2.3}
          className="absolute inset-0"
          blobs={[{
            shape: "cloud",
            theme: "candy",
            scale: 1.1,
            resolution: 72,
            material: { roughness: 0.18, transmission: 0.24, iridescence: 0.55, iridescenceIOR: 1.35, thickness: 0.65, clearcoat: 0.7, clearcoatRoughness: 0.25, envMapIntensity: 1.2 },
            motion: {},
          }]}
        />
      </div>

      {/* copy */}
      <div className="relative z-10 flex min-h-screen flex-col justify-center pl-[8%] pr-6">
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
            <SolidBtn>
              <span className="inline-flex items-center">查看接入说明<span className="ml-5">→</span></span>
            </SolidBtn>
          </Link>
          <Link href="/process">
            <SolidBtn bg="#FFFFFFcc" fg={ink[900]}>
              <span className="inline-flex items-center">了解合作流程<span className="ml-5">→</span></span>
            </SolidBtn>
          </Link>
        </div>
      </div>
    </section>
  );
}
