/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['coin-images.coingecko.com', 'assets.coingecko.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'coin-images.coingecko.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'assets.coingecko.com',
        pathname: '**',
      }
    ],
  },
};

module.exports = nextConfig;