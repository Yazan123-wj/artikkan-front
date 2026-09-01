import type { LocalizedString } from './common';

export type JournalCategoryId = 'design' | 'materials' | 'craft';

export type JournalArticleStatus = 'draft' | 'published';

export type JournalArticleImage = {
  src: string;
  width: number;
  height: number;
  objectPosition?: string;
  objectPositionRtl?: string;
};

export type JournalInlinePart = {
  text: LocalizedString;
  href?: string;
};

export type JournalBlock =
  | { type: 'heading'; level: 2 | 3; text: LocalizedString }
  | { type: 'paragraph'; parts: readonly JournalInlinePart[] }
  | { type: 'list'; ordered?: boolean; items: readonly LocalizedString[] }
  | {
      type: 'figure';
      image: JournalArticleImage;
      alt: LocalizedString;
      caption?: LocalizedString;
    };

export type JournalArticle = {
  id: string;
  slug: LocalizedString;
  title: LocalizedString;
  excerpt: LocalizedString;
  intro: LocalizedString;
  categoryId: JournalCategoryId;
  status: JournalArticleStatus;
  featured?: boolean;
  /** ISO date. Null until Artikkan confirms publication. */
  publishedAt: string | null;
  image: JournalArticleImage;
  imageAlt: LocalizedString;
  blocks: readonly JournalBlock[];
};

/** @deprecated Use JournalArticle. Kept for existing imports. */
export type JournalEntry = {
  slug: string;
  title: LocalizedString;
  excerpt?: LocalizedString;
  image?: import('./common').LocalizedImage;
};
