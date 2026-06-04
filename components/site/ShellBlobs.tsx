"use client";

import HeroBlob from "@/components/hero-blob/HeroBlob";

// One soft corner blob as a quiet page-background texture. Deliberately lighter
// than the home hero's 3-blob MarginBlobs so content pages stay calm and only
// one WebGL context runs per page. pointer-events-none keeps it purely decorative.
export function ShellBlobs() {
  return (
    <div className="pointer-events-none absolute inset-0">
      <HeroBlob
        cameraZ={6}
        blobs={[{ shape: "cloud", theme: "candy", position: [3.6, 2, 0], scale: 0.55, motion: {} }]}
      />
    </div>
  );
}
