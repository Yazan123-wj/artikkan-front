import { Amiri, Cormorant_Garamond } from 'next/font/google';

/**
 * Temporary display faces until Artikkan confirms brand type.
 * English: Cormorant Garamond. Arabic: Amiri.
 * Self-hosted by next/font — no runtime Google requests.
 */
export const fontDisplayEn = Cormorant_Garamond({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600'],
  display: 'swap',
  variable: '--font-display-en-file',
});

export const fontDisplayAr = Amiri({
  subsets: ['arabic', 'latin'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--font-display-ar-file',
});
