import { ink } from "@/components/palette";
import { Eyebrow } from "./atoms";
import { ShellBlobs } from "./ShellBlobs";

// Shared shell for the six content pages: transparent so the layout's fixed sky
// backdrop shows through, a quiet background blob, top padding to clear the
// floating sticky nav, and a title block. overflow-hidden stays on THIS container
// only — never reaching the layout's NavBar/Footer.
export function PageShell({
  eyebrow,
  title,
  lead,
  children,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  children?: React.ReactNode;
}) {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <ShellBlobs />
      {/* The sticky nav already occupies ~84px of flow above us, so this only needs
          to be breathing room below it — not a full fixed-nav offset. */}
      <div className="relative z-10 mx-auto max-w-5xl px-6 pb-24 pt-16 sm:px-10">
        <header className="mb-12">
          {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
          <h1 className="mt-4 text-3xl font-semibold tracking-tight lg:text-4xl" style={{ color: ink[900] }}>
            {title}
          </h1>
          {lead && (
            <p className="mt-4 max-w-2xl text-base leading-relaxed" style={{ color: ink[700] }}>
              {lead}
            </p>
          )}
        </header>
        {children}
      </div>
    </main>
  );
}
