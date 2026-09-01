import { breakpoints } from '@/lib/responsive';

export const MAIN_CONTENT_ID = 'main-content';

export { breakpoints };

export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
}

export function getLocaleDirection(locale: string): 'ltr' | 'rtl' {
  return locale === 'ar' ? 'rtl' : 'ltr';
}
