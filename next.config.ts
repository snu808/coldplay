import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  output: 'export',
  // Configure `basePath` and `assetPrefix` for the repository name
  basePath: isProd ? '/coldplay' : undefined,
  assetPrefix: isProd ? '/coldplay/' : undefined,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
