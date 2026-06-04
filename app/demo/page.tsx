import { surface, ink } from "@/components/palette";
import { PageShell, ACCENT } from "@/components/site";

// Demo 页是后续「声音爆点」的主场：点试听 → 团子随假波形大幅起伏。
// 本轮只搭占位卡 + 试听按钮外形，不接任何 audio 逻辑。
export default function DemoPage() {
  return (
    <PageShell
      eyebrow="Demo 展示"
      title="听一听，它在唱什么"
      lead="TODO: 概述——演示设备端语音点播版权内容的实际效果。"
    >
      <div
        className="flex flex-col items-center justify-center gap-6 rounded-3xl px-8 py-20 text-center"
        style={{ background: surface.raised, border: `1px solid ${ink.line}` }}
      >
        {/* TODO: 接入声音播放逻辑（后续）—— 点击后团子随假波形起伏 */}
        <button
          className="flex items-center gap-3 rounded-full px-8 py-4 text-base font-semibold transition-transform hover:-translate-y-0.5"
          style={{ background: ACCENT.deep, color: surface.raised }}
        >
          <span>▶</span> 试听
        </button>
        <p className="text-sm" style={{ color: ink[500] }}>TODO: 试听演示（声音 + 团子联动）</p>
      </div>
    </PageShell>
  );
}
