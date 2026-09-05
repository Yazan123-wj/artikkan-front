'use client';

import Image from 'next/image';
import { useLocale } from 'next-intl';
import { ProductEnquireButton } from '@/components/enquiry/product-enquire-button';
import { LocalizedLink } from '@/components/shared/localized-link';
import { cn } from '@/lib/utils';
import type { FeaturedProduct } from '@/types/product';

type ProductCardProps = {
  product: FeaturedProduct;
  name: string;
  category: string;
  imageAlt: string;
  enquireLabel: string;
  enquiryEmail: string | null;
  exploreLabel?: string;
};

export function ProductCard({
  product,
  name,
  category,
  imageAlt,
  enquireLabel,
  enquiryEmail,
  exploreLabel,
}: ProductCardProps) {
  const locale = useLocale();
  const href = `/products/${product.slug}`;
  const { image } = product;
  const objectPosition =
    locale === 'ar'
      ? (image.objectPositionRtl ?? image.objectPosition)
      : image.objectPosition;

  return (
    <article className="featured-product" data-featured-product>
      <div className="featured-product-media">
        <LocalizedLink
          href={href}
          className="featured-product-media-link"
          aria-label={name}
        >
          <Image
            src={image.src}
            alt={imageAlt}
            fill
            sizes="(min-width: 1440px) 330px, (min-width: 768px) 45vw, calc(100vw - 2.5rem)"
            quality={85}
            className={cn(
              'featured-product-image',
              image.fit === 'contain' ? 'is-contain' : 'is-cover',
            )}
            style={objectPosition ? { objectPosition } : undefined}
          />
        </LocalizedLink>
      </div>

      <div className="featured-product-caption">
        <p className="featured-product-category">{category}</p>
        <h3 className="featured-product-name">
          <LocalizedLink href={href} className="featured-product-name-link">
            {name}
          </LocalizedLink>
        </h3>
      </div>

      {exploreLabel ? (
        <LocalizedLink href={href} className="featured-product-enquire touch-target">
          <span className="featured-product-enquire-label">{exploreLabel}</span>
          <span className="featured-product-enquire-arrow" aria-hidden="true">
            <svg viewBox="0 0 28 12" fill="none">
              <path d="M0 6h26M21.5 1.5 27 6l-5.5 4.5" />
            </svg>
          </span>
        </LocalizedLink>
      ) : (
        <ProductEnquireButton
          label={enquireLabel}
          enquiryEmail={enquiryEmail}
          product={{
            name,
            category,
            slug: product.slug,
            reference: product.reference,
            imageSrc: image.src,
            imageAlt,
          }}
        />
      )}
    </article>
  );
}
