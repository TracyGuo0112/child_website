import Image from "next/image";
import { ink, pastels } from "@/components/palette";
import { cardSurface } from "@/components/site";
import { Section } from "@/components/site/Section";

// 玩具端 SDK 五大能力，取自方案文档「五、玩具端 SDK 能力」表。
const ABILITIES = [
  {
    name: "内容检索（Agent 服务）",
    desc: "根据用户 query 自主匹配喜马拉雅儿童内容库，返回专辑 / 单集列表（按匹配度排序，第一条为最佳匹配）；玩具端直接取第一条播放，建议语音播报确认（如“为你播放小猪佩奇”）。",
    c: pastels.sky,
  },
  { name: "内容播放", desc: "获取指定内容的播放地址（免费内容 + 儿童会员内容）。", c: pastels.sage },
  {
    name: "播放进度查询",
    desc: "查询用户对某专辑的播放进度（上次听到哪一集），支持“继续播放”场景；玩具端 AI 识别“继续”意图后，传专辑 ID 调用此接口，从断点继续播放。",
    c: pastels.clay,
  },
  {
    name: "播放历史同步",
    desc: "登录状态下上报播放记录，与家长端收听历史保持同步；家长投射操作和玩具语音点播均计入同一收听历史。",
    c: pastels.wisteria,
  },
  { name: "账号权益查询", desc: "查询当前用户的会员状态和可用内容范围。", c: pastels.blush },
];

// 双凭证鉴权，取自「鉴权模式」。
const CREDENTIALS = [
  { name: "用户 token", desc: "家长在 H5 登录后产生，由厂商 App 传递给设备，标识用户身份与权益。" },
  { name: "厂商密钥", desc: "喜马为每个合作厂商颁发，标识请求来源。" },
];

export function ToySection() {
  return (
    <Section
      id="toy"
      title="语音点播的全部接口"
      lead="设备识别到孩子的收听意图后，调用 SDK 完成内容检索、播放与历史同步。凭证由设备端 SDK 持有并调用，具体格式与管理机制见对接文档。"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {ABILITIES.map((a) => (
          <div key={a.name} className="rounded-2xl p-6" style={cardSurface}>
            <span
              className="inline-block rounded-full px-3 py-1 text-xs font-semibold"
              style={{ background: a.c.tint, color: a.c.deep }}
            >
              {a.name}
            </span>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: ink[700] }}>{a.desc}</p>
          </div>
        ))}
      </div>

      <h3 className="mt-14 text-xl font-semibold tracking-tight" style={{ color: ink[900] }}>
        鉴权模式 · 双凭证机制
      </h3>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {CREDENTIALS.map((c) => (
          <div key={c.name} className="rounded-2xl p-6" style={cardSurface}>
            <h4 className="text-sm font-semibold" style={{ color: ink[900] }}>{c.name}</h4>
            <p className="mt-1.5 text-sm leading-relaxed" style={{ color: ink[700] }}>{c.desc}</p>
          </div>
        ))}
      </div>

      <h3 className="mt-14 text-xl font-semibold tracking-tight" style={{ color: ink[900] }}>
        典型语音调用链路
      </h3>
      <div className="mx-auto mt-5 max-w-3xl rounded-3xl p-6 sm:p-10" style={cardSurface}>
        <Image
          src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/diagrams/voice-flow.png`}
          alt="语音调用链路：用户语音点播 → 第三方 ASR → NLP/NLU 解析意图 → 喜马服务端搜索鉴权取音频 → 设备端 SDK 解密播放 → 上报播放记录"
          width={1164}
          height={784}
          className="h-auto w-full"
        />
      </div>
    </Section>
  );
}
