import { surface, ink } from "@/components/palette";
import { PageShell, ACCENT } from "@/components/site";

const STEPS = [
  { n: "1", title: "TODO: 步骤一", desc: "TODO: 描述" },
  { n: "2", title: "TODO: 步骤二", desc: "TODO: 描述" },
  { n: "3", title: "TODO: 步骤三", desc: "TODO: 描述" },
];

export default function IntegrationPage() {
  return (
    <PageShell
      eyebrow="接入说明"
      title="三步接入"
      lead="TODO: 概述——从申请到上线，最少几步即可让设备点播内容。"
    >
      <div className="grid gap-6 sm:grid-cols-3">
        {STEPS.map((s) => (
          <div
            key={s.n}
            className="rounded-2xl p-7"
            style={{ background: surface.raised, border: `1px solid ${ink.line}` }}
          >
            <div
              className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold"
              style={{ background: ACCENT.tint, color: ACCENT.deep }}
            >
              {s.n}
            </div>
            <h3 className="mt-4 text-base font-semibold" style={{ color: ink[900] }}>{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed" style={{ color: ink[700] }}>{s.desc}</p>
          </div>
        ))}
      </div>

      {/* 代码片段占位 —— 待真实 SDK 形态确定后替换 */}
      <pre
        className="mt-10 overflow-x-auto rounded-2xl p-6 font-[family-name:var(--font-geist-mono)] text-sm"
        style={{ background: ink[900], color: surface.paper }}
      >
        {`// TODO: 接入代码示例（待真实 SDK 形态确定）`}
      </pre>
    </PageShell>
  );
}
