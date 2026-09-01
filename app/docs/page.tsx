import { surface, ink } from "@/components/palette";
import { ACCENT } from "@/components/site/accent";
import { cardSurface } from "@/components/site/atoms";

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

type Doc = {
  title: string;
  meta: string;
  desc: string;
  file: string;
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
];

function DocCard({ doc: d }: { doc: Doc }) {
  return (
    <article className="flex flex-col rounded-2xl p-6 sm:p-7" style={cardSurface}>
      <div
        className="flex h-11 w-11 items-center justify-center rounded-xl"
        style={{ background: ACCENT.tint, color: ACCENT.deep }}
      >
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M14 3v4a1 1 0 0 0 1 1h4" />
          <path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z" />
          <path d="M9 13h6M9 17h4" />
        </svg>
      </div>

      <h3 className="mt-4 text-lg font-semibold" style={{ color: ink[900] }}>{d.title}</h3>
      <p className="mt-1 text-xs font-medium" style={{ color: ACCENT.deep }}>{d.meta}</p>
      <p className="mt-3 flex-1 text-sm leading-relaxed" style={{ color: ink[700] }}>{d.desc}</p>

      <div className="mt-6 flex items-center gap-3">
        <a
          href={d.file}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-semibold transition-transform hover:-translate-y-0.5"
          style={{ background: ACCENT.deep, color: surface.raised }}
        >
          查看
        </a>
        <a
          href={d.file}
          download
          className="inline-block whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-semibold transition-transform hover:-translate-y-0.5"
          style={{ border: `1.5px solid ${ink.line}`, color: ink[700] }}
        >
          下载
        </a>
      </div>
    </article>
  );
}

function DocsSection({ section }: { section: DocSection }) {
  const single = section.docs.length === 1;

  return (
    <section className="mx-auto max-w-5xl">
      <div className="text-center">
        <h2 className="text-2xl font-semibold tracking-tight lg:text-3xl" style={{ color: ink[900] }}>
          {section.title}
        </h2>
        <p className="mt-3 text-sm leading-relaxed sm:text-base" style={{ color: ink[700] }}>
          {section.desc}
        </p>
      </div>
      <div className={`mt-8 grid gap-6 ${single ? "mx-auto max-w-lg" : "md:grid-cols-3"}`}>
        {section.docs.map((doc) => <DocCard key={doc.file} doc={doc} />)}
      </div>
    </section>
  );
}

export default function DocsPage() {
  return (
    // no background of its own — the global SiteBackground sky shows through, and
    // pt clears the sticky pill nav (this page has no hero to offset it).
    <main className="min-h-screen px-6 pb-24 pt-20 sm:px-8">
      <header className="mx-auto mb-12 max-w-3xl text-center">
        <h1 className="text-3xl font-semibold tracking-tight lg:text-4xl" style={{ color: ink[900] }}>
          技术文档
        </h1>
        <p className="mt-3 text-base leading-relaxed" style={{ color: ink[700] }}>
          喜马拉雅儿童内容接入技术文档。点「查看」在新标签打开，或直接下载 PDF。
        </p>
      </header>

      <div className="space-y-20">
        {DOC_SECTIONS.map((section) => <DocsSection key={section.title} section={section} />)}
      </div>
    </main>
  );
}
