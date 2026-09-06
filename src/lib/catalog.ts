import { featuredCategories } from '@/config/home-content';
import {
  getApprovedStillId,
  getProductCardImage,
  withApprovedProductImage,
} from '@/config/product-card-images';
import { catalogProducts, featuredProducts } from '@/config/products';
import {
  PRODUCT_SUBCATEGORY_IDS,
  categorySubcategories,
  productSubKeyById,
} from '@/config/subcategories';
import type { AppLocale } from '@/i18n/routing';
import { publicAssetExists } from '@/lib/assets';
import type {
  FeaturedProduct,
  FeaturedProductCategoryKey,
  FeaturedProductImage,
  ProductSubcategoryId,
} from '@/types/product';

export const PRODUCT_PAGE_SIZE = 12;

export const PRODUCT_CATEGORY_IDS = featuredCategories.map(
  (category) => category.id,
);

export const PRODUCT_SORTS = ['featured', 'name'] as const;

export type ProductSort = (typeof PRODUCT_SORTS)[number];
export type ProductCategoryId = (typeof PRODUCT_CATEGORY_IDS)[number];

export { catalogProducts, featuredProducts, featuredCategories };

function withSubKey(product: FeaturedProduct): FeaturedProduct {
  const withImage = withApprovedProductImage(product);
  const subKey = productSubKeyById[product.id];
  return subKey ? { ...withImage, subKey } : withImage;
}

export function getCatalogProducts(): readonly FeaturedProduct[] {
  return catalogProducts.map(withSubKey);
}

export function getProductBySlug(slug: string): FeaturedProduct | undefined {
  const product = catalogProducts.find((item) => item.slug === slug);
  return product ? withSubKey(product) : undefined;
}

function pushImage(
  list: FeaturedProductImage[],
  seen: Set<string>,
  image: FeaturedProductImage | undefined,
) {
  if (!image || seen.has(image.src) || !publicAssetExists(image.src)) {
    return;
  }

  seen.add(image.src);
  list.push(image);
}

function productFamilyKey(id: string): string {
  return id
    .replace(/-(wp|wv)$/i, '')
    .replace(/-([a-z])$/i, '')
    .replace(/(\d+)[a-z]$/i, '$1');
}

/** Primary still plus extra views, family variants, and numbered stills on disk. */
export function getProductImages(
  product: FeaturedProduct,
): FeaturedProductImage[] {
  const images: FeaturedProductImage[] = [];
  const seen = new Set<string>();
  const family = productFamilyKey(product.id);

  const display = getProductCardImage(product);
  const stillId = getApprovedStillId(product.id);

  pushImage(images, seen, display);

  for (const sibling of catalogProducts) {
    if (sibling.id === product.id) {
      continue;
    }
    if (productFamilyKey(sibling.id) !== family) {
      continue;
    }
    const siblingStill = getApprovedStillId(sibling.id);
    if (siblingStill === sibling.id) {
      pushImage(images, seen, getProductCardImage(sibling));
    }
  }

  for (let index = 2; index <= 3; index += 1) {
    pushImage(images, seen, {
      ...display,
      src: `/images/catalog/products/${stillId}-${index}.jpg`,
    });
  }

  return images;
}

export function isProductCategoryId(
  value: string,
): value is ProductCategoryId {
  return PRODUCT_CATEGORY_IDS.includes(value as ProductCategoryId);
}

export function getRelatedProducts(
  product: FeaturedProduct,
  limit = 3,
): FeaturedProduct[] {
  return getCatalogProducts()
    .filter(
      (item) =>
        item.id !== product.id && item.categoryKey === product.categoryKey,
    )
    .slice(0, limit);
}

export function isProductSubcategoryId(
  value: string,
): value is ProductSubcategoryId {
  return PRODUCT_SUBCATEGORY_IDS.includes(value as ProductSubcategoryId);
}

export function subcategoryBelongsToCategory(
  sub: string,
  category: string,
): sub is ProductSubcategoryId {
  return (
    isProductCategoryId(category) &&
    categorySubcategories[category].includes(sub as ProductSubcategoryId)
  );
}

