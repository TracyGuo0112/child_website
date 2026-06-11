import { ink } from "@/components/palette";

// Single-page layout: each former route is now a <section> with an id that the
// sticky nav's hash links target. scroll-mt clears the floating pill nav so an
// anchor jump never hides the section title underneath it.
export function Section({
  id,
  title,
  lead,
  children,
}: {
  id: string;
  title: string;
  lead?: string;
  children?: React.ReactNode;
}) {
  return (
    <section id={id} className="relative scroll-mt-24">
      <div className="mx-auto max-w-5xl px-6 py-16 sm:px-10">
        <header className="mb-12">
          <h2 className="text-3xl font-semibold tracking-tight lg:text-4xl" style={{ color: ink[900] }}>
            {title}
          </h2>
          {lead && (
            <p className="mt-4 max-w-2xl text-base leading-relaxed" style={{ color: ink[700] }}>
              {lead}
            </p>
          )}
        </header>
        {children}
      </div>
    </section>
  );
}
