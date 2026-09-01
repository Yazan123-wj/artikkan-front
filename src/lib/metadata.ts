import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { siteConfig } from '@/config/site';
import { routing, type AppLocale } from '@/i18n/routing';
import { getSiteUrl } from '@/lib/constants';

type NavKey =
  | 'home'
  | 'about'
  | 'categories'
  | 'products'
  | 'projects'
  | 'journal'
  | 'contact'
  | 'privacyPolicy'
  | 'terms';

type CreatePageMetadataInput = {
  locale: string;
  pathname?: string;
  titleKey: NavKey;
  title?: string;
  description?: string;
  noIndex?: boolean;
  ogType?: 'website' | 'article';
  ogImage?: string;
  localePathnames?: Partial<Record<AppLocale, string>>;
};

export async function createPageMetadata({
  locale,
  pathname = '/',
  titleKey,
  title: titleOverride,
  description,
  noIndex = false,
  ogType = 'website',
  ogImage,
  localePathnames,
}: CreatePageMetadataInput): Promise<Metadata> {
  const resolvedLocale: AppLocale = hasLocale(routing.locales, locale)
    ? locale
    : routing.defaultLocale;
  const meta = await getTranslations({
    locale: resolvedLocale,
    namespace: 'meta',
  });
  const nav = await getTranslations({
    locale: resolvedLocale,
    namespace: 'nav',
  });
  const siteUrl = getSiteUrl();
  const canonicalPath = localePathnames?.[resolvedLocale] ?? pathname;
  const canonicalSuffix = canonicalPath === '/' ? '' : canonicalPath;
  const canonical = `${siteUrl}/${resolvedLocale}${canonicalSuffix}`;
  const pageTitle =
    titleOverride ??
    (titleKey === 'home' ? meta('siteTitle') : nav(titleKey));
  const title =
    titleKey === 'home' && !titleOverride
      ? meta('siteTitle')
      : `${pageTitle} · ${meta('siteTitle')}`;
  const shareImage = ogImage ?? siteConfig.ogImage;
  const resolvedDescription = description ?? meta('description');

  const pathForLocale = (targetLocale: AppLocale) => {
    const localePath = localePathnames?.[targetLocale] ?? pathname;
    return localePath === '/' ? '' : localePath;
  };

  const languages: Record<string, string> = {
    'x-default': `${siteUrl}/${routing.defaultLocale}${pathForLocale(routing.defaultLocale)}`,
  };

  for (const alternateLocale of routing.locales) {
    languages[alternateLocale] = `${siteUrl}/${alternateLocale}${pathForLocale(alternateLocale)}`;
  }

  return {
    title,
    description: resolvedDescription,
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      title,
      description: resolvedDescription,
      url: canonical,
      siteName: siteConfig.name,
      locale: resolvedLocale === 'ar' ? 'ar_QA' : 'en_QA',
      alternateLocale: resolvedLocale === 'ar' ? ['en_QA'] : ['ar_QA'],
      type: ogType,
      images: [
        {
          url: shareImage,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: resolvedDescription,
      images: [shareImage],
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
    },
  };
}
