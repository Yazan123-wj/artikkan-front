import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { SiteChrome } from '@/components/layout/site-chrome';
import { SkipToContent } from '@/components/shared/skip-to-content';
import { routing } from '@/i18n/routing';
import { getLocaleDirection } from '@/lib/constants';
import { fontDisplayAr, fontDisplayEn } from '@/lib/fonts';

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <html
      lang={locale}
      dir={getLocaleDirection(locale)}
      className={`${fontDisplayEn.variable} ${fontDisplayAr.variable}`}
    >
      <body>
        <NextIntlClientProvider>
          <SkipToContent />
          <SiteChrome>{children}</SiteChrome>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
