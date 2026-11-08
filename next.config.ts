import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

function apiOrigin() {
  const origin = process.env.API_ORIGIN || process.env.NEXT_PUBLIC_API_ORIGIN;
  if (origin) return origin.replace(/\/$/, '');
  const url = process.env.NEXT_PUBLIC_API_URL ?? '';
  return url.replace(/\/api\/v1\/?$/, '') || 'http://localhost:4000';
}

const nextConfig: NextConfig = {
  output: 'standalone',
  async rewrites() {
    const origin = apiOrigin();
    return [
      { source: '/api/v1/:path*', destination: `${origin}/api/v1/:path*` },
      { source: '/uploads/:path*', destination: `${origin}/uploads/:path*` },
    ];
  },
  images: {
    qualities: [70, 75, 85, 88, 90, 92],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '4000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: '**.up.railway.app',
        pathname: '/uploads/**',
      },
    ],
  },
};

export default withNextIntl(nextConfig);
