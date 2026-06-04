import { surface, ink } from "@/components/palette";
import { PageShell } from "@/components/site";

// 原生 <details>/<summary> 折叠 —— server-safe，零 JS（KISS）。
const FAQS = [
  { q: "TODO: 版权问题？", a: "TODO: 答案" },
  { q: "TODO: 计费方式？", a: "TODO: 答案" },
  { q: "TODO: 内容审核？", a: "TODO: 答案" },
  { q: "TODO: 设备适配？", a: "TODO: 答案" },
];

export default function FaqPage() {
  return (
    <PageShell
      eyebrow="常见问题"
      title="常见问题"
      lead="TODO: 概述——版权、计费、审核、适配相关的高频问题。"
    >
      <div className="flex flex-col gap-3">
        {FAQS.map((item) => (
          <details
            key={item.q}
            className="group rounded-2xl p-6"
            style={{ background: surface.raised, border: `1px solid ${ink.line}` }}
          >
            <summary className="cursor-pointer list-none text-base font-semibold marker:content-none" style={{ color: ink[900] }}>
              {item.q}
            </summary>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: ink[700] }}>{item.a}</p>
          </details>
        ))}
      </div>
    </PageShell>
  );
}
