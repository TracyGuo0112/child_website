// Public API for the gummy-blobs component. Consumers import from
// "@/components/blobs" and never reach into internal files — except the WebGL
// entry, which pages dynamic-import directly (ssr:false) for code-splitting.
export { default as BlobScene } from "./BlobScene";
export { default as GummyBlob } from "./GummyBlob";
export type { BlobSpec } from "./BlobScene";
export type { GummyBlobProps } from "./GummyBlob";
export type { ShapeName } from "./shapes";
export type { ThemeName, Coloring } from "./palettes";
