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
}: FeaturedProductsProps) {
  const t = useTranslations('home.products');
  const tCategories = useTranslations('home.categories');
  const rootRef = useRef<HTMLElement>(null);

  const products = featuredProducts.filter(
    (product) => imageAvailability[product.id],
  );

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

  return (
    <section
      ref={rootRef}
      className="featured-products-section"
      aria-labelledby="home-products-heading"
    >
      <div className="site-container">
        <header className="featured-products-header">
          <p className="featured-products-eyebrow type-label">{t('eyebrow')}</p>
          <div className="featured-products-heading-row">
            <h2
              id="home-products-heading"
              className="featured-products-headline type-h2"
            >
              {t('headline')}
            </h2>
            <LocalizedLink
              href="/products"
              className="featured-products-cta touch-target"
            >
              <span className="featured-products-cta-label">{t('viewAll')}</span>
              <span className="featured-products-cta-arrow" aria-hidden="true">
                <svg viewBox="0 0 28 12" fill="none">
                  <path d="M0 6h26M21.5 1.5 27 6l-5.5 4.5" />
                </svg>
              </span>
            </LocalizedLink>
          </div>
          <p className="featured-products-intro type-body">{t('intro')}</p>
        </header>

        {products.length > 0 ? (
          <div className="featured-products-grid">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                name={pieceCopy(t, product.nameKey, 'name')}
                category={tCategories(product.categoryKey)}
                imageAlt={pieceCopy(t, product.nameKey, 'alt')}
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
