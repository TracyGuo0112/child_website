import { ink } from "@/components/palette";
import { PageShell, cardSurface } from "@/components/site";

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
            style={cardSurface}
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold marker:content-none" style={{ color: ink[900] }}>
              {item.q}
              {/* affordance: the native marker is hidden, so a chevron signals "expandable" */}
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4 shrink-0 transition-transform group-open:rotate-180"
                fill="none"
                stroke={ink[500]}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </summary>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: ink[700] }}>{item.a}</p>
          </details>
        ))}
      </div>
    </PageShell>
  );
}
