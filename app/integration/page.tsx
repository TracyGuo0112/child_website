import { surface, ink, pastels } from "@/components/palette";
import { PageShell, ACCENT } from "@/components/site";

// 双子系统：一套账号体系下分家长端与玩具端，各自载体与职责不同。
const SUBSYSTEMS = [
  {
    key: "parent",
    badge: "家长端",
    carrier: "H5 · WebView 嵌入",
    desc: "喜马提供 H5 页面，厂商通过 WebView 嵌入自家 App。账号管理、会员激活、内容浏览与投射、续费购买都在这里完成。",
    points: ["账号登录与状态", "SN 会员激活", "内容浏览 / 搜索 / 分类", "投射到设备 · 续费"],
    c: pastels.sky,
  },
  {
    key: "toy",
    badge: "玩具端",
    carrier: "SDK · 设备内集成",
    desc: "设备识别到孩子的收听意图后，调用 SDK 检索并播放喜马版权内容。点播、续播、播放历史与家长端同步一套账号。",
    points: ["语音意图后内容检索", "在线流式播放", "断点续播", "播放历史同步"],
    c: pastels.clay,
  },
] as const;

// 接入门槛：厂商判断自家硬件能否承载的硬指标，取自 SDK 资源占用与网络前提。
const THRESHOLDS = [
  { label: "ROM（代码分区）", value: "50 ~ 110 KB", note: "按裁剪程度浮动" },
  { label: "RAM（运存）", value: "40 ~ 100 KB", note: "原子能力 + 业务编排" },
  { label: "基础能力", value: "MP3 流播放", note: "WebSocket · HTTP" },
  { label: "运行模式", value: "纯在线", note: "无离线缓存能力" },
];

// Platform 适配：SDK 把硬件相关接口抽象在 platform 层，需厂商按自家系统实现。
const PLATFORM = [
  { name: "线程 / 锁 / 消息", note: "task 接口适配到系统原语" },
  { name: "HTTP 请求", note: "GET / POST 网络底层适配" },
  { name: "录音", note: "16K / 16bit 单声道 PCM" },
  { name: "WebSocket", note: "AI 语音服务常驻长连接" },
  { name: "设备信息", note: "SN · 时间戳 · 数据存取" },
  { name: "流媒体播放", note: "MP3 流播放接口实现" },
];

// SDK 功能列表：按文档四大分组罗列开箱即用的能力，供厂商盘点功能边界。
const FEATURES = [
  {
    group: "通用能力",
    c: pastels.sky,
    items: ["后台接口：内容获取 · 登录支付鉴权 · 数据上报", "HTTP 组件：接口签名 · GET/POST · URL 编码", "设备：设备信息 · 系统时间 · 用户信息存取", "工具：JSON 解析 · 哈希/MD5 · 队列链表 · 多线程"],
  },
  {
    group: "内容服务",
    c: pastels.sage,
    items: ["首页听单列表", "专辑 / 音频列表", "订阅 · 收听历史 · 已购列表", "登录 · 支付 · 活动二维码 · 专辑订阅"],
  },
  {
    group: "音频播放",
    c: pastels.clay,
    items: ["播放 / 暂停 / 停止 / 上下曲", "播放进度实时同步", "播放完成状态上报 · 中断处理", "播放列表 · 断点续播 · 历史记录"],
  },
  {
    group: "AI 交互",
    c: pastels.wisteria,
    items: ["实时语音识别 · 文本搜索内容", "流式 TTS · 搜索结果列表返回", "WebSocket 双向通信 · 心跳保活 · 断线重连", "录音：16K/16bit 单声道 PCM 实时流"],
  },
];


