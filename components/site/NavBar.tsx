"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { surface, ink } from "@/components/palette";
import { ACCENT } from "./accent";
import { NAV } from "./nav";
import { Wordmark, SolidBtn } from "./atoms";

// "/" must match exactly, else it lights up on every route; nested routes use a
// prefix match so a future /scenarios/xxx still highlights its top-level item.
function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

// Page-level floating pill nav. Mounted in the root layout as a direct child of
// <body> — never inside a page's overflow-hidden, which would clip its `sticky`.
export function NavBar() {
  const pathname = usePathname();
  return (
    // Outer sticky band provides top offset + side gutters so the pill floats in
    // whitespace. The pill reads as crystal glass: a low-opacity white tint over a
    // strong backdrop blur (the sky bleeds through, refracted), a translucent white
    // rim, and a top sheen — clarity over a frosted/solid fill.
    <div className="sticky top-0 z-50 px-6 pt-4 sm:px-10">
      <nav
        className="mx-auto flex max-w-7xl items-center gap-8 rounded-full px-7 py-3 backdrop-blur-md sm:px-9"
        style={{
          background: `linear-gradient(180deg, ${surface.raised}24 0%, ${surface.raised}12 50%, ${surface.raised}1f 100%)`,
          border: `0.5px solid ${surface.raised}4d`,
          boxShadow: `inset 0 1px 1px ${surface.raised}66, inset 0 -1px 2px ${ink[900]}0a, 0 10px 28px -12px ${ink[900]}1f`,
        }}
      >
        <Wordmark />
        {/* nav links + CTA grouped to the right — kills the empty middle gap */}
        <div className="ml-auto hidden items-center gap-6 text-sm xl:flex" style={{ color: ink[700] }}>
          {NAV.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="cursor-pointer hover:opacity-70"
              style={isActive(pathname, href) ? { color: ACCENT.deep, fontWeight: 600 } : undefined}
            >
              {label}
            </Link>
          ))}
        </div>
        {/* TODO: 申请合作 CTA 目标页未定,本轮纯占位无跳转 */}
        <div className="ml-auto xl:ml-0">
          <SolidBtn>申请合作</SolidBtn>
        </div>
      </nav>
    </div>
  );
}
