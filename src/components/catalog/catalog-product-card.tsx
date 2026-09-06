'use client';

import Image from 'next/image';
import { useLocale } from 'next-intl';
import { LocalizedLink } from '@/components/shared/localized-link';
import { getProductCardImage } from '@/config/product-card-images';
import { cn } from '@/lib/utils';
import type { FeaturedProduct } from '@/types/product';

type CatalogProductCardProps = {
  product: FeaturedProduct;
  name: string;
  category: string;
  imageAlt: string;
  viewDetailsLabel: string;
  imageAvailable: boolean;
};

export function CatalogProductCard({
  product,
  name,
  category,
  imageAlt,
  viewDetailsLabel,
  imageAvailable,
}: CatalogProductCardProps) {
  const locale = useLocale();
  const href = `/products/${product.slug}`;
  const image = getProductCardImage(product);
  const objectPosition =
    locale === 'ar'
      ? (image.objectPositionRtl ?? image.objectPosition)
      : image.objectPosition;

  return (
    <article className="products-card" data-interior-reveal>
      <LocalizedLink
        href={href}
        className="products-card-link"
        aria-label={`${name} — ${viewDetailsLabel}`}
      >
        <div className="products-card-media">
          {imageAvailable ? (
            <Image
              src={image.src}
              alt={imageAlt}
              fill
              sizes="(min-width: 1440px) 28vw, (min-width: 768px) 44vw, calc(100vw - 2.5rem)"
              quality={92}
              className={cn(
                'products-card-image',
                image.fit === 'contain' ? 'is-contain' : 'is-cover',
              )}
              style={objectPosition ? { objectPosition } : undefined}
            />
          ) : (
            <span className="products-card-pending" />
          )}
        </div>
        <p className="products-card-category type-label">{category}</p>
        <h2 className="products-card-name">{name}</h2>
        <span className="products-card-cta">
          <span>{viewDetailsLabel}</span>
          <span className="products-card-cta-arrow" aria-hidden="true">
            <svg viewBox="0 0 28 12" fill="none">
              <path d="M0 6h26M21.5 1.5 27 6l-5.5 4.5" />
            </svg>
          </span>
        </span>
      </LocalizedLink>
    </article>
  );
}
