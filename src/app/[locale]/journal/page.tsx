import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { JournalBrowser } from '@/components/journal/journal-browser';
import { routing, type AppLocale } from '@/i18n/routing';
import { publicAssetExists } from '@/lib/assets';
import {
  getArticleCategories,
  getFeaturedArticle,
  getListedArticles,
  parseJournalSearchParams,
} from '@/lib/journal';
import { createPageMetadata } from '@/lib/metadata';
import type { JournalCategoryId } from '@/types/journal';

type JournalPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    q?: string | string[];
    category?: string | string[];
    page?: string | string[];
  }>;
};

export async function generateMetadata({ params }: JournalPageProps) {
  const { locale } = await params;
  const resolvedLocale: AppLocale = hasLocale(routing.locales, locale)
    ? locale
    : routing.defaultLocale;
  const t = await getTranslations({
    locale: resolvedLocale,
    namespace: 'journal',
  });

  return createPageMetadata({
    locale: resolvedLocale,
    pathname: '/journal',
    titleKey: 'journal',
    description: t('intro'),
  });
}

export default async function JournalPage({
  params,
  searchParams,
}: JournalPageProps) {
  const { locale } = await params;
  const resolvedLocale: AppLocale = hasLocale(routing.locales, locale)
    ? locale
    : routing.defaultLocale;

  setRequestLocale(resolvedLocale);

  const t = await getTranslations('journal');
  const { q, category } = parseJournalSearchParams(await searchParams);
  const featuredArticle = getFeaturedArticle();
  const categories = getArticleCategories();
  const articles = getListedArticles();

  const categoryLabels = Object.fromEntries(
    categories.map((id) => [id, t(`categories.${id}`)]),
  ) as Record<JournalCategoryId, string>;

  const imageAvailability = Object.fromEntries(
    articles.map((article) => [article.id, publicAssetExists(article.image.src)]),
  );

  return (
    <div className="journal-page">
      <div className="site-container">
        <header className="journal-intro">
          <p className="journal-eyebrow type-label">{t('eyebrow')}</p>
          <h1 className="journal-headline type-h1">{t('headline')}</h1>
          <p className="journal-lede type-body-lg">{t('intro')}</p>
        </header>

        <JournalBrowser
          locale={resolvedLocale}
          articles={articles}
          featuredId={featuredArticle?.id}
          initialQuery={q}
          category={category}
          categories={categories}
          categoryLabels={categoryLabels}
          searchLabel={t('searchLabel')}
          searchPlaceholder={t('searchPlaceholder')}
          searchSubmit={t('searchSubmit')}
          filtersLabel={t('filtersLabel')}
          allLabel={t('allCategories')}
          readLabel={t('readArticle')}
          datePending={t('datePending')}
          emptyLabel={t('empty')}
          emptyActionLabel={t('emptyAction')}
          imageAvailability={imageAvailability}
        />
      </div>
    </div>
  );
}
