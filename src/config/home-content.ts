/**
 * Homepage About + Statistics + Categories + Gallery content sources.
 */

export type HomeStatistic = {
  id: string;
  value: number;
  prefix: string;
  suffix: string;
  labelKey: 'experience' | 'projects' | 'clients' | 'collections';
};

export const homeStatistics = [
  {
    id: 'experience',
    value: 18,
    prefix: '',
    suffix: '+',
    labelKey: 'experience',
  },
  {
    id: 'projects',
    value: 140,
    prefix: '',
    suffix: '+',
    labelKey: 'projects',
  },
  {
    id: 'clients',
    value: 90,
    prefix: '',
    suffix: '+',
    labelKey: 'clients',
  },
  {
    id: 'collections',
    value: 12,
    prefix: '',
    suffix: '',
    labelKey: 'collections',
  },
] as const satisfies readonly HomeStatistic[];

export const ABOUT_IMAGE = {
  src: '/images/home/artikkan-about.jpg',
  width: 767,
  height: 1024,
} as const;

export type FeaturedCategory = {
  id: string;
  href: string;
  image: string;
  labelKey:
    | 'seating'
    | 'tables'
    | 'unit-cabinets'
    | 'home-decor'
    | 'accessories';
  altKey:
    | 'seatingAlt'
    | 'tablesAlt'
    | 'unitCabinetsAlt'
    | 'homeDecorAlt'
    | 'accessoriesAlt';
};

/**
 * Homepage featured categories.
 * Photography: public/images/catalog/categories/{id}-hero.jpg
 */
export const featuredCategories = [
  {
    id: 'seating',
    href: '/products?category=seating',
    image: '/images/catalog/categories/seating-hero.jpg',
    labelKey: 'seating',
    altKey: 'seatingAlt',
  },
  {
    id: 'tables',
    href: '/products?category=tables',
    image: '/images/catalog/categories/tables-hero.jpg',
    labelKey: 'tables',
    altKey: 'tablesAlt',
  },
  {
    id: 'unit-cabinets',
    href: '/products?category=unit-cabinets',
    image: '/images/catalog/categories/unit-cabinets-hero.jpg',
    labelKey: 'unit-cabinets',
    altKey: 'unitCabinetsAlt',
  },
  {
    id: 'home-decor',
    href: '/products?category=home-decor',
    image: '/images/catalog/categories/home-decor-hero.jpg',
    labelKey: 'home-decor',
    altKey: 'homeDecorAlt',
  },
  {
    id: 'accessories',
    href: '/products?category=accessories',
    image: '/images/catalog/categories/accessories-hero.jpg',
    labelKey: 'accessories',
    altKey: 'accessoriesAlt',
  },
] as const satisfies readonly FeaturedCategory[];

export type HomeGalleryItem = {
  id: string;
  image: string;
  labelKey: 'lounge' | 'majlis' | 'living' | 'dining' | 'hallway' | 'console';
};

/**
 * Homepage circular gallery — strong catalogue stills.
 */
export const homeGalleryItems = [
  {
    id: 'lounge',
    image: '/images/catalog/products/artk-sof-01.jpg',
    labelKey: 'lounge',
  },
  {
    id: 'majlis',
    image: '/images/catalog/products/artk-sof-03.jpg',
    labelKey: 'majlis',
  },
  {
    id: 'living',
    image: '/images/catalog/products/artk-un-01.jpg',
    labelKey: 'living',
  },
  {
    id: 'dining',
    image: '/images/catalog/products/artk-dt-01.jpg',
    labelKey: 'dining',
  },
  {
    id: 'hallway',
    image: '/images/catalog/products/artk-shf-01.jpg',
    labelKey: 'hallway',
  },
  {
    id: 'console',
    image: '/images/catalog/products/artk-cot-02.jpg',
    labelKey: 'console',
  },
] as const satisfies readonly HomeGalleryItem[];
