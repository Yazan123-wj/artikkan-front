'use client';

import { useMemo, useState } from 'react';
import { JournalArticleCard } from '@/components/journal/journal-article-card';
import { JournalFeatured } from '@/components/journal/journal-featured';
import { JournalFilters } from '@/components/journal/journal-filters';
import { JournalReveal } from '@/components/journal/journal-reveal';
import { LocalizedLink } from '@/components/shared/localized-link';
import type { AppLocale } from '@/i18n/routing';
import { filterArticles, formatArticleDate } from '@/lib/journal';
import type { JournalArticle, JournalCategoryId } from '@/types/journal';

type JournalBrowserProps = {
  locale: AppLocale;
  articles: readonly JournalArticle[];
  featuredId?: string;
  initialQuery: string;
  category: string;
  categories: readonly JournalCategoryId[];
  categoryLabels: Record<JournalCategoryId, string>;
  searchLabel: string;
  searchPlaceholder: string;
  searchSubmit: string;
  filtersLabel: string;
  allLabel: string;
  readLabel: string;
  datePending: string;
  emptyLabel: string;
  emptyActionLabel: string;
  imageAvailability: Record<string, boolean>;
};

export function JournalBrowser({
  locale,
  articles,
  featuredId,
  initialQuery,
  category,
  categories,
  categoryLabels,
  searchLabel,
  searchPlaceholder,
  searchSubmit,
  filtersLabel,
  allLabel,
  readLabel,
  datePending,
  emptyLabel,
  emptyActionLabel,
  imageAvailability,
}: JournalBrowserProps) {
  const [query, setQuery] = useState(initialQuery);

  const matches = useMemo(
    () => filterArticles(articles, locale, query, category),
    [articles, locale, query, category],
  );

  const showFeatured = !query.trim() && category === 'all';
  const featured = showFeatured
    ? matches.find((article) => article.id === featuredId)
    : undefined;
  const gridItems = featured
    ? matches.filter((article) => article.id !== featured.id)
    : matches;

  return (
    <>
      {featured ? (
        <JournalFeatured
          article={featured}
          locale={locale}
          categoryLabel={categoryLabels[featured.categoryId]}
          dateLabel={formatArticleDate(featured.publishedAt, locale, datePending)}
          readLabel={readLabel}
          draftLabel=""
          imageAvailable={Boolean(imageAvailability[featured.id])}
        />
      ) : null}

      <JournalFilters
        query={query}
        category={category}
        categories={categories}
        searchLabel={searchLabel}
        searchPlaceholder={searchPlaceholder}
        searchSubmit={searchSubmit}
        filtersLabel={filtersLabel}
        allLabel={allLabel}
        categoryLabels={categoryLabels}
        onQueryChange={setQuery}
      />

      <JournalReveal key={`${query}-${category}`}>
        {gridItems.length === 0 ? (
          <div className="journal-empty">
            <p>{emptyLabel}</p>
            <LocalizedLink href="/journal" className="journal-reset">
              {emptyActionLabel}
            </LocalizedLink>
          </div>
        ) : (
          <div className="journal-grid">
            {gridItems.map((article) => (
              <JournalArticleCard
                key={article.id}
                article={article}
                locale={locale}
                categoryLabel={categoryLabels[article.categoryId]}
                dateLabel={formatArticleDate(
                  article.publishedAt,
                  locale,
                  datePending,
                )}
                readLabel={readLabel}
                draftLabel=""
                imageAvailable={Boolean(imageAvailability[article.id])}
              />
            ))}
          </div>
        )}
      </JournalReveal>
    </>
  );
}
