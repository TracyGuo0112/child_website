"use client";

import { useEffect, useState } from "react";
import { surface, ink } from "@/components/palette";
import { ACCENT } from "./accent";
import { NAV } from "./nav";
import { Wordmark } from "./atoms";
import { ApplyBtn } from "./ApplyBtn";

// Crystal-glass surface, shared by the pill bar and the mobile dropdown: a
// low-opacity white tint over a strong backdrop blur (the sky bleeds through,
// refracted), a translucent white rim, and a top sheen.
const glass = {
  background: `linear-gradient(180deg, ${surface.raised}24 0%, ${surface.raised}12 50%, ${surface.raised}1f 100%)`,
  border: `0.5px solid ${surface.raised}4d`,
  boxShadow: `inset 0 1px 1px ${surface.raised}66, inset 0 -1px 2px ${ink[900]}0a, 0 10px 28px -12px ${ink[900]}1f`,
} as const;

// Scroll-spy over the single-page sections: the topmost section inside the
// upper-viewport band owns the highlight. IntersectionObserver, not scroll
// events — fires only on boundary crossings, not every frame.
function useActiveSection() {
  const [active, setActive] = useState<string>(NAV[0].href);

  useEffect(() => {
    const visible = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.set(e.target.id, e.boundingClientRect.top);
          else visible.delete(e.target.id);
        }
        // topmost visible section wins; if none visible (mid-jump), keep current
        let best: string | null = null;
        let bestTop = Infinity;
        visible.forEach((top, id) => {
          if (top < bestTop) { bestTop = top; best = id; }
        });
        if (best) setActive(`#${best}`);
      },
      // count a section as "active" while it owns the upper half of the screen —
      // matches where the reader's eye is
      { rootMargin: "-15% 0px -50% 0px" },
    );

    for (const { href } of NAV) {
      const el = document.getElementById(href.slice(1));
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  return active;
}

// Page-level floating pill nav. Mounted in the root layout as a direct child of
// <body> — never inside a page's overflow-hidden, which would clip its `sticky`.
// Single-page site: links are hash anchors; the highlight comes from scroll-spy.
// Below lg the link row collapses into a hamburger dropdown — without it,
// tablet/small-laptop visitors would have no way to reach any section.
export function NavBar() {
  const active = useActiveSection();
  const [open, setOpen] = useState(false);

  return (
    // Outer sticky band provides top offset + side gutters so the pill floats in
    // whitespace. relative so the mobile dropdown can hang below without
    // stretching the sticky element (which would shift page flow).
    <div className="relative sticky top-0 z-50 px-6 pt-4 sm:px-10">
      <nav
        className="mx-auto flex max-w-7xl items-center gap-8 rounded-full px-7 py-3 backdrop-blur-md sm:px-9"
        style={glass}
      >
        <Wordmark />
        {/* nav links + CTA grouped to the right — kills the empty middle gap */}
        <div className="ml-auto hidden items-center gap-6 text-sm lg:flex" style={{ color: ink[700] }}>
          {NAV.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              className="cursor-pointer hover:opacity-70"
              style={active === href ? { color: ACCENT.deep, fontWeight: 600 } : undefined}
            >
              {label}
            </a>
          ))}
        </div>
        <div className="hidden lg:block">
          <ApplyBtn />
        </div>
        {/* below lg: hamburger replaces the link row + CTA (both live in the dropdown) */}
        <button
          className="ml-auto flex h-9 w-9 items-center justify-center rounded-full lg:hidden"
          aria-label={open ? "关闭菜单" : "打开菜单"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          style={{ color: ink[900] }}
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </nav>

      {open && (
        <div
          className="absolute inset-x-6 top-full mt-2 rounded-3xl px-3 py-3 backdrop-blur-xl sm:inset-x-10 lg:hidden"
          // more opaque than the bar — links need a readable surface, not pure sky
          style={{ ...glass, background: `${surface.raised}e6` }}
        >
          {NAV.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              className="block rounded-full px-4 py-2.5 text-sm"
              onClick={() => setOpen(false)}
              style={
                active === href
                  ? { color: ACCENT.deep, fontWeight: 600, background: ACCENT.tint }
                  : { color: ink[700] }
              }
            >
              {label}
            </a>
          ))}
          <div className="px-4 pb-1 pt-3">
            {/* opening the modal also collapses the dropdown underneath it */}
            <ApplyBtn onOpen={() => setOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
