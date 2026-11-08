import type { LiveArticle } from '@/lib/live-catalog';
import { liveMedia } from '@/lib/live-catalog';
import type { JournalArticle } from '@/types/journal';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? '';

export type LiveLocalized = { en: string; ar: string };

export type LiveSite = {
  hero: { poster: string; videoDesktop: string; videoMobile: string };
  stats: {
    id: string;
    value: number;
    prefix: string;
    suffix: string;
    label: LiveLocalized;
  }[];
  homeAbout: { image: string; title: LiveLocalized; body: LiveLocalized };
  promoBanners: {
    id: string;
    image: string;
    title: LiveLocalized;
    href: string;
    enabled: boolean;
  }[];
  selectedViews: { id: string; image: string; label: LiveLocalized }[];
  homepageCollaboratorIds: string[];
  about: {
    eyebrow: LiveLocalized;
    headline: LiveLocalized;
    intro: LiveLocalized;
    leadImage: string;
    quote: LiveLocalized;
    quoteImage: string;
    values: { id: string; title: LiveLocalized; note: LiveLocalized; image: string }[];
    journey: { id: string; title: LiveLocalized; body: LiveLocalized }[];
    differentTitle: LiveLocalized;
    differentLead: LiveLocalized;
    founders: {
      id: string;
      name: LiveLocalized;
      role: LiveLocalized;
      words: LiveLocalized;
      image: string;
    }[];
  };
  footer: {
    email: string;
    phone: string;
    address: LiveLocalized;
    hours: LiveLocalized;
    instagram: string;
    facebook: string;
  };
  legal: {
    privacyTitle: LiveLocalized;
    privacyBody: LiveLocalized;
    termsTitle: LiveLocalized;
    termsBody: LiveLocalized;
  };
  journalCategories: { slug: string; name: LiveLocalized }[];
};

export async function fetchLiveSite(): Promise<LiveSite | null> {
  if (!API_URL) return null;
  try {
    const response = await fetch(`${API_URL}/catalog/site`, {
      cache: 'no-store',
    });
    if (!response.ok) return null;
    const data = (await response.json()) as { site?: LiveSite };
    return data.site ?? null;
  } catch {
    return null;
  }
}

export function liveCopy(value: LiveLocalized | undefined, locale: string) {
  if (!value) return '';
  return (locale === 'ar' ? value.ar : value.en) || value.en || value.ar || '';
}

export function liveArticleToJournal(article: LiveArticle): JournalArticle {
  const title = {
    en: article.title.en ?? '',
    ar: article.title.ar ?? article.title.en ?? '',
  };
  const excerpt = {
    en: article.excerpt.en ?? '',
    ar: article.excerpt.ar ?? '',
  };
  const body = {
    en: article.body.en ?? '',
    ar: article.body.ar ?? '',
  };
  const imageSrc = article.imageSrc ? liveMedia(article.imageSrc) : '';
  return {
    id: article.id,
    slug: {
      en: article.slug.en ?? article.id,
      ar: article.slug.ar ?? article.slug.en ?? article.id,
    },
    title,
    excerpt,
    intro: excerpt,
    categoryId: article.category,
    status: article.status === 'published' ? 'published' : 'draft',
    featured: article.featured,
    publishedAt: article.publishedAt,
    image: {
      src: imageSrc || '/images/home/artikkan-about.jpg',
      width: 1600,
      height: 1066,
    },
    imageAlt: title,
    blocks: body.en || body.ar
      ? [{ type: 'paragraph', parts: [{ text: body }] }]
      : [],
  };
}
