import { surface, ink } from "@/components/palette";
import HeroBlob from "@/components/hero-blob/HeroBlob";
import { ACCENT, Eyebrow, SolidBtn, LineBtn } from "@/components/site";

// The chosen hero: a wide frosted-glass card carries the copy on the left while a
// big gummy blob glows through the translucent right panel, with smaller blobs
// floating in the page margins. De-AI moves: left-ranged copy (not dead-centered),
// a quiet hairline form row instead of a centered pill wall.
//
// Shared chrome (NavBar / Wordmark / buttons / ACCENT) lives in @/components/site;
// only the hero-specific copy, form row, and card shells stay here.

const EYEBROW = "AI 玩具接入方案 · V1.0";
const SUBCOPY =
  "面向第三方 AI 毛绒玩具厂商的标准化接入方案。设备端语音点播版权内容，家长侧 App / 小程序管理账号与会员，会员权益随设备一同发放，用户自主续费。";
const FORMS = ["AI 故事机 / 音箱", "儿童 AI 机器人", "儿童 AI 玩偶", "儿童 AI 耳机", "家长 App", "小程序"];

// ---------------------------------------------------------------- hero-only bits

// Low-key form list — a left-ranged hairline row, not a centered pill wall.
function FormRow() {
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs" style={{ color: ink[500] }}>
      <span className="font-semibold" style={{ color: ink[700] }}>适配形态</span>
      {FORMS.map((f) => (
        <span key={f}>{f}</span>
      ))}
    </div>
  );
}

// Frosted glass card surface — translucent + blur so blobs glow through.
const glassStyle = {
  background: `${surface.raised}d9`,
  border: `1px solid ${surface.raised}`,
  boxShadow: `0 30px 60px -20px ${ink[900]}33`,
} as const;

// Reusable card content, shared by the live hero and the book-shape explorations
// so copy/CTA/blobs stay identical across variants — only the card shell differs.
export function CardCopyInner() {
  return (
    <div className="flex flex-col justify-center px-10 py-14 sm:px-14">
      <Eyebrow>{EYEBROW}</Eyebrow>
      <h1 className="mt-5 text-4xl font-semibold leading-[1.12] tracking-tight lg:text-5xl" style={{ color: ink[900] }}>
        为 AI 玩具接入
        <br />
        <span style={{ color: ACCENT.deep }}>喜马拉雅</span>儿童版权内容
      </h1>
      <p className="mt-5 max-w-xl text-base leading-relaxed" style={{ color: ink[700] }}>{SUBCOPY}</p>
      <div className="mt-8 flex items-center gap-4">
        <SolidBtn>查看接入说明</SolidBtn>
        <LineBtn>合作流程</LineBtn>
      </div>
      <div className="mt-10 border-t pt-6" style={{ borderColor: ink.line }}>
        <FormRow />
      </div>
    </div>
  );
}

// The blob panel that fills the card's right page.
export function BlobPanel({ className }: { className?: string }) {
  return (
    <div className={`relative min-h-[22rem] ${className ?? ""}`} style={{ background: `${ACCENT.tint}80` }}>
      <HeroBlob cameraZ={2.8} className="absolute inset-0" blobs={[{ shape: "splat", theme: "candy", scale: 1.05, motion: {} }]} />
    </div>
  );
}

// Margin blobs floating around the card — shared so every variant sits in the
// same scene.
export function MarginBlobs() {
  return (
    <div className="pointer-events-none absolute inset-0">
      <HeroBlob
        cameraZ={6}
        blobs={[
          { shape: "star", theme: "candy", position: [-3.7, 1.3, 0], scale: 0.5, motion: {} },
          { shape: "donut", theme: "ocean", position: [-3.6, -2.1, 0], scale: 0.48, motion: {} },
          { shape: "cloud", theme: "bubblegum", position: [3.6, -2, 0], scale: 0.52, motion: {} },
        ]}
      />
    </div>
  );
}

// ---------------------------------------------------------------- 磨砂宽幅 (frosted wide card, blob glows through)

// Backup of the original hero (no longer rendered; the book-spread variant is
// live). Kept as a fallback + reference for the shared fragments above.
export function HeroGlassWide() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden" style={{ background: surface.paper }}>
      <MarginBlobs />
      <div className="relative z-10 flex flex-1 items-center justify-center px-6 pb-16">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-[2.5rem] backdrop-blur-md lg:grid-cols-[1.2fr_1fr]" style={glassStyle}>
          <CardCopyInner />
          <BlobPanel />
        </div>
      </div>
    </div>
  );
}
