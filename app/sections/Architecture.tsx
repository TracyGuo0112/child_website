import Image from "next/image";
import { ink, pastels } from "@/components/palette";
import { cardSurface } from "@/components/site";
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
  { module: "家长端页面", xmly: "主内容 H5、会员激活 H5", vendor: "App 内 WebView / 小程序插件嵌入，JS Bridge 标准协议响应" },
  { module: "账号与鉴权", xmly: "喜马账号体系、登录态接口、token 管理 SDK", vendor: "token 在宿主 App 与设备间的传递" },
  { module: "会员权益", xmly: "SN 权益库、解密校验服务、领取 H5", vendor: "设备 SN 加密输出（算法对接时约定）" },
  { module: "内容服务", xmly: "内容检索 / 播放 / 历史 / 权益查询 API（SDK 封装）", vendor: "—" },
  { module: "语音交互", xmly: "—", vendor: "ASR、意图识别等 AI 引擎" },
  { module: "播放状态", xmly: "投射单集：立即播放指定单集；投射专辑：从第一集开始顺序播放", vendor: "播放进度、暂停、续播等状态处理" },
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
            <p className="mt-3 text-xs leading-relaxed" style={{ color: ink[500] }}>载体：{s.carrier}</p>
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
      <div className="mt-5 overflow-hidden rounded-2xl" style={cardSurface}>
        <table className="hidden w-full text-left text-sm sm:table">
          <thead>
            <tr style={{ borderBottom: `1px solid ${ink.line}` }}>
              <th className="px-5 py-3.5 font-semibold" style={{ color: ink[900] }}>模块</th>
              <th className="px-5 py-3.5 font-semibold" style={{ color: pastels.clay.deep }}>喜马拉雅提供</th>
              <th className="px-5 py-3.5 font-semibold" style={{ color: pastels.sky.deep }}>厂商实现</th>
            </tr>
          </thead>
          <tbody>
            {DUTIES.map((d, i) => (
              <tr key={d.module} style={i > 0 ? { borderTop: `1px solid ${ink.line}` } : undefined}>
                <td className="px-5 py-3.5 align-top font-medium" style={{ color: ink[900] }}>{d.module}</td>
                <td className="px-5 py-3.5 align-top leading-relaxed" style={{ color: ink[700] }}>{d.xmly}</td>
                <td className="px-5 py-3.5 align-top leading-relaxed" style={{ color: ink[700] }}>{d.vendor}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="divide-y sm:hidden" style={{ borderColor: ink.line }}>
          {DUTIES.map((d) => (
            <div key={d.module} className="p-5">
              <div className="text-sm font-semibold" style={{ color: ink[900] }}>{d.module}</div>
              <div className="mt-2 text-xs leading-relaxed" style={{ color: ink[700] }}>
                <span className="font-medium" style={{ color: pastels.clay.deep }}>喜马：</span>{d.xmly}
              </div>
              <div className="mt-1.5 text-xs leading-relaxed" style={{ color: ink[700] }}>
                <span className="font-medium" style={{ color: pastels.sky.deep }}>厂商：</span>{d.vendor}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
