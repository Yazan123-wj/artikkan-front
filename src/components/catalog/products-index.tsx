import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ProductsBrowser } from '@/components/catalog/products-browser';
import { routing, type AppLocale } from '@/i18n/routing';
import { getProductCardImage } from '@/config/product-card-images';
import { publicAssetExists } from '@/lib/assets';
import {
  featuredCategories,
  filterProducts,
  getCatalogProducts,
  isProductCategoryId,
  parseProductSearchParams,
  productListHref,
} from '@/lib/catalog';
import {
  fetchLiveCategories,
  fetchLiveProducts,
  liveName,
  toFeaturedProduct,
} from '@/lib/live-catalog';
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
  const liveProducts = await fetchLiveProducts();
  const liveCategories = await fetchLiveCategories();
  const activeCategory =
    category !== 'all' &&
    (liveCategories?.some((item) => item.slug === category) ||
      isProductCategoryId(category))
      ? category
      : null;
  const catalog =
    liveProducts && liveProducts.length > 0
      ? liveProducts.map(toFeaturedProduct)
      : getCatalogProducts();

  const names = Object.fromEntries(
    catalog.map((product) => {
      const live = liveProducts?.find((item) => item.slug === product.slug);
      return [
        product.nameKey,
        live
          ? liveName(live.name, resolvedLocale)
          : tProducts(productPieceKey(product.nameKey, 'name')),
      ];
    }),
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
    catalog,
    resolvedLocale,
    { ...names, ...categoryLabels, ...subcategoryLabels },
    '',
    category,
    sub,
  );

  const items = matches.map((product) => {
    const live = liveProducts?.find((item) => item.slug === product.slug);
    const name = live
      ? liveName(live.name, resolvedLocale)
      : tProducts(productPieceKey(product.nameKey, 'name'));
    const liveCategory = liveCategories?.find(
      (item) => item.slug === product.categoryKey,
    );
    const categoryLabel = liveCategory
      ? liveName(liveCategory.name, resolvedLocale)
      : isProductCategoryId(product.categoryKey)
        ? tCategories(product.categoryKey)
        : product.categoryKey;
    const liveSub = liveCategory?.subcategories.find(
      (item) => item.slug === product.subKey,
    );
    const cardSrc = getProductCardImage(product).src;
    return {
      product,
      name,
      category: categoryLabel,
      subcategory: liveSub
        ? liveName(liveSub.name, resolvedLocale)
        : product.subKey && isProductCategoryId(product.categoryKey)
          ? t(`subs.${product.subKey}`)
          : undefined,
      imageAlt: name,
      imageAvailable:
        cardSrc.startsWith('http') ||
        cardSrc.startsWith('/uploads/') ||
        publicAssetExists(cardSrc),
    };
  });

  const liveActive = liveCategories?.find((item) => item.slug === activeCategory);
  const headlineLines = activeCategory
    ? [
        liveActive
          ? liveName(liveActive.name, resolvedLocale)
          : (categoryLabels[activeCategory] ?? activeCategory),
      ]
    : (t.raw('headlineLines') as readonly string[]);
  const intro = activeCategory
    ? liveActive
      ? liveName(liveActive.lede, resolvedLocale) || t('intro')
      : isProductCategoryId(activeCategory)
        ? tCategoryCopy(`ledes.${activeCategory}`)
        : t('intro')
    : t('intro');

  const subcategoryIds = activeCategory
    ? liveActive
      ? liveActive.subcategories.map((item) => item.slug)
      : isProductCategoryId(activeCategory)
        ? getSubcategoriesForCategory(activeCategory)
        : []
    : [];
  const filterItems = activeCategory
    ? subcategoryIds.map((id) => {
        const liveSub = liveActive?.subcategories.find((item) => item.slug === id);
        return {
          id,
          href: productListHref({ category: activeCategory, sub: id }),
          label: liveSub
            ? liveName(liveSub.name, resolvedLocale)
            : t(`subs.${id}`),
        };
      })
    : (liveCategories && liveCategories.length > 0
        ? liveCategories
        : featuredCategories
      ).map((item) => {
        const slug = 'slug' in item ? item.slug : item.id;
        return {
          id: slug,
          href: productListHref({ category: slug }),
          label:
            'name' in item
              ? liveName(item.name, resolvedLocale)
              : (categoryLabels[item.id] ?? item.id),
        };
      });

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
