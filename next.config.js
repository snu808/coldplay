const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  output: 'export',
  // Configure `basePath` and `assetPrefix` for the repository name
  basePath: isProd ? '/coldplay' : undefined,
  assetPrefix: isProd ? '/coldplay/' : undefined,
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
