import { hasLocale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { CategoriesPageContent } from '@/components/categories/categories-page-content';
import { routing, type AppLocale } from '@/i18n/routing';
import { createPageMetadata } from '@/lib/metadata';

type CategoriesPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: CategoriesPageProps) {
  const { locale } = await params;
  return createPageMetadata({
    locale,
    pathname: '/categories',
    titleKey: 'categories',
  });
}

export default async function CategoriesPage({ params }: CategoriesPageProps) {
  const { locale } = await params;
  const resolvedLocale: AppLocale = hasLocale(routing.locales, locale)
    ? locale
    : routing.defaultLocale;
  setRequestLocale(resolvedLocale);

  return <CategoriesPageContent />;
}
