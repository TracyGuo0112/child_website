import HeroBlob from "@/components/hero-blob/HeroBlob";

// One soft corner blob as a quiet page-background texture — deliberately lighter
// than the home hero so content pages stay calm and only one WebGL context runs
// per page. pointer-events-none keeps it purely decorative. Server component;
// HeroBlob is the client boundary.
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
