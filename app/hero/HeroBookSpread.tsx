import { surface, ink } from "@/components/palette";
import { CardCopyInner, BlobPanel, MarginBlobs } from "./HeroGlassWide";

// The chosen hero card shape: an open book (spread). Reuses the live hero's
// content (CardCopyInner + BlobPanel) and scene (MarginBlobs); the shell adds a
// center spine gutter + a page-stack shadow so the two columns read as facing
// pages of an open book.

export function HeroBookSpread() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden" style={{ background: surface.paper }}>
      <MarginBlobs />
      <div className="relative z-10 flex flex-1 items-center justify-center px-6 pb-16">
        <div className="relative w-full max-w-5xl">
          {/* page-stack shadow under the spread, peeking at the bottom edge */}
          <div className="absolute inset-x-6 -bottom-2 h-6 rounded-b-[2rem]" style={{ background: ink.line, filter: "blur(2px)", opacity: 0.6 }} />
          <div
            className="relative grid overflow-hidden rounded-[1.5rem] backdrop-blur-md lg:grid-cols-2"
            style={{ background: `${surface.raised}f2`, border: `1px solid ${ink.line}`, boxShadow: `0 30px 60px -22px ${ink[900]}33` }}
          >
            <CardCopyInner />
            <BlobPanel />
            {/* center spine: gutter shadow + a hairline crease, like an open book */}
            <div
              className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-16 -translate-x-1/2 lg:block"
              style={{ background: `linear-gradient(90deg, transparent, ${ink[900]}14 45%, ${ink[900]}1f 50%, ${ink[900]}14 55%, transparent)` }}
            />
            <div className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-px -translate-x-1/2 lg:block" style={{ background: `${ink[900]}26` }} />
          </div>
        </div>
      </div>
    </div>
  );
}
