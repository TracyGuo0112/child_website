import Image from "next/image";
import Link from "next/link";
import { surface, ink } from "@/components/palette";
import { ACCENT } from "./accent";
import { BRAND } from "./nav";

// Server-safe atoms (no hooks) shared across NavBar / Footer / PageShell. Kept
// out of the client bundle by importing this file directly, not via the barrel
// (the barrel also re-exports the client NavBar).

// Logo + wordmark, links home. The mascot PNG is pre-cut (yellow bg removed).
export function Wordmark({ color = ink[900] }: { color?: string }) {
  return (
    <Link href="/" className="inline-flex items-center gap-2 whitespace-nowrap text-base font-semibold tracking-tight" style={{ color }}>
      <Image src="/brand/mascot-logo.png" alt="" width={36} height={36} className="h-9 w-9 object-contain" priority />
      {BRAND}
    </Link>
  );
}

// Buttons render a <Link> when `href` is given — never nest them inside a Link
// (button-in-anchor is invalid HTML and double-focuses for keyboard users).
export function SolidBtn({
  children,
  href,
  bg = ACCENT.deep,
  fg = surface.raised,
  size = "sm",
}: {
  children: React.ReactNode;
  href?: string;
  bg?: string;
  fg?: string;
  size?: "sm" | "lg";
}) {
  const pad = size === "lg" ? "px-7 py-3.5 text-base" : "px-6 py-3 text-sm";
  const cls = `inline-block whitespace-nowrap rounded-full font-semibold transition-transform hover:-translate-y-0.5 ${pad}`;
  const style = { background: bg, color: fg };
  if (href) {
    return <Link href={href} className={cls} style={style}>{children}</Link>;
  }
  return <button className={cls} style={style}>{children}</button>;
}

export function LineBtn({ children, href, color = ink[900] }: { children: React.ReactNode; href?: string; color?: string }) {
  const cls = "inline-block whitespace-nowrap rounded-full px-6 py-3 text-sm font-semibold transition-transform hover:-translate-y-0.5";
  const style = { border: `1.5px solid ${color}`, color };
  if (href) {
    return <Link href={href} className={cls} style={style}>{children}</Link>;
  }
  return <button className={cls} style={style}>{children}</button>;
}

// Shared lifted-card surface — the one card look every content page uses.
export const cardSurface = {
  background: surface.raised,
  border: `1px solid ${ink.line}`,
} as const;

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.25em]" style={{ color: ACCENT.deep }}>
      <span className="inline-block h-px w-7" style={{ background: ACCENT.deep }} />
      {children}
    </span>
  );
}
