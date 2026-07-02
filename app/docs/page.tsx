"use client";

import { useEffect, useState } from "react";
import { surface, ink } from "@/components/palette";
import { ACCENT } from "@/components/site/accent";
import { cardSurface } from "@/components/site/atoms";
import { hasDocsPass } from "@/components/site/docs-keys";

// Client guard: the soft gate lives in JS, so a direct hit on /docs (no prior
// verify this session) must bounce home and re-open the key modal — otherwise
// typing the URL skips the doorway entirely. ?docs=1 tells NavBar to pop the
// modal on arrival. Not real access control (see docs-keys.ts); the PDFs remain
// URL-reachable. Metadata can't be exported from a client component, so the tab
// title falls back to the layout default — fine for a gated utility page.
const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const DOCS = [
  {
    title: "喜马拉雅嵌入式 SDK（C 语言）",
    meta: "v2.2 · PDF · 8 页",
    desc: "面向玩具端的 C 语言嵌入式 SDK 接入与调用说明。",
    file: `${base}/docs/xmly-sdk-c-v2.2.pdf`,
  },
  {
    title: "喜马拉雅小程序插件",
    meta: "v2.1 · PDF · 8 页",
    desc: "小程序插件的引入与接入说明。",
    file: `${base}/docs/xmly-miniapp-v2.1.pdf`,
  },
];

export default function DocsPage() {
  // Gate on the client: unknown until we can read sessionStorage post-mount.
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    if (hasDocsPass()) {
      setAllowed(true);
    } else {
      // bounce home and ask NavBar to re-open the key modal
      window.location.replace(`${base}/?docs=1`);
    }
  }, []);

  // Render nothing until verified — avoids flashing the docs before the bounce.
  if (allowed !== true) return null;

  return (
    // no background of its own — the global SiteBackground sky shows through, and
    // pt clears the sticky pill nav (this page has no hero to offset it).
    <main className="min-h-screen px-6 pb-24 pt-28 sm:px-8">
      <header className="mx-auto mb-12 max-w-3xl text-center">
        <h1 className="text-3xl font-semibold tracking-tight lg:text-4xl" style={{ color: ink[900] }}>
          技术文档
        </h1>
        <p className="mt-3 text-base leading-relaxed" style={{ color: ink[700] }}>
          喜马拉雅儿童内容接入技术文档。点「查看」在新标签打开，或直接下载 PDF。
        </p>
      </header>

      <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-2">
        {DOCS.map((d) => (
          <article key={d.file} className="flex flex-col rounded-2xl p-6 sm:p-7" style={cardSurface}>
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

            <h2 className="mt-4 text-lg font-semibold" style={{ color: ink[900] }}>{d.title}</h2>
            <p className="mt-1 text-xs font-medium" style={{ color: ACCENT.deep }}>{d.meta}</p>
            <p className="mt-3 flex-1 text-sm leading-relaxed" style={{ color: ink[700] }}>{d.desc}</p>

            <div className="mt-6 flex items-center gap-3">
              {/* plain <a>, not SolidBtn/LineBtn: those route via next/link and
                  carry no target/download — these point at static PDF files */}
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
        ))}
      </div>
    </main>
  );
}
