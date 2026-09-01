import { hasLocale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { AboutPageContent } from '@/components/about/about-page-content';
import { routing, type AppLocale } from '@/i18n/routing';
import { createPageMetadata } from '@/lib/metadata';

type AboutPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: AboutPageProps) {
  const { locale } = await params;
  return createPageMetadata({ locale, pathname: '/about', titleKey: 'about' });
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params;
  const resolvedLocale: AppLocale = hasLocale(routing.locales, locale)
    ? locale
    : routing.defaultLocale;
  setRequestLocale(resolvedLocale);

  return <AboutPageContent />;
}
