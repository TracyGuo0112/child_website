"use client";

import dynamic from "next/dynamic";
import type { ShapeName, ThemeName, BlobSpec } from "@/components/blobs";

// ssr:false keeps WebGL off the server render. Import the entry module directly
// (not the barrel) so only BlobScene's chunk loads on demand.
const BlobScene = dynamic(() => import("@/components/blobs/BlobScene"), {
  ssr: false,
});

// Lay specs out on a 3-column grid in world space. One Canvas renders the whole
// grid, so each section is a single WebGL context instead of one per cell.
const COLS = 3;
const GAP = 2.2; // world units between cells

function gridLayout<T extends Omit<BlobSpec, "position">>(items: T[]): BlobSpec[] {
  const rows = Math.ceil(items.length / COLS);
  return items.map((it, i) => {
    const col = i % COLS;
    const row = Math.floor(i / COLS);
    const x = (col - (COLS - 1) / 2) * GAP;
    const y = ((rows - 1) / 2 - row) * GAP;
    return { ...it, position: [x, y, 0], scale: 0.62 };
  });
}

const SHAPES_ITEMS: { shape: ShapeName; speed: number }[] = [
  { shape: "cloud", speed: 1 },
  { shape: "splat", speed: 1.15 },
  { shape: "donut", speed: 0.9 },
  { shape: "star", speed: 1.05 },
  { shape: "pebble", speed: 0.95 },
  { shape: "pill", speed: 1.1 },
];

const THEME_ITEMS: { theme: ThemeName }[] = [
  { theme: "reference" },
  { theme: "sunset" },
  { theme: "ocean" },
  { theme: "candy" },
  { theme: "aurora" },
  { theme: "bubblegum" },
];

const SHAPE_LABELS = ["Cloud", "Splat", "Donut", "Star", "Pebble", "Pill"];
const THEME_LABELS = ["Reference", "Sunset", "Ocean", "Candy", "Aurora", "Bubblegum"];
const VARIANT_LABELS = [0, 1, 2, 3, 4, 5].map((s) => `seed ${s}`);

const shapesBlobs = gridLayout(SHAPES_ITEMS);
const themeBlobs = gridLayout(THEME_ITEMS.map((t) => ({ shape: "splat" as ShapeName, ...t })));
const variantBlobs = gridLayout(
  [0, 1, 2, 3, 4, 5].map((seed) => ({ shape: "pebble" as ShapeName, theme: "candy" as ThemeName, seed })),
);

// Camera distance to frame a 3-col / 2-row grid at scale 0.62.
const CAM_Z = 6.5;

function Section({
  title,
  blobs,
  labels,
}: {
  title: string;
  blobs: BlobSpec[];
  labels: (string | number)[];
}) {
  const rows = Math.ceil(blobs.length / 3);
  return (
    <section className="mx-auto mb-16 max-w-5xl">
      <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-neutral-400">
        {title}
      </h2>
      {/* One canvas for the whole grid. Aspect matches the 3xN cell layout. */}
      <div className="relative w-full" style={{ aspectRatio: `3 / ${rows}` }}>
        <BlobScene blobs={blobs} cameraZ={CAM_Z} />
        {/* Labels overlaid under each cell. */}
        <div
          className="pointer-events-none absolute inset-0 grid"
          style={{ gridTemplateColumns: "repeat(3, 1fr)", gridTemplateRows: `repeat(${rows}, 1fr)` }}
        >
          {labels.map((l, i) => (
            <div key={i} className="flex items-end justify-center pb-3 text-sm font-medium text-neutral-500">
              {l}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function BlobsPage() {
  return (
    <main className="min-h-screen px-8 py-16 sm:px-16" style={{ background: "#F4F1E4" }}>
      <header className="mx-auto mb-12 max-w-5xl text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-800">Gummy Blobs</h1>
        <p className="mt-2 text-sm text-neutral-500">
          复刻 UG Labs 的虹彩果冻 3D 元素 · React Three Fiber · 共享 Canvas
        </p>
      </header>

      <Section title="形状 Shapes" blobs={shapesBlobs} labels={SHAPE_LABELS} />
      <Section title="配色主题 Themes（同 Splat 形状）" blobs={themeBlobs} labels={THEME_LABELS} />
      <Section title="种子变体 Variants（同形状同主题，不同 seed）" blobs={variantBlobs} labels={VARIANT_LABELS} />
    </main>
  );
}
