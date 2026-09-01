import Image from "next/image";
import { ink } from "@/components/palette";
import { ACCENT, cardSurface } from "@/components/site";
import { Section } from "@/components/site/Section";

// 主内容 H5 的运营组件，取自方案文档「四、家长端能力」组件表。
const COMPONENTS = [
  { name: "用户信息组件", desc: "展示账号昵称、头像、会员状态" },
  { name: "搜索组件", desc: "关键词搜索儿童内容，结果展示专辑列表（封面、标题、集数、免费 / 会员标识）" },
  { name: "分类组件", desc: "儿童英语、科普百科、经典名著、家长课堂、侦探冒险、校园成长、卡通动画等分类入口" },
  { name: "排行榜", desc: "热门内容榜单" },
  { name: "N×N 卡片位", desc: "专辑 / 内容卡片宫格展示" },
  { name: "收听历史", desc: "用户最近收听记录" },
  { name: "订阅历史", desc: "用户已订阅的专辑" },
];

// The summary mirrors the binding-triggered delivery flow in the full partner guide.
const ACTIVATION = [
  { step: "设备 SN 报备", desc: "正式上线前，合作伙伴将具备权益资格的设备 SN 导入喜马后台。" },
  { step: "用户首次绑定", desc: "设备第一次绑定成功后，合作伙伴获取 SN，并在统一触发节点调用下发接口。" },
  { step: "自动登录与下发", desc: "喜马识别或创建账号，静默发放对应会员权益，无需用户手动领取。" },
  { step: "到账告知与入口", desc: "客户端即时弹窗告知，并保留喜马权益固定入口作为后续使用路径。" },
];

const ACTIVATION_RULES = [
  "正式上线前需完成设备 SN 报备；未报备设备无法完成登录和内容播放",
  "设备授权跟随设备 SN；会员额度首次领取后发放到用户手机号对应的喜马账号",
  "每台设备 SN 的会员额度仅可领取一次，领取后的会员时长跟随用户账号",
  "会员到期后，有权益设备仍可播放免费内容；会员内容需续费后继续收听",
  "售后退货设备按卡种规则处理；3 天卡设备再次销售前需刷新 SN",
];

