// Static export to nginx sub-path; basePath only applies to production builds
// so local `next dev` stays at /
// DEPLOY_BASE_PATH overrides the sub-path so the same code can ship to a
// second nginx location (e.g. /child_website_v2) independently of /child_website.
const isProd = process.env.NODE_ENV === 'production';
const basePath = isProd ? (process.env.DEPLOY_BASE_PATH || '/child_website') : '';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath,
  images: { unoptimized: true },
  // next/image does not prepend basePath to src - expose it for manual prefixing
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
