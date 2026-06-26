import { ink, pastels } from "@/components/palette";
import { cardSurface } from "@/components/site";
import { Section } from "@/components/site/Section";

// 方案价值主张 + 适用设备边界，取自《接入方案（对外版）》一、方案概述。
const VALUES = [
  {
    title: "家长端管理",
    desc: "家长在厂商 App / 小程序内管理账号、领取会员、浏览内容、投射播放。",
    c: pastels.sky,
  },
  {
    title: "玩具端点播",
    desc: "玩具设备通过语音交互直接点播喜马拉雅正版儿童内容。",
    c: pastels.sage,
  },
];

const FIT = ["AI 故事机 / 音箱", "儿童 AI 机器人", "儿童 AI 玩偶", "儿童 AI 耳机（语音交互型）"];
const UNFIT = ["儿童平板 / 学习机", "儿童手表（触屏类）"];

export function OverviewSection() {
  return (
    <Section
      id="overview"
      title="面向 AI 玩具厂商开放内容能力"
      lead="喜马拉雅儿童内容生态面向 AI 玩具厂商开放内容能力。本方案用于评估接入价值与技术成本；完整接口文档、SDK 集成手册及加密对接规范，将在签署合作协议后提供。"
    >
      <div className="grid gap-6 sm:grid-cols-2">
        {VALUES.map((v) => (
          <div key={v.title} className="rounded-2xl p-7" style={cardSurface}>
            <span
              className="inline-block rounded-full px-3 py-1 text-xs font-semibold"
              style={{ background: v.c.tint, color: v.c.deep }}
            >
              {v.title}
            </span>
            <p className="mt-4 text-sm leading-relaxed" style={{ color: ink[700] }}>{v.desc}</p>
          </div>
        ))}
      </div>

      <h3 className="mt-14 text-xl font-semibold tracking-tight" style={{ color: ink[900] }}>
        适用设备类型
      </h3>
      <p className="mt-2 text-sm" style={{ color: ink[500] }}>* SDK 支持各类芯片平台，不依赖芯片底层架构</p>
      <div className="mt-5 grid gap-6 sm:grid-cols-2">
        <div className="rounded-2xl p-7" style={cardSurface}>
          <div className="text-sm font-semibold" style={{ color: pastels.sage.deep }}>✓ 适用</div>
          <ul className="mt-4 space-y-2.5">
            {FIT.map((d) => (
              <li key={d} className="flex gap-2 text-sm" style={{ color: ink[700] }}>
                <span aria-hidden style={{ color: pastels.sage.mid }}>·</span>{d}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl p-7" style={cardSurface}>
          <div className="text-sm font-semibold" style={{ color: ink[500] }}>✕ 不适用</div>
          <ul className="mt-4 space-y-2.5">
            {UNFIT.map((d) => (
              <li key={d} className="flex gap-2 text-sm" style={{ color: ink[500] }}>
                <span aria-hidden>·</span>{d}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
