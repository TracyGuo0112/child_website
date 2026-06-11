import HeroBlob from "@/components/hero-blob/HeroBlob";

// One soft corner blob as a quiet page-background texture — deliberately lighter
// than the home hero so content pages stay calm and only one WebGL context runs
// per page. pointer-events-none keeps it purely decorative. Server component;
// HeroBlob is the client boundary.
//
// The container is capped at one viewport height, NOT inset-0: the parent spans
// the whole content run, and a canvas that tall (×dpr) blows past GPU render
// target limits and keeps the frame loop alive for the entire scroll. Capped,
// HeroBlob's visibility gate also unmounts the context once it scrolls past.
export function ShellBlobs() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 h-screen">
      <HeroBlob
        cameraZ={6}
        blobs={[{ shape: "cloud", theme: "candy", position: [3.6, 2, 0], scale: 0.55, motion: {} }]}
      />
    </div>
  );
}
