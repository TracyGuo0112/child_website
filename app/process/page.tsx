import { ink } from "@/components/palette";
import { PageShell, ACCENT } from "@/components/site";

const NODES = [
  { title: "TODO: 申请", desc: "TODO: 描述" },
  { title: "TODO: 对接", desc: "TODO: 描述" },
  { title: "TODO: 联调", desc: "TODO: 描述" },
  { title: "TODO: 上线", desc: "TODO: 描述" },
];

export default function ProcessPage() {
  return (
    <PageShell
      eyebrow="合作流程"
      title="从申请到上线"
      lead="TODO: 概述——典型合作的关键节点与周期。"
    >
      {/* 竖向时间轴：左侧竖线 + 节点圆点，纯 CSS 无库 */}
      <ol className="relative ml-3 border-l" style={{ borderColor: ink.line }}>
        {NODES.map((node) => (
          <li key={node.title} className="mb-10 ml-8 last:mb-0">
            <span
              className="absolute -left-[7px] mt-1 h-3.5 w-3.5 rounded-full"
              style={{ background: ACCENT.deep, boxShadow: `0 0 0 4px ${ACCENT.tint}` }}
            />
            <h3 className="text-base font-semibold" style={{ color: ink[900] }}>{node.title}</h3>
            <p className="mt-1 text-sm leading-relaxed" style={{ color: ink[700] }}>{node.desc}</p>
          </li>
        ))}
      </ol>
    </PageShell>
  );
}
