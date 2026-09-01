import Image from 'next/image';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { JournalArticleBody } from '@/components/journal/journal-article-body';
import { JournalReveal } from '@/components/journal/journal-reveal';
import { JournalShare } from '@/components/journal/journal-share';
import { LocalizedLink } from '@/components/shared/localized-link';
import { routing, type AppLocale } from '@/i18n/routing';
import { publicAssetExists } from '@/lib/assets';
import { getSiteUrl } from '@/lib/constants';
import {
  findArticleBySlug,
  formatArticleDate,
  getArticleAbsoluteUrl,
  getArticlePath,
  isPublishedArticle,
  journalArticles,
  loc,
} from '@/lib/journal';
import { createPageMetadata } from '@/lib/metadata';

type JournalSlugPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  return journalArticles.flatMap((article) => [
    { slug: article.slug.en },
    { slug: article.slug.ar },
  ]);
}

export async function generateMetadata({ params }: JournalSlugPageProps) {
  const { locale, slug } = await params;
  const article = findArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const resolvedLocale: AppLocale = hasLocale(routing.locales, locale)
    ? locale
    : routing.defaultLocale;
  const title = loc(article.title, resolvedLocale);
  const description = loc(article.excerpt, resolvedLocale);

  return createPageMetadata({
    locale: resolvedLocale,
    pathname: getArticlePath(article, resolvedLocale),
    titleKey: 'journal',
    title,
    description,
    noIndex: !isPublishedArticle(article),
    ogType: 'article',
    ogImage: article.image.src,
    localePathnames: {
      en: getArticlePath(article, 'en'),
      ar: getArticlePath(article, 'ar'),
    },
  });
}

export default async function JournalSlugPage({ params }: JournalSlugPageProps) {
  const { locale, slug } = await params;
  const resolvedLocale: AppLocale = hasLocale(routing.locales, locale)
    ? locale
    : routing.defaultLocale;

  setRequestLocale(resolvedLocale);

  const article = findArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const t = await getTranslations('journal');
  const title = loc(article.title, resolvedLocale);
  const imageAvailable = publicAssetExists(article.image.src);
  const objectPosition =
    resolvedLocale === 'ar'
      ? (article.image.objectPositionRtl ?? article.image.objectPosition)
      : article.image.objectPosition;
  const published = isPublishedArticle(article);
  const articleUrl = getArticleAbsoluteUrl(article, resolvedLocale);
  const siteUrl = getSiteUrl();

  const jsonLd = published
    ? {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: title,
        description: loc(article.excerpt, resolvedLocale),
        datePublished: article.publishedAt,
        image: `${siteUrl}${article.image.src}`,
        inLanguage: resolvedLocale === 'ar' ? 'ar-QA' : 'en-QA',
        mainEntityOfPage: articleUrl,
        publisher: {
          '@type': 'Organization',
          name: 'Artikkan',
        },
      }
    : null;

  return (
    <article className="journal-article">
      {jsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      ) : null}
      <div className="site-container">
        <LocalizedLink href="/journal" className="journal-back">
          <span className="journal-back-arrow" aria-hidden="true">
            <svg viewBox="0 0 28 12" fill="none">
              <path d="M0 6h26M21.5 1.5 27 6l-5.5 4.5" />
            </svg>
          </span>
          {t('backToJournal')}
        </LocalizedLink>

        <JournalReveal>
          <header className="journal-article-header" data-journal-reveal>
            <p className="journal-meta">
              <span>{t(`categories.${article.categoryId}`)}</span>
              <span>
                {formatArticleDate(
                  article.publishedAt,
                  resolvedLocale,
                  t('datePending'),
                )}
              </span>
            </p>
            <h1 className="journal-article-title type-h1">{title}</h1>
            <p className="journal-article-intro type-body-lg">
              {loc(article.intro, resolvedLocale)}
            </p>
          </header>

          <div className="journal-lead" data-journal-reveal>
            {imageAvailable ? (
              <Image
                src={article.image.src}
                alt={loc(article.imageAlt, resolvedLocale)}
                fill
                sizes="(min-width: 1440px) 1440px, 100vw"
                quality={85}
                priority
                className="journal-lead-image"
                style={objectPosition ? { objectPosition } : undefined}
              />
            ) : (
              <span className="journal-pending" />
            )}
          </div>

          <div data-journal-reveal>
            <JournalArticleBody
              blocks={article.blocks}
              locale={resolvedLocale}
            />
          </div>

          <div data-journal-reveal>
            <JournalShare
              url={articleUrl}
              title={title}
              shareLabel={t('shareLabel')}
              whatsappLabel={t('shareWhatsapp')}
              linkedinLabel={t('shareLinkedin')}
              copyLabel={t('copyLink')}
              copiedLabel={t('copied')}
              copyFailedLabel={t('copyFailed')}
            />
          </div>
        </JournalReveal>
      </div>
    </article>
  );
}
