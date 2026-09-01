import { getTranslations } from 'next-intl/server';
import { JournalArticleCard } from '@/components/journal/journal-article-card';
import { JournalFeatured } from '@/components/journal/journal-featured';
import { JournalReveal } from '@/components/journal/journal-reveal';
import { LocalizedLink } from '@/components/shared/localized-link';
import { formatArticleDate, getHomeJournalPreview } from '@/lib/journal';
import type { JournalCategoryId } from '@/types/journal';

type HomeJournalSectionProps = {
  locale: string;
  imageAvailability: Record<string, boolean>;
};

export async function HomeJournalSection({
  locale,
  imageAvailability,
}: HomeJournalSectionProps) {
  const t = await getTranslations('journal');
  const tHome = await getTranslations('home.journal');
  const { featured, articles } = getHomeJournalPreview();

  const categoryLabel = (id: JournalCategoryId) => t(`categories.${id}`);

  return (
    <section className="home-journal-section" aria-labelledby="home-journal-heading">
      <div className="site-container">
        <header className="home-journal-header">
          <p className="home-journal-eyebrow type-label">{tHome('eyebrow')}</p>
          <div className="home-journal-heading-row">
            <h2 id="home-journal-heading" className="home-journal-headline type-h2">
              {tHome('headline')}
            </h2>
            <LocalizedLink href="/journal" className="home-journal-cta touch-target">
              <span className="home-journal-cta-label">{t('viewJournal')}</span>
              <span className="home-journal-cta-arrow" aria-hidden="true">
                <svg viewBox="0 0 28 12" fill="none">
                  <path d="M0 6h26M21.5 1.5 27 6l-5.5 4.5" />
                </svg>
              </span>
            </LocalizedLink>
          </div>
          <p className="home-journal-intro type-body">{tHome('intro')}</p>
        </header>

        <JournalReveal>
          {featured ? (
            <JournalFeatured
              article={featured}
              locale={locale}
              categoryLabel={categoryLabel(featured.categoryId)}
              dateLabel={formatArticleDate(
                featured.publishedAt,
                locale,
                t('datePending'),
              )}
              readLabel={t('readArticle')}
              draftLabel={t('draftLabel')}
              imageAvailable={Boolean(imageAvailability[featured.id])}
              priority={false}
              titleLevel={3}
            />
          ) : null}

          {articles.length > 0 ? (
            <div className="journal-grid">
              {articles.map((article) => (
                <JournalArticleCard
                  key={article.id}
                  article={article}
                  locale={locale}
                  categoryLabel={categoryLabel(article.categoryId)}
                  dateLabel={formatArticleDate(
                    article.publishedAt,
                    locale,
                    t('datePending'),
                  )}
                  readLabel={t('readArticle')}
                  draftLabel={t('draftLabel')}
                  imageAvailable={Boolean(imageAvailability[article.id])}
                />
              ))}
            </div>
          ) : null}
        </JournalReveal>
      </div>
    </section>
  );
}
