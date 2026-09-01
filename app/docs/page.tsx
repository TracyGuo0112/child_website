import { surface, ink } from "@/components/palette";
import { ACCENT } from "@/components/site/accent";
import { cardSurface } from "@/components/site/atoms";
import { ProtectedDocs } from "./ProtectedDocs";

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

type Doc = {
  title: string;
  meta: string;
  desc: string;
  file: string;
  downloadFile?: string;
};

type DocSection = {
  title: string;
  desc: string;
  docs: Doc[];
};

const DOC_SECTIONS: DocSection[] = [
  {
    title: "喜马拉雅嵌入式 SDK（C 语言）接入详解",
    desc: "面向玩具设备端的 SDK 架构、平台适配、API 与业务流程说明。",
    docs: [
      {
        title: "嵌入式 SDK 接入文档",
        meta: "v2.7 · PDF · 27 页",
        desc: "覆盖 C 语言 SDK 架构、资源要求、平台适配、API、时序图与功能流程。",
        file: `${base}/docs/xmly-sdk-c-v2.7.pdf`,
      },
      {
        title: "儿童内容声音标识与 TTS 提示规范",
        meta: "PDF · 2 页",
        desc: "说明设备授权与用户会员的双层校验、播放错误码 TTS 引导、兜底领取逻辑及声音来源标识。",
        file: `${base}/docs/child-content-tts-spec.pdf`,
      },
    ],
  },
  {
    title: "喜马拉雅微信小程序端接入详解",
    desc: "面向微信小程序宿主的儿童内容插件集成与通信说明。",
    docs: [
      {
        title: "微信小程序插件接入文档",
        meta: "v2.0.4 · PDF · 14 页",
        desc: "覆盖插件注册、页面跳转、连接参数、EventChannel、登录与权益流程。",
        file: `${base}/docs/xmly-miniapp-v2.0.4.pdf`,
      },
    ],
  },
  {
    title: "喜马拉雅app端接入详解",
    desc: "按目标平台查看喜马拉雅生态 SDK 的完整集成说明。",
    docs: [
      {
        title: "Android 集成指南",
        meta: "PDF · 19 页",
        desc: "Android 端依赖集成、WebView、播放控制、登录、权益与悬浮播放器接入说明。",
        file: `${base}/docs/xmly-app-android.pdf`,
      },
      {
        title: "HarmonyOS 集成指南",
        meta: "PDF · 18 页",
        desc: "HarmonyOS NEXT 端依赖集成、Web 组件、播放控制、登录与权益接入说明。",
        file: `${base}/docs/xmly-app-harmonyos.pdf`,
      },
      {
        title: "iOS 集成指南",
        meta: "PDF · 18 页",
        desc: "iOS 端 SDK、WKWebView、播放控制、登录、权益与悬浮播放器接入说明。",
        file: `${base}/docs/xmly-app-ios.pdf`,
      },
    ],
  },
  {
    title: "喜马拉雅儿童品牌合作规范",
    desc: "面向内容合作伙伴的品牌露出、专区入口、会员标识及包装宣传规范。",
    docs: [
      {
        title: "喜马拉雅儿童内容合作品牌规范",
        meta: "PDF / PPTX · 7 页",
        desc: "覆盖内容来源标注、专区入口与角标、儿童 VIP 标识、播放页与合作方首页露出，以及包装、电商图片限制。",
        file: `${base}/docs/brand-collaboration-guidelines.pdf`,
        downloadFile: `${base}/docs/brand-collaboration-guidelines.pptx`,
      },
    ],
  },
  {
    title: "喜马拉雅儿童会员权益接入方案",
    desc: "适用于硬件、App 与小程序合作伙伴的会员权益自动发放、无感登录及提醒机制说明。",
    docs: [
      {
        title: "儿童会员权益自动发放与登录方案",
        meta: "V2.0 · PDF · 9 页",
        desc: "覆盖设备 SN 报备、首次绑定、权益自动下发、登录策略、双方职责、提醒机制与上线验收流程。",
        file: `${base}/docs/child-membership-benefits-v2.0.pdf`,
      },
    ],
  },
];

