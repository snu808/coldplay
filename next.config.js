const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  // output: 'export', // Temporarily commented out for testing
  // Configure `basePath` and `assetPrefix` for the repository name
  basePath: isProd ? '/coldplay' : undefined,
  assetPrefix: isProd ? '/coldplay/' : undefined,
  images: {
    unoptimized: true,
  },
  output: 'export',
  reactStrictMode: true,
};

module.exports = nextConfig;
