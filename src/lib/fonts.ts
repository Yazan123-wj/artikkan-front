import { Alexandria } from 'next/font/google';
import localFont from 'next/font/local';

export const fontChalet = localFont({
  src: '../fonts/chalet-london-nineteen-eighty.otf',
  display: 'swap',
  variable: '--font-chalet',
  weight: '400',
  style: 'normal',
});

export const fontAlexandria = Alexandria({
  subsets: ['arabic', 'latin'],
  display: 'swap',
  variable: '--font-alexandria',
});