function DocCard({ doc: d }: { doc: Doc }) {
  return (
    <article
      className="grid gap-3 rounded-xl p-3.5 min-[520px]:grid-cols-[minmax(0,1fr)_auto] min-[520px]:items-center"
      style={{ background: surface.raised, border: `1px solid ${ink.line}` }}
    >
      <div className="flex min-w-0 gap-3">
        <div
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
          style={{ background: ACCENT.tint, color: ACCENT.deep }}
        >
          <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M14 3v4a1 1 0 0 0 1 1h4" />
            <path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z" />
            <path d="M9 13h6M9 17h4" />
          </svg>
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-semibold leading-snug" style={{ color: ink[900] }}>{d.title}</h3>
          <p className="mt-0.5 text-[11px] font-medium" style={{ color: ACCENT.deep }}>{d.meta}</p>
          <p className="mt-1.5 text-xs leading-relaxed" style={{ color: ink[700] }}>{d.desc}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 min-[520px]:pl-2">
        <a
          href={d.file}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition-transform hover:-translate-y-0.5"
          style={{ background: ACCENT.deep, color: surface.raised }}
        >
          查看
        </a>
        <a
          href={d.downloadFile ?? d.file}
          download
          className="inline-block whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition-transform hover:-translate-y-0.5"
          style={{ border: `1.5px solid ${ink.line}`, color: ink[700] }}
        >
          下载
        </a>
      </div>
    </article>
  );
}

function TestAccessFlow() {
  return (
    <section className="mx-auto mb-3.5 max-w-6xl rounded-2xl p-4 sm:p-5" style={cardSurface}>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] lg:gap-8">
        <div>
          <h2 className="text-lg font-semibold tracking-tight" style={{ color: ink[900] }}>
            测试/正式接入流程
          </h2>
          <p className="mt-1.5 text-xs leading-relaxed sm:text-sm" style={{ color: ink[700] }}>
            需要提供由 <code className="font-semibold" style={{ color: ACCENT.deep }}>ssh-ed25519</code> 生成的公钥，用于开通代码权限。
          </p>
        </div>

        <ol className="grid list-decimal gap-2 pl-5 text-xs leading-relaxed sm:text-sm" style={{ color: ink[700] }}>
          <li>
            将公钥通过邮件发送至
            {" "}
            <a className="font-semibold underline underline-offset-2" href="mailto:yanhong.guo@ximalaya.com" style={{ color: ACCENT.deep }}>
              yanhong.guo@ximalaya.com
            </a>
            。
          </li>
          <li>
            邮件中需写明：公司名称、产品名称、申请接入的内容类别（儿童 / 成人）、喜马侧对接的商务姓名、设备端系统（RTOS 等）、手机端接入方式（App / 微信小程序）。
          </li>
          <li>喜马通过邮件回复设备端代码地址、手机端代码包、AppKey 等信息。</li>
        </ol>
      </div>

      <div className="mt-4 grid gap-1.5 border-t pt-3 text-xs leading-relaxed sm:text-sm" style={{ borderColor: ink.line, color: ink[700] }}>
        <p><span className="font-semibold" style={{ color: ink[900] }}>小程序端：</span>需按照接入文档说明申请插件权限；App 端无需申请。</p>
        <p><span className="font-semibold" style={{ color: ink[900] }}>正式接入：</span>付款后需再次申请正式 AppKey 及其他相关权限。</p>
      </div>
    </section>
  );
}

function DocsSection({ section, span }: { section: DocSection; span: "third" | "half" }) {
  return (
    <section
      className={`h-full rounded-2xl p-4 sm:p-5 ${span === "third" ? "min-[900px]:col-span-2" : "min-[900px]:col-span-3"}`}
      style={cardSurface}
    >
      <div>
        <h2 className="text-lg font-semibold tracking-tight" style={{ color: ink[900] }}>
          {section.title}
        </h2>
        <p className="mt-1.5 text-xs leading-relaxed sm:text-sm" style={{ color: ink[700] }}>
          {section.desc}
        </p>
      </div>
      <div className="mt-4 grid gap-3">
        {section.docs.map((doc) => <DocCard key={doc.file} doc={doc} />)}
      </div>
    </section>
  );
}

export default function DocsPage() {
  return (
    // no background of its own — the global SiteBackground sky shows through, and
    // pt clears the sticky pill nav (this page has no hero to offset it).
    <main className="min-h-screen px-5 pb-16 pt-16 sm:px-8">
      <header className="mx-auto mb-5 max-w-6xl text-center min-[520px]:text-left">
        <h1 className="text-2xl font-semibold tracking-tight lg:text-3xl" style={{ color: ink[900] }}>
          技术文档
        </h1>
      </header>

      <TestAccessFlow />

      <ProtectedDocs>
        <div className="grid gap-3.5 min-[900px]:grid-cols-6">
          {DOC_SECTIONS.map((section, index) => (
            <DocsSection key={section.title} section={section} span={index < 3 ? "third" : "half"} />
          ))}
        </div>
      </ProtectedDocs>
    </main>
  );
}
