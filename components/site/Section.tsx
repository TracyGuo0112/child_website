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
  title: React.ReactNode;
  lead?: string;
  children?: React.ReactNode;
}) {
  return (
    <section id={id} className="relative scroll-mt-28">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:px-8 lg:px-10">
        <header className="mb-10 grid gap-4 lg:mb-12 lg:grid-cols-[0.38fr_0.62fr] lg:items-end">
          <h2 className="max-w-lg text-3xl font-semibold leading-tight lg:text-4xl" style={{ color: ink[900] }}>
            {title}
          </h2>
          {lead && (
            <p className="max-w-3xl text-base leading-relaxed lg:justify-self-end" style={{ color: ink[700] }}>
              {lead}
            </p>
          )}
        </header>
        {children}
      </div>
    </section>
  );
}
