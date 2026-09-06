'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { LocalizedLink } from '@/components/shared/localized-link';
import { getFeaturedProductById } from '@/config/products';
import { productPieceKey } from '@/lib/product-messages';
import { cn } from '@/lib/utils';

type HeroProductCtaProps = {
  productId: string | null;
};

export function HeroProductCta({ productId }: HeroProductCtaProps) {
  const t = useTranslations('home.products');
  const product = productId ? getFeaturedProductById(productId) : undefined;
  const lastProductRef = useRef(product);
  const [visible, setVisible] = useState(false);

  if (product) {
    lastProductRef.current = product;
  }

  const display = product ?? lastProductRef.current;

  useEffect(() => {
    setVisible(Boolean(product));
  }, [product]);

  if (!display) {
    return null;
  }

  const name = t(productPieceKey(display.nameKey, 'name'));

  return (
    <LocalizedLink
      href={`/products/${display.slug}`}
      className={cn('hero-product-cta', visible && 'is-visible')}
      aria-hidden={!visible}
      tabIndex={visible ? undefined : -1}
    >
      <span className="hero-product-cta-name type-label">{name}</span>
      <span className="hero-product-cta-row">
        <span className="hero-product-cta-label">{t('exploreProduct')}</span>
        <span className="hero-product-cta-arrow" aria-hidden="true">
          <svg viewBox="0 0 28 12" fill="none">
            <path d="M0 6h26M21.5 1.5 27 6l-5.5 4.5" />
          </svg>
        </span>
      </span>
    </LocalizedLink>
  );
}
