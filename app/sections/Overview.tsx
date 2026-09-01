import { ink, pastels } from "@/components/palette";
import { cardSurface } from "@/components/site";
import { Section } from "@/components/site/Section";
import { OverviewToc } from "./OverviewToc";
import { OVERVIEW_NAV } from "./overview-nav";

const VALUES = [
  {
    title: "玩具端点播",
    desc: "玩具设备通过语音交互直接点播喜马拉雅正版儿童内容。",
    c: pastels.sage,
  },
  {
    title: "家长端管理",
    desc: "家长在厂商 App / 小程序内管理账号、领取会员、浏览内容、投射播放。",
    c: pastels.sky,
  },
];

const FIT = ["AI 故事机 / 音箱", "儿童 AI 机器人", "儿童 AI 玩偶", "儿童 AI 耳机（语音交互型）"];
const UNFIT = ["儿童平板 / 学习机", "儿童手表（触屏类）"];

const RESOURCE_REQUIREMENTS = [
  { name: "ROM（code 分区）", content: "80KB", agent: "50KB", combined: "110KB" },
  { name: "RAM（运行）", content: "70KB", agent: "40KB", combined: "100KB" },
  {
    name: "需支持基础能力",
    content: "MP3 流播放 / HTTP / pthread",
    agent: "MP3 流播放 / websocket / HTTP / pthread",
    combined: "MP3 流播放 / websocket / HTTP / pthread",
  },
];

export function OverviewSection() {
  return (
    <Section
      id="overview"
      title={
        <>
          <span className="block">面向 AI 玩具厂商</span>
          <span className="mt-1 block">开放内容能力</span>
        </>
      }
      lead="喜马拉雅儿童内容生态面向 AI 玩具厂商开放内容能力。本方案用于评估接入价值与技术成本；完整接口文档、SDK 集成手册及加密对接规范，将在签署合作协议后提供。"
    >
      <div className="lg:grid lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-12">
        <OverviewToc />
        <div className="mt-10 lg:mt-0">
          <section id={OVERVIEW_NAV[0].id} className="scroll-mt-32">
            <h3 className="text-xl font-semibold" style={{ color: ink[900] }}>
              适用设备类型
            </h3>
            <p className="mt-2 text-sm" style={{ color: ink[500] }}>* SDK 支持各类芯片平台，不依赖芯片底层架构</p>
            <div className="mt-5 grid gap-6 sm:grid-cols-2">
              <div className="rounded-lg p-7" style={cardSurface}>
                <div className="text-sm font-semibold" style={{ color: pastels.sage.deep }}>✓ 适用设备</div>
                <ul className="mt-4 space-y-2.5">
                  {FIT.map((d) => (
                    <li key={d} className="flex gap-2 text-sm" style={{ color: ink[700] }}>
                      <span aria-hidden style={{ color: pastels.sage.mid }}>·</span>{d}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-lg p-7" style={cardSurface}>
                <div className="text-sm font-semibold" style={{ color: ink[500] }}>✕ 不适用设备</div>
                <ul className="mt-4 space-y-2.5">
                  {UNFIT.map((d) => (
                    <li key={d} className="flex gap-2 text-sm" style={{ color: ink[500] }}>
                      <span aria-hidden>·</span>{d}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section id={OVERVIEW_NAV[1].id} className="mt-14 scroll-mt-32">
            <h3 className="text-xl font-semibold" style={{ color: ink[900] }}>
              核心产品能力
            </h3>
            <div className="mt-5 grid gap-6 sm:grid-cols-2">
              {VALUES.map((v) => (
                <div key={v.title} className="rounded-lg p-7" style={cardSurface}>
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
          </section>

          <section id={OVERVIEW_NAV[2].id} className="mt-14 scroll-mt-32">
            <h3 className="text-xl font-semibold" style={{ color: ink[900] }}>
              设备资源需求
            </h3>
            <p className="mt-2 text-sm leading-relaxed" style={{ color: ink[500] }}>
              嵌入式设备接入 SDK 可按需定制功能，不同功能组合对应的资源与基础能力要求如下（不含本地 UI 图片资源）。
            </p>
            <div className="mt-5 overflow-hidden rounded-lg" style={cardSurface}>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[680px] border-collapse text-left text-sm">
                  <thead style={{ background: pastels.sky.tint }}>
                    <tr>
                      <th className="px-5 py-4 font-semibold" style={{ color: ink[900] }}>资源项</th>
                      <th className="px-5 py-4 font-semibold" style={{ color: ink[900] }}>内容</th>
                      <th className="px-5 py-4 font-semibold" style={{ color: ink[900] }}>AI Agent</th>
                      <th className="px-5 py-4 font-semibold" style={{ color: ink[900] }}>内容 + AI Agent</th>
                    </tr>
                  </thead>
                  <tbody>
                    {RESOURCE_REQUIREMENTS.map((row) => (
                      <tr key={row.name} style={{ borderTop: `1px solid ${ink.line}` }}>
                        <th className="px-5 py-4 font-semibold" style={{ color: ink[900] }}>{row.name}</th>
                        <td className="px-5 py-4 leading-relaxed" style={{ color: ink[700] }}>{row.content}</td>
                        <td className="px-5 py-4 leading-relaxed" style={{ color: ink[700] }}>{row.agent}</td>
                        <td className="px-5 py-4 leading-relaxed" style={{ color: ink[700] }}>{row.combined}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>
      </div>
    </Section>
  );
}
