export const siteConfig = {
  name: 'Artikkan',
  nameAr: 'أرتكان',
  defaultLocale: 'en',
  locales: ['en', 'ar'] as const,
  ogImage: '/images/brand/og-default.jpg',
  timeZone: 'Asia/Qatar',
  /**
   * Sales/enquiry inbox for product mailto links.
   * Required. Set NEXT_PUBLIC_ENQUIRY_EMAIL to the confirmed Artikkan address.
   * Do not invent a fallback address.
   */
  enquiryEmail: process.env.NEXT_PUBLIC_ENQUIRY_EMAIL ?? '',
} as const;

export type SiteLocale = (typeof siteConfig.locales)[number];

export function getEnquiryEmail(): string | null {
  const email = siteConfig.enquiryEmail.trim();
  return email.length > 0 ? email : null;
}
