// HeroBlob is a "use client" + dynamic(ssr:false) WebGL boundary. Per the
// components convention, such heavy entries are imported directly for
// code-splitting (import HeroBlob from "@/components/hero-blob/HeroBlob"),
// not through this barrel. The barrel only re-exports the type so consumers
// can annotate without pulling the client chunk.
export type { BlobSpec } from "@/components/blobs";
