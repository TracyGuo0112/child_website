import type { Metadata } from "next";
import { ink } from "@/components/palette";
// direct import, not the barrel — the barrel re-exports the client NavBar
import { cardSurface } from "@/components/site/atoms";
import { FAQ_GROUPS } from "./faq-data";
import { FaqToc } from "./FaqToc";

export const metadata: Metadata = { title: "高频问题 · 喜马拉雅儿童 SDK" };

// Public page, no docs gate. Content lives in ./faq-data.ts. No background of
// its own — the global SiteBackground sky shows through; pt clears the sticky
// pill nav (same skeleton as /docs).
export default function FaqPage() {
  return (
    <main className="min-h-screen px-6 pb-24 pt-20 sm:px-8">
      <div className="mx-auto max-w-6xl">
        {/* docs-style two-pane: fixed TOC column / fluid content; below lg they
            stack naturally (the TOC becomes a pill row above the content). No
            page h1 — the nav highlight and tab title carry the page identity. */}
        <div className="lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-12">
          <FaqToc />
          <div className="mt-10 lg:mt-0">
            {FAQ_GROUPS.map((group) => (
              // scroll-mt keeps anchored headings clear of the sticky pill nav
              <section key={group.id} id={group.id} className="mb-14 scroll-mt-32 last:mb-0">
                <h2 className="text-xl font-semibold lg:text-2xl" style={{ color: ink[900] }}>
                  {group.title}
                </h2>
                <div className="mt-5 space-y-4">
                  {group.items.map((item) => (
                    <article key={item.q} className="rounded-2xl p-6" style={cardSurface}>
                      <h3 className="text-base font-semibold" style={{ color: ink[900] }}>
                        {item.q}
                      </h3>
                      <p className="mt-2.5 whitespace-pre-line text-sm leading-relaxed" style={{ color: ink[700] }}>
                        {item.a}
                      </p>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
