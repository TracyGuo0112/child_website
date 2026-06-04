import { ink, surface, pastels } from "@/components/palette";
import { PageShell } from "@/components/site";

// Static jelly dot — a CSS-only gummy marble (volume gradient + top-left
// highlight + soft halo). Pure CSS on purpose: 9 timeline nodes must not each
// spin up a WebGL context (the home hero already taught us that lesson).
const JELLY = [pastels.sky, pastels.sage, pastels.wisteria, pastels.blush];

function JellyDot({ c }: { c: (typeof pastels)[keyof typeof pastels] }) {
  return (
    <span
      className="absolute -left-2 mt-0.5 h-4 w-4 rounded-full"
      style={{
        backgroundImage: [
          "radial-gradient(circle at 35% 28%, rgba(255,255,255,.95) 0%, rgba(255,255,255,0) 40%)",
          `radial-gradient(circle at 50% 70%, ${c.deep} 0%, ${c.mid} 55%, ${c.soft} 100%)`,
        ].join(", "),
        boxShadow: `0 2px 4px rgba(54,44,36,.20), 0 0 0 4px ${c.tint}66`,
      }}
    />
  );
}

// SDK 方案包·商务对接主线：一条流程从资料介绍贯穿到运营售后。
const NODES = [
  { n: "01", title: "资料介绍", items: ["产品介绍", "方案白皮书", "Demo"] },
  { n: "02", title: "需求确认", items: ["终端类型", "用户量级", "目标人群"] },
  {
    n: "03",
    title: "技术答疑",
    items: ["娃端接入（支持 AI 点播）", "家长端小程序（支持推送）", "账号打通（SSO / 授权）", "接入文档 · 工作量 · 周期评估"],
  },
  { n: "04", title: "案例验证", items: ["已上市案例", "测试账号", "真机 Demo"] },
  { n: "05", title: "商业模式", items: ["付费入口", "免费 / 付费内容比例", "会员体系"] },
  { n: "06", title: "报价分成", items: ["分成比例", "结算周期", "对账方式"] },
  { n: "07", title: "签约合规", items: ["合作协议", "内容授权", "未成年人保护"] },
  { n: "08", title: "联调上线", items: ["技术联调", "灰度测试", "验收发布"] },
  { n: "09", title: "运营售后", items: ["内容更新", "数据报表", "技术支持"] },
];

export default function ProcessPage() {
  return (
    <PageShell
      title="从资料对接到上线运营"
      lead="从资料介绍到运营售后，一条主线贯穿商务洽谈、技术接入与上线运营的关键节点。"
    >
      {/* 竖向时间轴：左侧竖线 + 节点圆点，纯 CSS 无库 */}
      <ol className="relative ml-3 border-l" style={{ borderColor: ink.line }}>
        {NODES.map((node, i) => (
          <li key={node.n} className="mb-10 ml-8 last:mb-0">
            <JellyDot c={JELLY[i % JELLY.length]} />
            <h3 className="flex items-baseline gap-2 text-base font-semibold" style={{ color: ink[900] }}>
              <span className="text-sm font-normal tabular-nums" style={{ color: ink[500] }}>{node.n}</span>
              {node.title}
            </h3>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {node.items.map((item) => (
                <span
                  key={item}
                  className="rounded-full px-3 py-1 text-xs"
                  style={{ background: surface.raised, color: ink[700], border: `1px solid ${ink.line}` }}
                >
                  {item}
                </span>
              ))}
            </div>
          </li>
        ))}
      </ol>
    </PageShell>
  );
}
