// Static export served from the Vercel root, so no basePath/asset prefix.
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  // Kept empty for the manual `${NEXT_PUBLIC_BASE_PATH ?? ""}` prefixes in components.
  env: { NEXT_PUBLIC_BASE_PATH: '' },
};

export default nextConfig;
