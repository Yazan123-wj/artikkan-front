import { featuredCategories } from '@/config/home-content';
import { catalogProducts, featuredProducts } from '@/config/products';
import type { AppLocale } from '@/i18n/routing';
import type {
  FeaturedProduct,
  FeaturedProductCategoryKey,
} from '@/types/product';

export const PRODUCT_PAGE_SIZE = 12;

export const PRODUCT_CATEGORY_IDS = featuredCategories.map(
  (category) => category.id,
);

export const PRODUCT_SORTS = ['featured', 'name'] as const;

export type ProductSort = (typeof PRODUCT_SORTS)[number];
export type ProductCategoryId = (typeof PRODUCT_CATEGORY_IDS)[number];

export { catalogProducts, featuredProducts, featuredCategories };

export function getCatalogProducts(): readonly FeaturedProduct[] {
  return catalogProducts;
}

export function getProductBySlug(slug: string): FeaturedProduct | undefined {
  return catalogProducts.find((product) => product.slug === slug);
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
  return catalogProducts
    .filter(
      (item) =>
        item.id !== product.id && item.categoryKey === product.categoryKey,
    )
    .slice(0, limit);
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

export function filterProducts(
  products: readonly FeaturedProduct[],
  locale: AppLocale,
  names: Record<string, string>,
  query: string,
  category: string | undefined,
): FeaturedProduct[] {
  const needle = query.trim().toLowerCase();
  const categoryId =
    category && isProductCategoryId(category) ? category : undefined;

  return products.filter((product) => {
    if (categoryId && product.categoryKey !== categoryId) {
      return false;
    }

    if (!needle) {
      return true;
    }

    const name = names[product.nameKey] ?? product.slug;
    const categoryLabel = names[product.categoryKey] ?? product.categoryKey;

    return (
      name.toLowerCase().includes(needle) ||
      categoryLabel.toLowerCase().includes(needle) ||
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
  sort?: string | string[];
  page?: string | string[];
}) {
  const first = (value?: string | string[]) =>
    Array.isArray(value) ? value[0] : value;

  const q = first(searchParams.q)?.trim() ?? '';
  const category = first(searchParams.category)?.trim() || 'all';
  const sort = first(searchParams.sort)?.trim() || 'featured';
  const page = Number.parseInt(first(searchParams.page) ?? '1', 10);

  return {
    q,
    category: isProductCategoryId(category) ? category : 'all',
    sort: PRODUCT_SORTS.includes(sort as ProductSort)
      ? (sort as ProductSort)
      : 'featured',
    page: Number.isFinite(page) ? page : 1,
  };
}

export function productListHref(input: {
  q?: string;
  category?: string;
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

export type { FeaturedProductCategoryKey };
