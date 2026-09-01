import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  // Local images only until a production asset host is confirmed.
  images: {
    qualities: [70, 75, 85, 88, 90, 92],
  },
};

export default withNextIntl(nextConfig);
