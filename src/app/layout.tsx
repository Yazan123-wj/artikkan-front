import type { Metadata, Viewport } from 'next';
import { siteConfig } from '@/config/site';
import './globals.css';

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.name,
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  ),
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#f6f4f0',
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  // Pass-through on purpose. Next.js 16 + next-intl keep a single document
  // in `app/[locale]/layout.tsx` (`html`/`body`, lang, dir, providers).
  // Putting those tags here would nest invalid markup.
  return children;
}