export function productMatchesCategory(
  product: FeaturedProduct,
  category: string | undefined,
): boolean {
  if (!category || category === 'all') {
    return true;
  }

  return product.categoryKey === category;
}

export function productMatchesSubcategory(
  product: FeaturedProduct,
  subcategory: string | undefined,
): boolean {
  if (!subcategory || subcategory === 'all') {
    return true;
  }

  return product.subKey === subcategory;
}

export function filterProducts(
  products: readonly FeaturedProduct[],
  locale: AppLocale,
  names: Record<string, string>,
  query: string,
  category: string | undefined,
  subcategory?: string,
): FeaturedProduct[] {
  const needle = query.trim().toLowerCase();
  const categoryId =
    category && isProductCategoryId(category) ? category : undefined;
  const subcategoryId =
    categoryId && subcategory && subcategoryBelongsToCategory(subcategory, categoryId)
      ? subcategory
      : undefined;

  return products.filter((product) => {
    if (categoryId && product.categoryKey !== categoryId) {
      return false;
    }

    if (subcategoryId && product.subKey !== subcategoryId) {
      return false;
    }

    if (!needle) {
      return true;
    }

    const name = names[product.nameKey] ?? product.slug;
    const categoryLabel = names[product.categoryKey] ?? product.categoryKey;
    const subLabel = product.subKey ? (names[product.subKey] ?? product.subKey) : '';

    return (
      name.toLowerCase().includes(needle) ||
      categoryLabel.toLowerCase().includes(needle) ||
      subLabel.toLowerCase().includes(needle) ||
      product.slug.toLowerCase().includes(needle)
    );
  });
}

export function sortProducts(
  products: readonly FeaturedProduct[],
  names: Record<string, string>,
  locale: AppLocale,
  sort: ProductSort,
): FeaturedProduct[] {
  const items = [...products];

  if (sort === 'name') {
    const collator = new Intl.Collator(locale === 'ar' ? 'ar' : 'en', {
      sensitivity: 'base',
    });
    items.sort((a, b) =>
      collator.compare(names[a.nameKey] ?? a.slug, names[b.nameKey] ?? b.slug),
    );
  }

  return items;
}

export function paginateProducts(
  products: readonly FeaturedProduct[],
  page: number,
  pageSize = PRODUCT_PAGE_SIZE,
) {
  const total = products.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const start = (currentPage - 1) * pageSize;

  return {
    items: products.slice(start, start + pageSize),
    currentPage,
    totalPages,
    total,
  };
}

export function parseProductSearchParams(searchParams: {
  q?: string | string[];
  category?: string | string[];
  sub?: string | string[];
  sort?: string | string[];
  page?: string | string[];
}) {
  const first = (value?: string | string[]) =>
    Array.isArray(value) ? value[0] : value;

  const q = first(searchParams.q)?.trim() ?? '';
  const categoryRaw = first(searchParams.category)?.trim() || 'all';
  const category = isProductCategoryId(categoryRaw) ? categoryRaw : 'all';
  const subRaw = first(searchParams.sub)?.trim() || 'all';
  const sort = first(searchParams.sort)?.trim() || 'featured';
  const page = Number.parseInt(first(searchParams.page) ?? '1', 10);

  return {
    q,
    category,
    sub:
      category !== 'all' && subcategoryBelongsToCategory(subRaw, category)
        ? subRaw
        : 'all',
    sort: PRODUCT_SORTS.includes(sort as ProductSort)
      ? (sort as ProductSort)
      : 'featured',
    page: Number.isFinite(page) ? page : 1,
  };
}

export function productListHref(input: {
  q?: string;
  category?: string;
  sub?: string;
  sort?: string;
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
  if (
    input.category &&
    input.category !== 'all' &&
    input.sub &&
    input.sub !== 'all'
  ) {
    params.set('sub', input.sub);
  }
  if (input.sort && input.sort !== 'featured') {
    params.set('sort', input.sort);
  }
  if (input.page && input.page > 1) {
    params.set('page', String(input.page));
  }
  const query = params.toString();
  return query ? `/products?${query}` : '/products';
}

export function categoryProductsHref(categoryId: string): string {
  return productListHref({ category: categoryId });
}

export type { FeaturedProductCategoryKey, ProductSubcategoryId };
