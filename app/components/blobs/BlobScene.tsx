"use client";

import type { ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { Environment, Lightformer } from "@react-three/drei";
import GummyBlob, { type GummyBlobProps } from "./GummyBlob";

// A scene blob is exactly a GummyBlob's props — so any capability added to the
// blob (material, motion, resolution, …) is usable through the scene with no
// extra wiring.
export type BlobSpec = GummyBlobProps;

type Props = {
  blobs: BlobSpec[];
  // Camera distance; larger fits more / smaller blobs into view.
  cameraZ?: number;
  fov?: number;
  // Scene background color, or null/false for transparent (page shows through).
  background?: string | null;
  exposure?: number;
  // Replace the default colored studio lighting entirely (must include an
  // Environment if the transmissive material is to pick up reflections).
  lights?: ReactNode;
  className?: string;
};

// Default colored studio light, shared by every blob — one PMREM env sampled by
// all transmissive materials.
function DefaultLights({ background }: { background?: string | null }) {
  return (
    <Environment resolution={256} environmentIntensity={1.15}>
      {background ? <color attach="background" args={[background]} /> : null}
      <Lightformer form="rect" intensity={6} color="#ffffff" position={[-2, 2.5, 3]} scale={[4, 5, 1]} />
      <Lightformer form="rect" intensity={3} color="#fff0fb" position={[2.5, 1, 3]} scale={[4, 4, 1]} />
      <Lightformer form="circle" intensity={4} color="#ffd486" position={[2.5, 2.5, 1]} scale={[2.4, 2.4, 1]} />
      <Lightformer form="circle" intensity={3.5} color="#86e8c0" position={[-3, -1.5, 1]} scale={[2.6, 2.6, 1]} />
      <Lightformer form="circle" intensity={3} color="#ff9ad8" position={[3, -2, 1.5]} scale={[2.4, 2.4, 1]} />
      <Lightformer form="ring" intensity={2} color="#b79bff" position={[0, 0, -3]} scale={[5, 5, 1]} />
    </Environment>
  );
}

// One WebGL context for any number of blobs. Position/scale each via BlobSpec.
export default function BlobScene({
  blobs,
  cameraZ = 3,
  fov = 42,
  background = null,
  exposure = 1.1,
  lights,
  className,
}: Props) {
  return (
    <Canvas
      className={className}
      dpr={[1, 2]}
      camera={{ position: [0, 0, cameraZ], fov }}
      gl={{
        alpha: true,
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: exposure,
      }}
      style={{ width: "100%", height: "100%" }}
    >
      {/* The env is shared by all blobs; transmission samples it for reflections. */}
      {lights ?? <DefaultLights background={background} />}
      {blobs.map((b, i) => (
        <GummyBlob key={i} {...b} />
      ))}
    </Canvas>
  );
}
