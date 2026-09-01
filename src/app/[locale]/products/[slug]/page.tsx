import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { ProductDetailContent } from '@/components/catalog/product-detail-content';
import { catalogProducts } from '@/config/products';
import { routing, type AppLocale } from '@/i18n/routing';
import { getProductBySlug } from '@/lib/catalog';
import { createPageMetadata } from '@/lib/metadata';
import { productPieceKey } from '@/lib/product-messages';

type ProductSlugPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  return catalogProducts.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: ProductSlugPageProps) {
  const { locale, slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const resolvedLocale: AppLocale = hasLocale(routing.locales, locale)
    ? locale
    : routing.defaultLocale;
  const tProducts = await getTranslations({
    locale: resolvedLocale,
    namespace: 'home.products',
  });
  const title = tProducts(productPieceKey(product.nameKey, 'name'));

  return createPageMetadata({
    locale: resolvedLocale,
    pathname: `/products/${product.slug}`,
    titleKey: 'products',
    title,
    ogImage: product.image.src,
  });
}

export default async function ProductSlugPage({ params }: ProductSlugPageProps) {
  const { locale, slug } = await params;
  const resolvedLocale: AppLocale = hasLocale(routing.locales, locale)
    ? locale
    : routing.defaultLocale;
  setRequestLocale(resolvedLocale);

  const product = getProductBySlug(slug);
  if (!product) {
    notFound();
  }

  return <ProductDetailContent product={product} />;
}
