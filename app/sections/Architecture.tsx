import Image from "next/image";
import { ink, pastels } from "@/components/palette";
import { ACCENT, cardSurface } from "@/components/site";
import { Section } from "@/components/site/Section";

// 双子系统速览，取自方案文档「二、整体架构」的子系统表。
const SUBSYSTEMS = [
  {
    name: "家长端",
    carrier: "原生 App → SDK + WebView；微信小程序 → 插件 + H5",
    audience: "家长",
    features: "账号管理、会员激活、内容浏览、内容投射、续费购买",
    c: pastels.sky,
  },
  {
    name: "玩具端",
    carrier: "设备端 SDK",
    audience: "孩子",
    features: "语音意图识别后的内容检索与播放",
    c: pastels.clay,
  },
];

// 双方职责边界，取自方案文档「三、双方职责边界」表。
const DUTIES = [
  { module: "家长端页面", xmly: "主内容 H5、会员激活 H5", vendor: "App 内 WebView / 小程序插件嵌入" },
  { module: "账号与鉴权", xmly: "喜马账号体系、登录态接口、token 管理 SDK", vendor: "token 在宿主 App 与设备间的传递" },
  { module: "会员权益", xmly: "SN 权益库、解密校验服务、领取 H5", vendor: "设备 SN 加密输出（算法对接时约定）" },
  { module: "内容服务", xmly: "内容检索 / 播放 / 历史 / 权益查询 API（SDK 封装）", vendor: "—" },
  { module: "语音交互", xmly: "AI 搜索接入：在语音交互中，若识别到与喜马相关意图，将 ASR 给到喜马进行 AI 搜索，喜马返回专辑和音频数据，厂商再决定是否调用播放", vendor: "ASR、意图识别等 AI 引擎" },
  { module: "播放", xmly: "投射单集：立即播放指定单集；投射专辑：从第一集开始顺序播放", vendor: "播放进度、暂停、续播等状态处理" },
  { module: "运营", xmly: "内容首页编排、活动运营（由喜马统一配置）", vendor: "—" },
];

export function ArchitectureSection() {
  return (
    <Section
      id="architecture"
      title="两个子系统，一套账号体系"
      lead="方案由两个子系统组成，共用同一套喜马拉雅账号体系——家长端登录的账号，即为玩具端播放内容所使用的账号。"
    >
      <div className="grid gap-6 sm:grid-cols-2">
        {SUBSYSTEMS.map((s) => (
          <div key={s.name} className="rounded-2xl p-7" style={cardSurface}>
            <div className="flex items-center gap-3">
              <span
                className="rounded-full px-3 py-1 text-xs font-semibold"
                style={{ background: s.c.tint, color: s.c.deep }}
              >
                {s.name}
              </span>
              <span className="text-xs" style={{ color: ink[500] }}>面向{s.audience}</span>
            </div>
            <p className="mt-4 text-sm leading-relaxed" style={{ color: ink[700] }}>{s.features}</p>
            <p className="mt-3 text-sm font-semibold leading-relaxed" style={{ color: ACCENT.deep }}>载体：{s.carrier}</p>
          </div>
        ))}
      </div>

      {/* 架构总览图（取自方案文档），白卡承托让透明底图在 sky 背景上可读 */}
      <div className="mx-auto mt-10 max-w-2xl rounded-3xl p-6 sm:p-10" style={cardSurface}>
        <Image
          src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/diagrams/architecture.png`}
          alt="整体架构图：用户层（家长 / 儿童）→ 客户端层（家长端 H5 / 玩具端 AI）→ 第三方实现层与喜马拉雅服务端"
          width={1190}
          height={1322}
          className="h-auto w-full"
        />
      </div>

      <h3 className="mt-14 text-xl font-semibold tracking-tight" style={{ color: ink[900] }}>
        双方职责边界
      </h3>
      <p className="mt-2 text-sm" style={{ color: ink[500] }}>* 具体技术细节见技术文档</p>
      {/* 移动端表格塌缩成不可读的窄列 —— 改成响应式：sm 以上三列表格，以下卡片堆叠 */}
      {/* 卡片行布局：模块名做成胶囊、两栏自带标签，一套布局通吃桌面/移动，
          也避免表格自动列宽把窄列挤到换行 */}
      <div className="mt-5 space-y-3">
        {DUTIES.map((d) => (
          <div key={d.module} className="rounded-2xl p-6 sm:flex sm:items-baseline sm:gap-6" style={cardSurface}>
            <div className="shrink-0 sm:w-32">
              <span
                className="inline-block whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold"
                style={{ background: ACCENT.tint, color: ACCENT.deep }}
              >
                {d.module}
              </span>
            </div>
            <div className="mt-4 grid flex-1 gap-4 sm:mt-0 sm:grid-cols-2 sm:gap-8">
              <div>
                <div className="text-xs font-semibold" style={{ color: pastels.clay.deep }}>喜马拉雅提供</div>
                <p className="mt-1.5 text-sm leading-relaxed" style={{ color: d.xmly === "—" ? ink[500] : ink[700] }}>{d.xmly}</p>
              </div>
              <div>
                <div className="text-xs font-semibold" style={{ color: pastels.sky.deep }}>厂商实现</div>
                <p className="mt-1.5 text-sm leading-relaxed" style={{ color: d.vendor === "—" ? ink[500] : ink[700] }}>{d.vendor}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
