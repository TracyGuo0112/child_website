"use client";

import { useEffect, useState } from "react";
import { ink } from "@/components/palette";
import { ACCENT } from "@/components/site/accent";
import { OVERVIEW_NAV } from "./overview-nav";

function useActiveOverviewItem() {
  const [active, setActive] = useState<string>(OVERVIEW_NAV[0].id);

  useEffect(() => {
    const visible = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.set(entry.target.id, entry.boundingClientRect.top);
          else visible.delete(entry.target.id);
        }

        let best: string | null = null;
        let bestTop = Infinity;
        visible.forEach((top, id) => {
          if (top < bestTop) {
            best = id;
            bestTop = top;
          }
        });
        if (best) setActive(best);
      },
      { rootMargin: "-15% 0px -55% 0px" },
    );

    for (const { id } of OVERVIEW_NAV) {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    }
    return () => observer.disconnect();
  }, []);

  return active;
}

export function OverviewToc() {
  const active = useActiveOverviewItem();

  return (
    <aside className="lg:sticky lg:top-32 lg:self-start">
      <nav aria-label="产品方案概述目录" className="flex flex-wrap gap-2 lg:block lg:space-y-1">
        {OVERVIEW_NAV.map(({ id, title }) => (
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
