import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ProductsBrowser } from '@/components/catalog/products-browser';
import { routing, type AppLocale } from '@/i18n/routing';
import { publicAssetExists } from '@/lib/assets';
import {
  featuredCategories,
  filterProducts,
  getCatalogProducts,
  isProductCategoryId,
  parseProductSearchParams,
} from '@/lib/catalog';
import { productPieceKey } from '@/lib/product-messages';
import type { FeaturedProductNameKey } from '@/types/product';

type ProductsIndexProps = {
  locale: string;
  searchParams: {
    q?: string | string[];
    category?: string | string[];
    sort?: string | string[];
    page?: string | string[];
  };
};

export async function ProductsIndex({ locale, searchParams }: ProductsIndexProps) {
  const resolvedLocale: AppLocale = hasLocale(routing.locales, locale)
    ? locale
    : routing.defaultLocale;
  setRequestLocale(resolvedLocale);

  const t = await getTranslations('productsPage');
  const tProducts = await getTranslations('home.products');
  const tCategories = await getTranslations('home.categories');
  const tCategoryCopy = await getTranslations('categoriesPage');
  const { q, category } = parseProductSearchParams(searchParams);
  const activeCategory = isProductCategoryId(category) ? category : null;

  const names = Object.fromEntries(
    getCatalogProducts().map((product) => [
      product.nameKey,
      tProducts(productPieceKey(product.nameKey, 'name')),
    ]),
  ) as Record<FeaturedProductNameKey, string>;

  const categoryLabels = Object.fromEntries(
    featuredCategories.map((item) => [item.id, tCategories(item.labelKey)]),
  );

  const matches = filterProducts(
    getCatalogProducts(),
    resolvedLocale,
    { ...names, ...categoryLabels },
    '',
    category,
  );

  const items = matches.map((product) => ({
    product,
    name: tProducts(productPieceKey(product.nameKey, 'name')),
    category: tCategories(product.categoryKey),
    imageAlt: tProducts(productPieceKey(product.nameKey, 'alt')),
    imageAvailable: publicAssetExists(product.image.src),
  }));

  const headlineLines = activeCategory
    ? [categoryLabels[activeCategory] ?? activeCategory]
    : (t.raw('headlineLines') as readonly string[]);
  const intro = activeCategory
    ? tCategoryCopy(`ledes.${activeCategory}`)
    : t('intro');

  return (
    <div className="products-page">
      <ProductsBrowser
        eyebrow={activeCategory ? t('categoryEyebrow') : t('eyebrow')}
        headlineLines={headlineLines}
        intro={intro}
        collectionsHref={activeCategory ? '/categories' : undefined}
        collectionsLabel={activeCategory ? t('allCollections') : undefined}
        items={items}
        initialQuery={q}
        category={category}
        categories={featuredCategories.map((item) => item.id)}
        categoryLabels={categoryLabels}
        searchLabel={t('searchLabel')}
        searchPlaceholder={t('searchPlaceholder')}
        searchSubmit={t('searchSubmit')}
        filtersLabel={t('filtersLabel')}
        allLabel={t('allCategories')}
        viewDetailsLabel={t('viewDetails')}
        emptyLabel={t('empty')}
        emptyActionLabel={t('emptyAction')}
      />
    </div>
  );
}
