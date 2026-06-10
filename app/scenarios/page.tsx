import { ink } from "@/components/palette";
import { PageShell, ACCENT, cardSurface } from "@/components/site";

// 四类设备各一张卡，讲"装进去是什么样"。FORMS 前四项。
const SCENARIOS = [
  { name: "AI 故事机 / 音箱", desc: "TODO: 场景描述" },
  { name: "儿童 AI 机器人", desc: "TODO: 场景描述" },
  { name: "儿童 AI 玩偶", desc: "TODO: 场景描述" },
  { name: "儿童 AI 耳机", desc: "TODO: 场景描述" },
];

export default function ScenariosPage() {
  return (
    <PageShell
      eyebrow="场景方案"
      title="四类设备，一套接入"
      lead="TODO: 概述——不同形态的 AI 玩具如何接入喜马拉雅儿童内容。"
    >
      <div className="grid gap-6 sm:grid-cols-2">
        {SCENARIOS.map((s) => (
          <div
            key={s.name}
            className="rounded-2xl p-8"
            style={cardSurface}
          >
            {/* TODO: 设备图标 */}
            <div className="mb-4 h-10 w-10 rounded-xl" style={{ background: `${ACCENT.tint}` }} />
            <h3 className="text-lg font-semibold" style={{ color: ink[900] }}>{s.name}</h3>
            <p className="mt-2 text-sm leading-relaxed" style={{ color: ink[700] }}>{s.desc}</p>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
