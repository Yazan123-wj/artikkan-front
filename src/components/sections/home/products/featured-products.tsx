'use client';

import { useRef } from 'react';
import { useTranslations } from 'next-intl';
import { ProductCard } from '@/components/sections/home/products/product-card';
import { LocalizedLink } from '@/components/shared/localized-link';
import { featuredProducts } from '@/config/products';
import { useGsapContext } from '@/hooks/use-gsap-context';
import { revealElements } from '@/lib/motion-timelines';
import type { FeaturedProductNameKey } from '@/types/product';
import { productPieceKey } from '@/lib/product-messages';

type FeaturedProductsProps = {
  imageAvailability: Record<string, boolean>;
  enquiryEmail: string | null;
  liveItems?: {
    product: import('@/types/product').FeaturedProduct;
    name: string;
    category: string;
  }[];
  copy?: {
    eyebrow: string;
    headline: string;
    intro: string;
    ctaLabel: string;
    ctaHref: string;
  };
  headingId?: string;
};

function pieceCopy(
  t: ReturnType<typeof useTranslations<'home.products'>>,
  nameKey: FeaturedProductNameKey,
  field: 'name' | 'alt',
) {
  return t(productPieceKey(nameKey, field));
}

export function FeaturedProducts({
  imageAvailability,
  enquiryEmail,
  liveItems,
  copy,
  headingId = 'home-products-heading',
}: FeaturedProductsProps) {
  const t = useTranslations('home.products');
  const tCategories = useTranslations('home.categories');
  const rootRef = useRef<HTMLElement>(null);

  const products = featuredProducts.filter(
    (product) => imageAvailability[product.id],
  );
  const cards =
    liveItems
      ? liveItems
      : products.map((product) => ({
          product,
          name: pieceCopy(t, product.nameKey, 'name'),
          category: tCategories(product.categoryKey),
        }));
  const eyebrow = copy?.eyebrow || t('eyebrow');
  const headline = copy?.headline || t('headline');
  const intro = copy?.intro || t('intro');
  const ctaLabel = copy?.ctaLabel || t('viewAll');
  const ctaHref = copy?.ctaHref || '/products';

  useGsapContext(() => {
    const root = rootRef.current;
    if (!root) {
      return;
    }

    const cards = root.querySelectorAll('[data-featured-product]');
    if (cards.length === 0) {
      return;
    }

    revealElements(cards, { trigger: root });
  }, rootRef);

  if (liveItems && liveItems.length === 0) {
    return null;
  }

  return (
    <section
      ref={rootRef}
      className="featured-products-section"
      aria-labelledby={headingId}
    >
      <div className="site-container">
        <header className="featured-products-header">
          <p className="featured-products-eyebrow type-label">{eyebrow}</p>
          <div className="featured-products-heading-row">
            <h2
              id={headingId}
              className="featured-products-headline type-h2"
            >
              {headline}
            </h2>
            <LocalizedLink
              href={ctaHref}
              className="featured-products-cta touch-target"
            >
              <span className="featured-products-cta-label">{ctaLabel}</span>
              <span className="featured-products-cta-arrow" aria-hidden="true">
                <svg viewBox="0 0 28 12" fill="none">
                  <path d="M0 6h26M21.5 1.5 27 6l-5.5 4.5" />
                </svg>
              </span>
            </LocalizedLink>
          </div>
          {intro ? <p className="featured-products-intro type-body">{intro}</p> : null}
        </header>

        {cards.length > 0 ? (
          <div className="featured-products-grid">
            {cards.map((item) => (
              <ProductCard
                key={item.product.id}
                product={item.product}
                name={item.name}
                category={item.category}
                imageAlt={item.name}
                enquireLabel={t('enquire')}
                enquiryEmail={enquiryEmail}
                exploreLabel={t('exploreProduct')}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
