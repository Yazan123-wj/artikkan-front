export type LocaleCode = 'en' | 'ar';

export type LocalizedString = Record<LocaleCode, string>;

export type LocalizedImage = {
  src: string;
  width: number;
  height: number;
  alt: LocalizedString;
  decorative?: boolean;
  sizes?: string;
  objectPosition?: string;
  objectPositionRtl?: string;
};

export type PageParams = {
  locale: string;
};

export type SlugPageParams = PageParams & {
  slug: string;
};
