'use client';

import Image from 'next/image';
import { useLocale } from 'next-intl';
import { LocalizedLink } from '@/components/shared/localized-link';
import { getProductCardImage } from '@/config/product-card-images';
import { cn } from '@/lib/utils';
import type { FeaturedProduct } from '@/types/product';

type ProjectProductTileProps = {
  product: FeaturedProduct | undefined;
  name: string;
  imageAlt: string;
  pendingLabel: string;
  imageAvailable: boolean;
  pieceIndex: 1 | 2;
};

export function ProjectProductTile({
  product,
  name,
  imageAlt,
  pendingLabel,
  imageAvailable,
  pieceIndex,
}: ProjectProductTileProps) {
  const locale = useLocale();
  const href = product ? `/products/${product.slug}` : null;
  const image = product ? getProductCardImage(product) : undefined;
  const showImage = Boolean(image);
  const objectPosition =
    image && locale === 'ar'
      ? (image.objectPositionRtl ?? image.objectPosition)
      : image?.objectPosition;

  return (
    <div className="featured-project-piece" data-piece={pieceIndex}>
      <div className="featured-project-piece-media" data-project-reveal>
        {href ? (
          <LocalizedLink
            href={href}
            className="featured-project-piece-media-link"
            aria-label={name}
          >
            {showImage && image ? (
              <Image
                src={image.src}
                alt={imageAlt}
                fill
                sizes="(min-width: 1440px) 320px, (min-width: 768px) 25vw, 45vw"
                quality={85}
                loading="lazy"
                decoding="async"
                className={cn(
                  'featured-project-piece-image',
                  image.fit === 'contain' ? 'is-contain' : 'is-cover',
                )}
                style={objectPosition ? { objectPosition } : undefined}
              />
            ) : (
              <span
                className="featured-project-piece-pending"
                role="img"
                aria-label={imageAlt}
              />
            )}
          </LocalizedLink>
        ) : (
          <span
            className="featured-project-piece-pending"
            role="img"
            aria-label={imageAlt}
          />
        )}
      </div>

      <h3 className="featured-project-piece-name">
        {href ? (
          <LocalizedLink href={href} className="featured-project-piece-name-link">
            {name}
          </LocalizedLink>
        ) : (
          name || pendingLabel
        )}
      </h3>
    </div>
  );
}
