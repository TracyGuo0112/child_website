"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { BlobSpec } from "@/components/blobs";

// ssr:false keeps WebGL off the server render; import the entry module directly
// (not the barrel) so only BlobScene's chunk loads where a hero actually uses it.
const BlobScene = dynamic(() => import("@/components/blobs/BlobScene"), {
  ssr: false,
});

// Thin client boundary so server-rendered pages can drop in a 3D blob without
// each becoming a client component. Mounting many BlobScenes at once runs N
// WebGL contexts in parallel and starves the frame loop, so gate on viewport
// visibility — only the on-screen scene holds a live context, off-screen ones
// unmount theirs entirely.
export default function HeroBlob({
  blobs,
  cameraZ = 3,
  className,
}: {
  blobs: BlobSpec[];
  cameraZ?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      // Only the scene actually on screen holds a live context. No pre-warm
      // margin: two contexts running at once roughly halves the frame rate, and
      // a blob scene cold-starts fast enough that the scroll-in is unnoticeable.
      { threshold: 0.01 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Marching-cubes cost is O(resolution³) per blob per frame. Hero blobs render
  // small (~0.6 scale) and soft, so the default 72 is overkill; 44 looks the same
  // here at ~4× the throughput. Set once for every variant rather than per call.
  const tuned = blobs.map((b) => ({ resolution: 44, ...b }));

  return (
    <div ref={ref} className={`h-full w-full ${className ?? ""}`}>
      {visible ? <BlobScene blobs={tuned} cameraZ={cameraZ} className="!h-full !w-full" /> : null}
    </div>
  );
}
