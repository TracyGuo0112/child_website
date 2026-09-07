import { ink } from "@/components/palette";
import { ACCENT } from "@/components/site/accent";
import { cardSurface } from "@/components/site/atoms";

function LockIcon() {
  return (
    <div
      className="mx-auto flex h-12 w-12 items-center justify-center rounded-full"
      style={{ background: ACCENT.tint, color: ACCENT.deep }}
      aria-hidden
    >
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="10" width="14" height="10" rx="2" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      </svg>
    </div>
  );
}

export default function DocsPage() {
  return (
    <main className="min-h-screen px-5 pb-24 pt-16 sm:px-8">
      <header className="mx-auto mb-5 max-w-6xl text-center min-[520px]:text-left">
        <h1 className="text-2xl font-semibold tracking-tight lg:text-3xl" style={{ color: ink[900] }}>
          技术文档
        </h1>
      </header>

      <section className="mx-auto max-w-2xl rounded-2xl px-6 py-14 text-center sm:px-10 sm:py-20" style={cardSurface}>
        <LockIcon />
        <h2 className="mt-4 text-xl font-semibold tracking-tight sm:text-2xl" style={{ color: ink[900] }}>
          技术文档暂不开放
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed sm:text-base" style={{ color: ink[700] }}>
          当前技术文档已锁定。如需接入资料，请联系喜马拉雅侧对接人员。
        </p>
        <div
          className="mx-auto mt-8 h-px max-w-xs"
          style={{ background: `linear-gradient(90deg, transparent, ${ink.line}, transparent)` }}
        />
        <p className="mt-6 text-xs" style={{ color: ink[500] }}>
          文档访问权限由喜马拉雅统一管理
        </p>
      </section>
    </main>
  );
}
