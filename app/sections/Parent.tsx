import Image from "next/image";
import { ink } from "@/components/palette";
import { ACCENT, cardSurface } from "@/components/site";
import { Section } from "@/components/site/Section";

// 主内容 H5 的运营组件，取自方案文档「四、家长端能力」组件表。
const COMPONENTS = [
  { name: "用户信息组件", desc: "展示账号昵称、头像、会员状态" },
  { name: "搜索组件", desc: "关键词搜索儿童内容，结果展示专辑列表（封面、标题、集数、免费 / 会员标识）" },
  { name: "分类组件", desc: "故事、儿歌、科普、国学等分类入口" },
  { name: "排行榜", desc: "热门内容榜单" },
  { name: "N×N 卡片位", desc: "专辑 / 内容卡片宫格展示" },
  { name: "收听历史", desc: "用户最近收听记录" },
  { name: "订阅历史", desc: "用户已订阅的专辑" },
];

// SN 会员激活三步，取自「会员赠送与激活」激活流程。
const ACTIVATION = [
  { step: "SN 批量导入", desc: "厂商将设备 SN 批量导入喜马后台，支持分批导入、不同批次对应不同会员规格。" },
  { step: "绑定自动校验", desc: "用户激活设备并在小程序绑定时，系统自动完成 SN 权益校验。" },
  { step: "一键领取会员", desc: "校验通过后，用户登录 / 注册喜马账号，一键领取会员。" },
];

const ACTIVATION_RULES = [
  "SN 一机一码，每个 SN 仅可领取一次",
  "权益绑定账号后，换手机只需登录同一账号即可继续使用",
  "明文 SN 不在链路上传输，采用加密校验机制（具体算法技术对接时约定）",
];

export function ParentSection() {
  return (
    <Section
      id="parent"
      title="管内容、管会员、管续费"
      lead="喜马提供主内容 H5 与会员激活 H5，厂商以 WebView / 小程序插件嵌入。内容首页由喜马拉雅 IOT 运营平台统一编排，运营调整组件组合、排序及参数，前端无需发版。"
    >
      {/* 主内容 H5 组件清单 */}
      <h3 className="text-xl font-semibold tracking-tight" style={{ color: ink[900] }}>
        主内容 H5 · 支持的组件
      </h3>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {COMPONENTS.map((c) => (
          <div key={c.name} className="rounded-2xl p-5" style={cardSurface}>
            <h4 className="text-sm font-semibold" style={{ color: ink[900] }}>{c.name}</h4>
            <p className="mt-1 text-xs leading-relaxed" style={{ color: ink[700] }}>{c.desc}</p>
          </div>
        ))}
        <div className="rounded-2xl p-5" style={cardSurface}>
          <h4 className="text-sm font-semibold" style={{ color: ACCENT.deep }}>内容投射</h4>
          <p className="mt-1 text-xs leading-relaxed" style={{ color: ink[700] }}>
            支持投射单集或整张专辑到设备播放；专辑信息、单集列表带免费 / 会员标识。
          </p>
        </div>
      </div>

      {/* SN 会员激活 */}
      <h3 className="mt-14 text-xl font-semibold tracking-tight" style={{ color: ink[900] }}>
        会员赠送与激活
      </h3>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed" style={{ color: ink[700] }}>
        厂商与喜马商务协商采购会员权益（年卡 / 季卡等规格），按设备 SN 批量预置，用户购机激活领取——领取会员后才算激活。
      </p>
      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        {ACTIVATION.map((a, i) => (
          <div key={a.step} className="rounded-2xl p-6" style={cardSurface}>
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

      {/* 用户自主续费 + 付费链路图 */}
      <h3 className="mt-14 text-xl font-semibold tracking-tight" style={{ color: ink[900] }}>
        用户自主续费与分成
      </h3>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed" style={{ color: ink[700] }}>
        会员到期后，家长可在 H5 内自助续费：
      </p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl p-6" style={cardSurface}>
          <h4 className="text-sm font-semibold" style={{ color: ink[900] }}>原生 App 接入</h4>
          <p className="mt-1.5 text-sm leading-relaxed" style={{ color: ink[700] }}>H5 内直接完成支付。</p>
        </div>
        <div className="rounded-2xl p-6" style={cardSurface}>
          <h4 className="text-sm font-semibold" style={{ color: ink[900] }}>微信小程序接入</h4>
          <p className="mt-1.5 text-sm leading-relaxed" style={{ color: ink[700] }}>由喜马提供合规支付路径（具体方案对接时确认）。</p>
        </div>
      </div>
      <div className="mt-4 rounded-2xl p-6" style={cardSurface}>
        <h4 className="text-sm font-semibold" style={{ color: ACCENT.deep }}>分成机制</h4>
        <p className="mt-1.5 text-sm leading-relaxed" style={{ color: ink[700] }}>
          通过合作渠道完成的续费订单，喜马按订单渠道标识与厂商结算分成，形成持续收入。具体比例商务洽谈确定。
        </p>
      </div>
      <h3 className="mt-14 text-xl font-semibold tracking-tight" style={{ color: ink[900] }}>
        C 端用户付费链路 · 有屏玩具支持双端支付链路
      </h3>
      <div className="mx-auto mt-5 max-w-2xl rounded-3xl p-6 sm:p-10" style={cardSurface}>
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
