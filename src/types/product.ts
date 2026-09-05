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

export type ProductSubcategoryId =
  | 'sofa'
  | 'pouf'
  | 'chair'
  | 'bench'
  | 'console-table'
  | 'center-table'
  | 'dining-table'
  | 'side-table'
  | 'unit-cabinet'
  | 'display-shelf'
  | 'artwork'
  | 'mirror'
  | 'photo-frame'
  | 'book-stand'
  | 'planter'
  | 'serving-tray'
  | 'phone-holder'
  | 'mobkhar'
  | 'coasters'
  | 'candle-holder'
  | 'tissue-box'
  | 'container'
  | 'napkin-holder';

export type FeaturedProduct = {
  id: string;
  slug: string;
  nameKey: FeaturedProductNameKey;
  categoryKey: FeaturedProductCategoryKey;
  subKey?: ProductSubcategoryId;
  image: FeaturedProductImage;
  hoverImage?: FeaturedProductImage;
  reference?: string;
};
