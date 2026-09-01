import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ProductsIndex } from '@/components/catalog/products-index';
import { featuredCategories } from '@/config/home-content';
import { routing, type AppLocale } from '@/i18n/routing';
import { isProductCategoryId, parseProductSearchParams } from '@/lib/catalog';
import { createPageMetadata } from '@/lib/metadata';

type ProductsPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    q?: string | string[];
    category?: string | string[];
    sort?: string | string[];
    page?: string | string[];
  }>;
};

export async function generateMetadata({ params, searchParams }: ProductsPageProps) {
  const { locale } = await params;
  const resolvedLocale: AppLocale = hasLocale(routing.locales, locale)
    ? locale
    : routing.defaultLocale;
  const { category } = parseProductSearchParams(await searchParams);

  if (isProductCategoryId(category)) {
    const tCategories = await getTranslations({
      locale: resolvedLocale,
      namespace: 'home.categories',
    });
    const match = featuredCategories.find((item) => item.id === category);
    const title = match ? tCategories(match.labelKey) : category;

    return createPageMetadata({
      locale: resolvedLocale,
      pathname: `/products?category=${category}`,
      titleKey: 'products',
      title,
    });
  }

  return createPageMetadata({
    locale: resolvedLocale,
    pathname: '/products',
    titleKey: 'products',
  });
}

export default async function ProductsPage({
  params,
  searchParams,
}: ProductsPageProps) {
  const { locale } = await params;
  const resolvedLocale: AppLocale = hasLocale(routing.locales, locale)
    ? locale
    : routing.defaultLocale;
  setRequestLocale(resolvedLocale);

  return (
    <ProductsIndex locale={resolvedLocale} searchParams={await searchParams} />
  );
}
