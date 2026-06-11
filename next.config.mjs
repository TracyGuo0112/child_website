// Static export to nginx sub-path; basePath only applies to production builds
// so local `next dev` stays at /
const isProd = process.env.NODE_ENV === 'production';
const basePath = isProd ? '/child_website' : '';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath,
  images: { unoptimized: true },
  // next/image does not prepend basePath to src — expose it for manual prefixing
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
