"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { surface, ink } from "@/components/palette";
import { ACCENT } from "./accent";
import { NAV } from "./nav";
import { Wordmark, SolidBtn } from "./atoms";
import { ContactModal } from "./ApplyBtn";
import { DocsAuthModal } from "./DocsAuthModal";

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
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  // scroll-spy only means something on the single-page home; off-home, highlight
  // by route instead so /docs lights up 技术文档 rather than a stale #hero.
  const pathname = usePathname();
  const onHome = pathname === "/";
  const onDocs = pathname === "/docs";
  const onFaq = pathname === "/faq";
  const [open, setOpen] = useState(false);
  // modal state lives here, not inside the dropdown — closing the dropdown
  // unmounts its children, which would destroy a modal opened from within
  const [contactOpen, setContactOpen] = useState(false);
  const [docsAuthOpen, setDocsAuthOpen] = useState(false);

  // A bounced /docs hit lands here as ?docs=1 — re-open the key modal, then strip
  // the param so a refresh doesn't keep re-triggering it.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("docs") === "1") {
      setDocsAuthOpen(true);
      params.delete("docs");
      const qs = params.toString();
      window.history.replaceState(null, "", window.location.pathname + (qs ? `?${qs}` : ""));
    }
  }, []);

  return (
    // Outer sticky band provides top offset + side gutters so the pill floats in
    // whitespace. relative so the mobile dropdown can hang below without
    // stretching the sticky element (which would shift page flow).
    <div className="relative sticky top-0 z-50 px-5 pt-10 sm:px-8">
      <nav
        className="mx-auto flex max-w-6xl items-center gap-6 rounded-full px-5 py-2.5 backdrop-blur-md sm:px-7"
        style={glass}
      >
        <Wordmark />
        {/* nav links + CTA grouped to the right — kills the empty middle gap */}
        <div className="ml-auto hidden items-center gap-5 text-[13px] lg:flex" style={{ color: ink[700] }}>
          {NAV.map(({ label, href }) => (
            <a
              key={href}
              href={`${base}/${href}`}
              className="cursor-pointer hover:opacity-70"
              style={onHome && active === href ? { color: ACCENT.deep, fontWeight: 600 } : undefined}
            >
              {label}
            </a>
          ))}
          {/* page link, not a hash anchor — kept out of NAV so scroll-spy and
              Footer (both NAV consumers) stay anchor-only */}
          <a
            href={`${base}/faq`}
            className="cursor-pointer hover:opacity-70"
            style={onFaq ? { color: ACCENT.deep, fontWeight: 600 } : undefined}
          >
            高频问题
          </a>
          {/* not a NAV entry — it opens the docs gate, not a hash anchor. Already
              on /docs: no-op, no point re-gating what you're looking at. */}
          <button
            className="cursor-pointer hover:opacity-70"
            onClick={() => { if (!onDocs) setDocsAuthOpen(true); }}
            style={onDocs ? { color: ACCENT.deep, fontWeight: 600 } : undefined}
          >
            技术文档
          </button>
        </div>
        <div className="hidden lg:block">
          <SolidBtn onClick={() => setContactOpen(true)}>申请合作</SolidBtn>
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
          className="absolute inset-x-5 top-full mt-2 rounded-lg px-3 py-3 backdrop-blur-xl sm:inset-x-8 lg:hidden"
          // more opaque than the bar — links need a readable surface, not pure sky
          style={{ ...glass, background: `${surface.raised}e6` }}
        >
          {NAV.map(({ label, href }) => (
            <a
              key={href}
              href={`${base}/${href}`}
              className="block rounded-full px-4 py-2.5 text-sm"
              onClick={() => setOpen(false)}
              style={
                onHome && active === href
                  ? { color: ACCENT.deep, fontWeight: 600, background: ACCENT.tint }
                  : { color: ink[700] }
              }
            >
              {label}
            </a>
          ))}
          <a
            href={`${base}/faq`}
            className="block rounded-full px-4 py-2.5 text-sm"
            onClick={() => setOpen(false)}
            style={onFaq ? { color: ACCENT.deep, fontWeight: 600, background: ACCENT.tint } : { color: ink[700] }}
          >
            高频问题
          </a>
          {/* opening the docs gate also collapses the dropdown underneath it */}
          <button
            className="block w-full rounded-full px-4 py-2.5 text-left text-sm"
            onClick={() => { setOpen(false); if (!onDocs) setDocsAuthOpen(true); }}
            style={onDocs ? { color: ACCENT.deep, fontWeight: 600, background: ACCENT.tint } : { color: ink[700] }}
          >
            技术文档
          </button>
          <div className="px-4 pb-1 pt-3">
            {/* opening the modal also collapses the dropdown underneath it */}
            <SolidBtn onClick={() => { setOpen(false); setContactOpen(true); }}>申请合作</SolidBtn>
          </div>
        </div>
      )}

      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
      <DocsAuthModal
        open={docsAuthOpen}
        onClose={() => setDocsAuthOpen(false)}
        onContact={() => { setDocsAuthOpen(false); setContactOpen(true); }}
      />
    </div>
  );
}