export default function IntegrationPage() {
  return (
    <PageShell
      title="一套账号，两端接入"
      lead="家长端用 H5 管内容与会员，玩具端用 SDK 做语音点播与播放，两端共用同一套喜马拉雅账号——家长登录的账号即玩具播放所用的账号。"
    >
      {/* 双子系统：两列卡片，底部一条贯穿的「共用账号」纽带 */}
      <div className="grid gap-6 sm:grid-cols-2">
        {SUBSYSTEMS.map((s) => (
          <div
            key={s.key}
            className="flex flex-col rounded-2xl p-7"
            style={{ background: surface.raised, border: `1px solid ${ink.line}` }}
          >
            <div className="flex items-center gap-3">
              <span
                className="rounded-full px-3 py-1 text-xs font-semibold"
                style={{ background: s.c.tint, color: s.c.deep }}
              >
                {s.badge}
              </span>
              <span className="text-sm" style={{ color: ink[500] }}>{s.carrier}</span>
            </div>
            <p className="mt-4 text-sm leading-relaxed" style={{ color: ink[700] }}>{s.desc}</p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {s.points.map((p) => (
                <li
                  key={p}
                  className="rounded-full px-3 py-1 text-xs"
                  style={{ background: surface.paper, color: ink[700], border: `1px solid ${ink.line}` }}
                >
                  {p}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* 接入门槛：厂商先判断自家硬件能否承载 */}
      <h2 className="mt-14 text-xl font-semibold tracking-tight" style={{ color: ink[900] }}>
        接入门槛
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed" style={{ color: ink[700] }}>
        SDK 为 C 语言嵌入式实现，资源占用低、异步处理不阻塞主线程。先对照下列指标确认硬件可承载。
      </p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {THRESHOLDS.map((t) => (
          <div
            key={t.label}
            className="rounded-2xl p-5"
            style={{ background: surface.raised, border: `1px solid ${ink.line}` }}
          >
            <div className="text-xs" style={{ color: ink[500] }}>{t.label}</div>
            <div className="mt-1.5 text-lg font-semibold tabular-nums" style={{ color: ink[900] }}>
              {t.value}
            </div>
            <div className="mt-0.5 text-xs" style={{ color: ink[500] }}>{t.note}</div>
          </div>
        ))}
      </div>

      {/* Platform 适配：厂商自己的工作量，6 类硬件相关接口 */}
      <h2 className="mt-14 text-xl font-semibold tracking-tight" style={{ color: ink[900] }}>
        你需要做的适配
      </h2>
      <p className="mt-2 text-sm leading-relaxed" style={{ color: ink[700] }}>
        喜马按需求编译并交付 SDK 库 + UI 切图。厂商只需实现 platform 层这几类硬件相关接口，即可把 SDK 跑通在自家系统上。
      </p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PLATFORM.map((p, i) => (
          <div
            key={p.name}
            className="flex items-start gap-3 rounded-2xl p-5"
            style={{ background: surface.raised, border: `1px solid ${ink.line}` }}
          >
            <span
              className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold tabular-nums"
              style={{ background: ACCENT.tint, color: ACCENT.deep }}
            >
              {i + 1}
            </span>
            <div>
              <h3 className="text-sm font-semibold" style={{ color: ink[900] }}>{p.name}</h3>
              <p className="mt-0.5 text-xs leading-relaxed" style={{ color: ink[700] }}>{p.note}</p>
            </div>
          </div>
        ))}
      </div>

      {/* SDK 功能列表：四大分组，开箱即用的能力盘点 */}
      <h2 className="mt-14 text-xl font-semibold tracking-tight" style={{ color: ink[900] }}>
        SDK 功能列表
      </h2>
      <p className="mt-2 text-sm leading-relaxed" style={{ color: ink[700] }}>
        适配完成后，下列能力开箱即用——按需求可用编译参数做功能裁剪，只编进自家方案需要的部分。
      </p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {FEATURES.map((f) => (
          <div
            key={f.group}
            className="rounded-2xl p-6"
            style={{ background: surface.raised, border: `1px solid ${ink.line}` }}
          >
            <span
              className="inline-block rounded-full px-3 py-1 text-xs font-semibold"
              style={{ background: f.c.tint, color: f.c.deep }}
            >
              {f.group}
            </span>
            <ul className="mt-4 space-y-2">
              {f.items.map((item) => (
                <li
                  key={item}
                  className="flex gap-2 text-sm leading-relaxed"
                  style={{ color: ink[700] }}
                >
                  <span aria-hidden style={{ color: f.c.mid }}>·</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
