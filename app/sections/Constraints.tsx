import { ink, pastels } from "@/components/palette";
import { cardSurface } from "@/components/site";
import { Section } from "@/components/site/Section";

// These constraints define the product boundaries partners must validate before integration.
const CONSTRAINTS = [
  { name: "纯在线运行", desc: "H5 与玩具端 API 均无离线能力，无网络时设备语音提示网络异常。" },
  { name: "内容不可缓存", desc: "版权内容不可本地缓存、不可转授权、不可向 C 端单独收费。" },
  { name: "会员内容鉴权", desc: "有权益设备首次领取完成后，会员到期仍可播放免费内容；点播会员内容时，设备按接口错误码通过 TTS 引导家长登录、领取或续费。" },
  { name: "声音来源标识", desc: "每日首次起播时至少一次提示“即将为你播放来自喜马拉雅儿童的《内容名称》”；播放页需展示喜马拉雅儿童 icon 与内容来源标识。" },
  { name: "品牌合作规范", desc: "专区入口需展示喜马拉雅儿童 icon 和专区文字，专辑封面按规范添加角标与儿童 VIP 标识；产品包装及电商主图不得使用喜马拉雅儿童 logo，售前页和说明书须使用双方确认的标准文案。" },
  { name: "内容运营", desc: "内容首页与活动运营由喜马统一配置，保障内容质量与合规。" },
];

// The dashboard groups partner-facing metrics into four decision-ready categories.
const METRICS = [
  { name: "播放数据", items: "播放量（专辑 / 单集）、播放人数、播放时长", c: pastels.sky },
  { name: "激活数据", items: "SN 激活数、激活率", c: pastels.sage },
  { name: "会员数据", items: "开通数（按渠道区分）、续费率", c: pastels.clay },
  { name: "内容数据", items: "专辑播放排行、搜索热词", c: pastels.wisteria },
];

export function ConstraintsSection() {
  return (
    <Section
      id="constraints"
      title="接入约束与数据能力"
      lead="以下为内容权限与运行约束，接入前请逐项确认，以便评估产品形态。"
    >
      <div className="flex flex-col gap-3">
        {CONSTRAINTS.map((c, i) => (
          <div key={c.name} className="flex items-start gap-4 rounded-lg p-6" style={cardSurface}>
            <span
              className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold tabular-nums"
              style={{ background: pastels.blush.tint, color: pastels.blush.deep }}
            >
              {i + 1}
            </span>
            <div>
              <h3 className="text-sm font-semibold" style={{ color: ink[900] }}>{c.name}</h3>
              <p className="mt-1 text-sm leading-relaxed" style={{ color: ink[700] }}>{c.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <h3 className="mt-14 text-xl font-semibold" style={{ color: ink[900] }}>
        数据看板
      </h3>
      <p className="mt-2 text-sm leading-relaxed" style={{ color: ink[700] }}>
        喜马为厂商提供独立维度的数据统计（视情况沟通对接）。
      </p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {METRICS.map((m) => (
          <div key={m.name} className="rounded-lg p-6" style={cardSurface}>
            <span
              className="inline-block rounded-full px-3 py-1 text-xs font-semibold"
              style={{ background: m.c.tint, color: m.c.deep }}
            >
              {m.name}
            </span>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: ink[700] }}>{m.items}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
