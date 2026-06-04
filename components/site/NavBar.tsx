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
    // whitespace. The pill reads as glass from light (a top sheen gradient + inner
    // highlight/shade), not from background bleed — translucent cool-white over
    // our warm bg muddied to grey, so it sits on warm paper instead.
    <div className="sticky top-0 z-50 px-6 pt-4 sm:px-10">
      <nav
        className="mx-auto flex max-w-7xl items-center gap-8 rounded-full px-7 py-3 backdrop-blur-xl sm:px-9"
        style={{
          background: `linear-gradient(180deg, ${surface.raised}d9 0%, ${surface.paper}b3 45%, ${surface.paper}cc 100%)`,
          border: `1px solid ${surface.raised}`,
          boxShadow: `inset 0 1px 1px ${surface.raised}, inset 0 -1px 2px ${ink[900]}0a, 0 10px 28px -12px ${ink[900]}26`,
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
