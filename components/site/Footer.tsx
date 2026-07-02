import { surface, ink } from "@/components/palette";
import { ACCENT } from "./accent";
import { BRAND, NAV } from "./nav";
import { ApplyBtn } from "./ApplyBtn";

// Site footer with a closing call-to-action. Server component — imports atoms /
// data by path, not via the barrel, to stay off the client bundle. Translucent
// ivory glass so the fixed sky backdrop reads softly through the closing band.
export function Footer() {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

  return (
    <footer
      className="relative backdrop-blur-xl"
      style={{ background: `${surface.raised}cc`, borderTop: `1px solid ${ink.line}` }}
    >
      {/* closing CTA band */}
      <div className="mx-auto max-w-5xl px-6 py-20 text-center sm:px-10">
        <p className="mx-auto max-w-xl text-base leading-relaxed" style={{ color: ink[700] }}>
          {/* TODO: 落地文案待定 */}
          标准化接入方案，设备点播版权内容，家长端管理会员，权益随设备发放。
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <ApplyBtn />
        </div>
      </div>

      {/* link row + copyright */}
      <div className="border-t" style={{ borderColor: ink.line }}>
        <div className="mx-auto flex max-w-5xl flex-col gap-4 px-6 py-8 text-sm sm:flex-row sm:items-center sm:px-10" style={{ color: ink[500] }}>
          <span className="font-semibold" style={{ color: ACCENT.deep }}>{BRAND}</span>
          <nav className="flex flex-wrap gap-x-5 gap-y-2 sm:ml-auto">
            {NAV.slice(1).map(({ label, href }) => (
              <a key={href} href={`${base}/${href}`} className="hover:opacity-70">{label}</a>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