export function ParentSection() {
  return (
    <Section
      id="parent"
      title="家长端产品能力"
      lead="喜马提供主内容 H5 与会员激活 H5，厂商以 WebView / 小程序插件嵌入。内容首页由喜马拉雅 IOT 运营平台统一编排，运营调整组件组合、排序及参数，前端无需发版。"
    >
      {/* H5 产品示意视频 */}
      <div className="rounded-lg p-6 sm:p-8" style={cardSurface}>
        <div className="grid gap-6 lg:grid-cols-[0.42fr_0.58fr] lg:items-center">
          <div>
            <h3 className="text-xl font-semibold" style={{ color: ink[900] }}>
              H5 产品示意
            </h3>
            <p className="mt-2 text-sm leading-relaxed" style={{ color: ink[700] }}>
              展示内容首页、分类入口、专辑列表、会员状态与投射播放等家长端核心体验。
            </p>
          </div>
          <div className="mx-auto w-full max-w-sm">
            <video
              className="h-auto w-full rounded-lg bg-neutral-800 shadow-2xl"
              controls
              playsInline
              preload="none"
              poster={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/videos/h5-demo-poster.v2.jpg`}
            >
              <source src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/videos/h5-demo.v2.mp4`} type="video/mp4" />
            </video>
          </div>
        </div>
      </div>

      {/* 主内容 H5 组件清单 */}
      <h3 className="mt-14 text-xl font-semibold" style={{ color: ink[900] }}>
        主内容 H5 · 支持的组件
      </h3>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {COMPONENTS.map((c) => (
          <div key={c.name} className="rounded-lg p-5" style={cardSurface}>
            <h4 className="text-sm font-semibold" style={{ color: ink[900] }}>{c.name}</h4>
            <p className="mt-1 text-xs leading-relaxed" style={{ color: ink[700] }}>{c.desc}</p>
          </div>
        ))}
        <div className="rounded-lg p-5" style={cardSurface}>
          <h4 className="text-sm font-semibold" style={{ color: ACCENT.deep }}>内容投射</h4>
          <p className="mt-1 text-xs leading-relaxed" style={{ color: ink[700] }}>
            支持投射单集或整张专辑到设备播放；专辑信息、单集列表带免费 / 会员标识。
          </p>
        </div>
      </div>

      {/* Membership entitlement delivery */}
      <h3 className="mt-14 text-xl font-semibold" style={{ color: ink[900] }}>
        会员权益自动发放
      </h3>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed" style={{ color: ink[700] }}>
        合作伙伴按设备 SN 预置会员权益。用户首次绑定设备后，系统完成账号识别、自动登录与权益静默下发，并通过弹窗和固定入口明确告知到账结果。
      </p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {ACTIVATION.map((a, i) => (
          <div key={a.step} className="rounded-lg p-6" style={cardSurface}>
            <span
              className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold tabular-nums"
              style={{ background: ACCENT.tint, color: ACCENT.deep }}
            >
              {i + 1}
            </span>
            <h4 className="mt-3 text-sm font-semibold" style={{ color: ink[900] }}>{a.step}</h4>
            <p className="mt-1 text-xs leading-relaxed" style={{ color: ink[700] }}>{a.desc}</p>
          </div>
        ))}
      </div>
      <ul className="mt-5 space-y-2">
        {ACTIVATION_RULES.map((r) => (
          <li key={r} className="flex gap-2 text-sm leading-relaxed" style={{ color: ink[700] }}>
            <span aria-hidden style={{ color: ACCENT.deep }}>·</span>{r}
          </li>
        ))}
      </ul>
      <a
        href={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/docs/child-membership-benefits-v2.0.pdf`}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 inline-block rounded-full px-5 py-2.5 text-sm font-semibold transition-transform hover:-translate-y-0.5"
        style={{ background: ACCENT.deep, color: "white" }}
      >
        查看完整会员权益接入方案
      </a>

      {/* 用户自主续费 + 付费链路图 */}
      <h3 className="mt-14 text-xl font-semibold" style={{ color: ink[900] }}>
        用户自主续费与分成
      </h3>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed" style={{ color: ink[700] }}>
        会员到期后，家长可在 H5 内自助续费：
      </p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg p-6" style={cardSurface}>
          <h4 className="text-sm font-semibold" style={{ color: ink[900] }}>原生 App 接入</h4>
          <p className="mt-1.5 text-sm leading-relaxed" style={{ color: ink[700] }}>H5 内直接完成支付。</p>
        </div>
        <div className="rounded-lg p-6" style={cardSurface}>
          <h4 className="text-sm font-semibold" style={{ color: ink[900] }}>微信小程序接入</h4>
          <p className="mt-1.5 text-sm leading-relaxed" style={{ color: ink[700] }}>由喜马提供合规支付路径（具体方案对接时确认）。</p>
        </div>
      </div>
      <div className="mt-4 rounded-lg p-6" style={cardSurface}>
        <h4 className="text-sm font-semibold" style={{ color: ACCENT.deep }}>分成机制</h4>
        <p className="mt-1.5 text-sm leading-relaxed" style={{ color: ink[700] }}>
          通过合作渠道完成的续费订单，喜马按订单渠道标识与厂商结算分成，形成持续收入。具体比例商务洽谈确定。
        </p>
      </div>
      <h3 className="mt-14 text-xl font-semibold" style={{ color: ink[900] }}>
        C 端用户付费链路 · 有屏玩具支持双端支付链路
      </h3>
      <div className="mx-auto mt-5 max-w-2xl rounded-lg p-6 sm:p-10" style={cardSurface}>
        <Image
          src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/diagrams/payment-flow.png`}
          alt="C 端用户付费链路：无屏玩具经原生 App 或微信小程序完成支付，有屏玩具扫码进入货架页支付"
          width={952}
          height={950}
          className="h-auto w-full"
        />
      </div>
    </Section>
  );
}
