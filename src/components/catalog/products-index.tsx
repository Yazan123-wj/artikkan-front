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
  productListHref,
} from '@/lib/catalog';
import { getSubcategoriesForCategory } from '@/config/subcategories';
import { productPieceKey } from '@/lib/product-messages';
import type { FeaturedProductNameKey } from '@/types/product';

type ProductsIndexProps = {
  locale: string;
  searchParams: {
    q?: string | string[];
    category?: string | string[];
    sub?: string | string[];
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
  const { q, category, sub } = parseProductSearchParams(searchParams);
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

  const subcategoryLabels = Object.fromEntries(
    getCatalogProducts().flatMap((product) =>
      product.subKey ? [[product.subKey, t(`subs.${product.subKey}`)]] : [],
    ),
  ) as Record<string, string>;

  const matches = filterProducts(
    getCatalogProducts(),
    resolvedLocale,
    { ...names, ...categoryLabels, ...subcategoryLabels },
    '',
    category,
    sub,
  );

  const items = matches.map((product) => ({
    product,
    name: tProducts(productPieceKey(product.nameKey, 'name')),
    category: tCategories(product.categoryKey),
    subcategory: product.subKey ? t(`subs.${product.subKey}`) : undefined,
    imageAlt: tProducts(productPieceKey(product.nameKey, 'alt')),
    imageAvailable: publicAssetExists(product.image.src),
  }));

  const headlineLines = activeCategory
    ? [categoryLabels[activeCategory] ?? activeCategory]
    : (t.raw('headlineLines') as readonly string[]);
  const intro = activeCategory
    ? tCategoryCopy(`ledes.${activeCategory}`)
    : t('intro');

  const subcategoryIds = activeCategory
    ? getSubcategoriesForCategory(activeCategory)
    : [];
  const filterItems = activeCategory
    ? subcategoryIds.map((id) => ({
        id,
        href: productListHref({ category: activeCategory, sub: id }),
        label: t(`subs.${id}`),
      }))
    : featuredCategories.map((item) => ({
        id: item.id,
        href: productListHref({ category: item.id }),
        label: categoryLabels[item.id] ?? item.id,
      }));

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
        filterItems={filterItems}
        activeFilterId={activeCategory ? sub : category}
        allHref={
          activeCategory
            ? productListHref({ category: activeCategory })
            : productListHref({})
        }
        searchLabel={t('searchLabel')}
        searchPlaceholder={t('searchPlaceholder')}
        searchSubmit={t('searchSubmit')}
        filtersLabel={activeCategory ? t('filtersSubLabel') : t('filtersLabel')}
        allLabel={t('allCategories')}
        viewDetailsLabel={t('viewDetails')}
        emptyLabel={t('empty')}
        emptyActionLabel={t('emptyAction')}
      />
    </div>
  );
}
