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

export function SolidBtn({
  children,
  bg = ACCENT.deep,
  fg = surface.raised,
  size = "sm",
}: {
  children: React.ReactNode;
  bg?: string;
  fg?: string;
  size?: "sm" | "lg";
}) {
  const pad = size === "lg" ? "px-7 py-3.5 text-base" : "px-6 py-3 text-sm";
  return (
    <button className={`rounded-full font-semibold transition-transform hover:-translate-y-0.5 ${pad}`} style={{ background: bg, color: fg }}>
      {children}
    </button>
  );
}

export function LineBtn({ children, color = ink[900] }: { children: React.ReactNode; color?: string }) {
  return (
    <button className="rounded-full px-6 py-3 text-sm font-semibold transition-colors" style={{ border: `1.5px solid ${color}`, color }}>
      {children}
    </button>
  );
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.25em]" style={{ color: ACCENT.deep }}>
      <span className="inline-block h-px w-7" style={{ background: ACCENT.deep }} />
      {children}
    </span>
  );
}
