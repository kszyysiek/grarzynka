/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export: `npm run build` writes plain files to out/, served by nginx (see deploy/).
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
