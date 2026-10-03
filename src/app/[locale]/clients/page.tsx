import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ClientsPageContent } from '@/components/clients/clients-page-content';
import { routing, type AppLocale } from '@/i18n/routing';
import { createPageMetadata } from '@/lib/metadata';

type ClientsPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: ClientsPageProps) {
  const { locale } = await params;
  const resolvedLocale: AppLocale = hasLocale(routing.locales, locale)
    ? locale
    : routing.defaultLocale;
  const t = await getTranslations({
    locale: resolvedLocale,
    namespace: 'clientsPage',
  });

  return createPageMetadata({
    locale: resolvedLocale,
    pathname: '/clients',
    titleKey: 'clients',
    description: t('intro'),
  });
}

export default async function ClientsPage({ params }: ClientsPageProps) {
  const { locale } = await params;
  const resolvedLocale: AppLocale = hasLocale(routing.locales, locale)
    ? locale
    : routing.defaultLocale;
  setRequestLocale(resolvedLocale);

  return <ClientsPageContent />;
}
