import { journalArticles } from '@/config/journal';
import { siteConfig } from '@/config/site';
import { getSiteUrl } from '@/lib/constants';
import type { JournalArticle } from '@/types/journal';
import type { LocalizedString } from '@/types/common';
import type { AppLocale } from '@/i18n/routing';

export const JOURNAL_PAGE_SIZE = 12;

export const JOURNAL_CATEGORY_IDS = ['design', 'materials', 'craft'] as const;

export { journalArticles };

export function loc(value: LocalizedString, locale: string): string {
  return locale === 'ar' ? value.ar : value.en;
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

export function getHomeJournalPreview(limit = 3) {
  const featured = getFeaturedArticle();
  const articles = getListedArticles()
    .filter((article) => article.id !== featured?.id)
    .slice(0, limit);

  return { featured, articles };
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
  const categoryId =
    category && category !== 'all'
      ? JOURNAL_CATEGORY_IDS.find((id) => id === category)
      : undefined;

  return articles.filter((article) => {
    if (categoryId && article.categoryId !== categoryId) {
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
    category: JOURNAL_CATEGORY_IDS.includes(
      category as (typeof JOURNAL_CATEGORY_IDS)[number],
    )
      ? category
      : 'all',
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
