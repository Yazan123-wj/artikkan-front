import type { LocalizedImage, LocalizedString } from './common';

export type Product = {
  slug: string;
  title: LocalizedString;
  excerpt?: LocalizedString;
  image?: LocalizedImage;
};

export type FeaturedProductImage = {
  src: string;
  width: number;
  height: number;
  fit: 'cover' | 'contain';
  objectPosition?: string;
  objectPositionRtl?: string;
};

export type FeaturedProductNameKey = string;
export type FeaturedProductCategoryKey =
  | 'seating'
  | 'tables'
  | 'unit-cabinets'
  | 'home-decor'
  | 'accessories';

export type FeaturedProduct = {
  id: string;
  slug: string;
  nameKey: FeaturedProductNameKey;
  categoryKey: FeaturedProductCategoryKey;
  image: FeaturedProductImage;
  hoverImage?: FeaturedProductImage;
  reference?: string;
};
