import { surface, ink } from "@/components/palette";
import { PageShell } from "@/components/site";

// Bento 栅格：6 块能力，个别块跨列/跨行成大格。
const CAPS = [
  { name: "TODO: 内容库", desc: "TODO: 描述", span: "sm:col-span-2" },
  { name: "TODO: 账号体系", desc: "TODO: 描述", span: "" },
  { name: "TODO: 会员权益", desc: "TODO: 描述", span: "" },
  { name: "TODO: 设备 SDK", desc: "TODO: 描述", span: "" },
  { name: "TODO: 家长端", desc: "TODO: 描述", span: "" },
  { name: "TODO: 数据看板", desc: "TODO: 描述", span: "sm:col-span-2" },
];

export default function CapabilitiesPage() {
  return (
    <PageShell
      eyebrow="核心能力"
      title="接入即拥有的能力"
      lead="TODO: 概述——一次接入获得的内容、账号、会员、设备、家长端与数据能力。"
    >
      <div className="grid auto-rows-[10rem] grid-cols-1 gap-5 sm:grid-cols-3">
        {CAPS.map((c) => (
          <div
            key={c.name}
            className={`flex flex-col justify-end rounded-2xl p-6 ${c.span}`}
            style={{ background: surface.raised, border: `1px solid ${ink.line}` }}
          >
            <h3 className="text-base font-semibold" style={{ color: ink[900] }}>{c.name}</h3>
            <p className="mt-1 text-sm leading-relaxed" style={{ color: ink[700] }}>{c.desc}</p>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
