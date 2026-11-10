import { journalArticles } from '@/config/journal';
import { siteConfig } from '@/config/site';
import { getSiteUrl } from '@/lib/constants';
import type { JournalArticle } from '@/types/journal';
import type { LocalizedString } from '@/types/common';
import type { AppLocale } from '@/i18n/routing';

export const JOURNAL_PAGE_SIZE = 12;

export const JOURNAL_CATEGORY_IDS = ['design', 'materials', 'craft'] as const;

export { journalArticles };

export function loc(
  value: LocalizedString | { en?: string | null; ar?: string | null } | null | undefined,
  locale: string,
  options: { fallback?: boolean } = {},
): string {
  if (!value) return '';
  const fallback = options.fallback !== false;
  const primary = (locale === 'ar' ? value.ar : value.en)?.trim();
  if (primary) return primary;
  if (!fallback) return '';
  return (value.en || value.ar || '').trim();
}

export function hasLocaleCopy(
  value: LocalizedString | { en?: string | null; ar?: string | null } | null | undefined,
  locale: string,
) {
  const primary = locale === 'ar' ? value?.ar : value?.en;
  return Boolean(primary && primary.trim());
}

export function getArticleSlug(
  article: JournalArticle,
  locale: string,
): string {
  return loc(article.slug, locale);
}

export function decodeJournalSlug(slug: string): string {
  let decoded = slug;

  try {
    decoded = decodeURIComponent(slug);
  } catch {
    decoded = slug;
  }

  return decoded.normalize('NFC');
}

export function findArticleBySlug(slug: string): JournalArticle | undefined {
  const decoded = decodeJournalSlug(slug);

  return journalArticles.find((article) => {
    const english = article.slug.en.normalize('NFC');
    const arabic = article.slug.ar.normalize('NFC');
    return (
      english === decoded ||
      arabic === decoded ||
      article.slug.en === slug ||
      article.slug.ar === slug
    );
  });
}

export function getListedArticles(): readonly JournalArticle[] {
  return journalArticles;
}

export function isPublishedArticle(article: JournalArticle): boolean {
  return article.status === 'published' && Boolean(article.publishedAt);
}

/**
 * Featured split layout — prefers the article marked `featured`.
 */
export function getFeaturedArticle(): JournalArticle | undefined {
  return journalArticles.find((article) => article.featured);
}

export function getArticleCategories(): readonly JournalArticle['categoryId'][] {
  return [...new Set(journalArticles.map((article) => article.categoryId))];
}

export function filterArticles(
  articles: readonly JournalArticle[],
  locale: AppLocale,
  query: string,
  category: string | undefined,
): JournalArticle[] {
  const needle = query.trim().toLowerCase();
  const normalizedCategory =
    category && category !== 'all' ? category.trim().toLowerCase() : undefined;

  return articles.filter((article) => {
    if (!loc(article.title, locale)) {
      return false;
    }

    if (
      normalizedCategory &&
      (article.categoryId ?? '').trim().toLowerCase() !== normalizedCategory
    ) {
      return false;
    }

    if (!needle) {
      return true;
    }

    return (
      loc(article.title, locale).toLowerCase().includes(needle) ||
      loc(article.excerpt, locale).toLowerCase().includes(needle)
    );
  });
}

/**
 * Featured hero is only for the unfiltered listing. Category/search results
 * always keep every match in the grid — including the featured article.
 */
export function partitionJournalList(
  articles: readonly JournalArticle[],
  locale: AppLocale,
  query: string,
  category: string | undefined,
  featuredId?: string,
): { featured?: JournalArticle; gridItems: JournalArticle[] } {
  const matches = filterArticles(articles, locale, query, category);
  const showHero = !query.trim() && (!category || category === 'all');
  const featured = showHero
    ? (matches.find((article) => article.id === featuredId) ??
      matches.find((article) => article.featured))
    : undefined;

  return {
    featured,
    gridItems: featured
      ? matches.filter((article) => article.id !== featured.id)
      : matches,
  };
}

export function paginateArticles(
  articles: readonly JournalArticle[],
  page: number,
  pageSize = JOURNAL_PAGE_SIZE,
) {
  const total = articles.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const start = (currentPage - 1) * pageSize;

  return {
    items: articles.slice(start, start + pageSize),
    currentPage,
    totalPages,
    total,
  };
}

export function parseJournalSearchParams(searchParams: {
  q?: string | string[];
  category?: string | string[];
  page?: string | string[];
}) {
  const first = (value?: string | string[]) =>
    Array.isArray(value) ? value[0] : value;

  const q = first(searchParams.q)?.trim() ?? '';
  const category = first(searchParams.category)?.trim() || 'all';
  const page = Number.parseInt(first(searchParams.page) ?? '1', 10);

  return {
    q,
    category: category || 'all',
    page: Number.isFinite(page) ? page : 1,
  };
}

export function isSafeHref(href: string): boolean {
  return href.startsWith('/') || href.startsWith('https://');
}

export function formatArticleDate(
  publishedAt: string | null,
  locale: string,
  pendingLabel: string,
): string {
  if (!publishedAt) {
    return pendingLabel;
  }

  return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-QA' : 'en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: siteConfig.timeZone,
  }).format(new Date(publishedAt));
}

export function getArticlePath(article: JournalArticle, locale: string): string {
  return `/journal/${getArticleSlug(article, locale)}`;
}

export function getArticleAbsoluteUrl(
  article: JournalArticle,
  locale: string,
): string {
  return `${getSiteUrl()}/${locale}${getArticlePath(article, locale)}`;
}

export function journalListHref(input: {
  q?: string;
  category?: string;
  page?: number;
}): string {
  const params = new URLSearchParams();
  const q = input.q?.trim();
  if (q) {
    params.set('q', q);
  }
  if (input.category && input.category !== 'all') {
    params.set('category', input.category);
  }
  if (input.page && input.page > 1) {
    params.set('page', String(input.page));
  }
  const query = params.toString();
  return query ? `/journal?${query}` : '/journal';
}
