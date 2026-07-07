"use client";

import { useEffect, useState } from "react";
import { ink } from "@/components/palette";
import { ACCENT } from "@/components/site/accent";
import { FAQ_GROUPS } from "./faq-data";

// Scroll-spy over the FAQ groups — same pattern as NavBar's useActiveSection:
// the topmost group inside the upper-viewport band owns the highlight.
// Deliberately a local copy, not a shared hook: 25 controlled lines beat
// coupling this page to NavBar's internals.
function useActiveGroup() {
  const [active, setActive] = useState<string>(FAQ_GROUPS[0].id);

  useEffect(() => {
    const visible = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.set(e.target.id, e.boundingClientRect.top);
          else visible.delete(e.target.id);
        }
        let best: string | null = null;
        let bestTop = Infinity;
        visible.forEach((top, id) => {
          if (top < bestTop) { bestTop = top; best = id; }
        });
        if (best) setActive(best);
      },
      { rootMargin: "-15% 0px -55% 0px" },
    );

    for (const { id } of FAQ_GROUPS) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  return active;
}

// Left-hand TOC of the FAQ page. Plain fragment links (#id) — basePath-agnostic,
// and the global `scroll-behavior: smooth` handles the glide; no scroll JS here.
// Below lg the same DOM renders as a wrapping pill row above the content;
// from lg up it becomes the sticky left column (top offset clears the floating
// nav band — keep it in sync with NavBar's pt).
export function FaqToc() {
  const active = useActiveGroup();

  return (
    <aside className="lg:sticky lg:top-32 lg:self-start">
      <nav aria-label="高频问题目录" className="flex flex-wrap gap-2 lg:block lg:space-y-1">
        {FAQ_GROUPS.map(({ id, title }) => (
          <a
            key={id}
            href={`#${id}`}
            className="rounded-full px-3.5 py-1.5 text-sm transition-colors lg:block lg:rounded-lg lg:px-3 lg:py-2"
            style={
              active === id
                ? { color: ACCENT.deep, fontWeight: 600, background: ACCENT.tint }
                : { color: ink[700] }
            }
          >
            {title}
          </a>
        ))}
      </nav>
    </aside>
  );
}
