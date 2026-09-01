'use client';

import Image from 'next/image';
import { useLocale } from 'next-intl';
import { ProjectProductTile } from '@/components/sections/home/projects/project-product-tile';
import { LocalizedLink } from '@/components/shared/localized-link';
import { cn } from '@/lib/utils';
import type { FeaturedProduct } from '@/types/product';
import type { FeaturedProject } from '@/types/project';

type ProjectRowProduct = {
  record: FeaturedProduct | undefined;
  name: string;
  imageAlt: string;
  imageAvailable: boolean;
};

type ProjectRowProps = {
  project: FeaturedProject;
  name: string;
  subtitle: string;
  imageAlt: string;
  viewProjectLabel: string;
  piecesGroupLabel: string;
  pendingPhotographyLabel: string;
  pendingProductLabel: string;
  imageAvailable: boolean;
  products: readonly [ProjectRowProduct, ProjectRowProduct];
};

export function ProjectRow({
  project,
  name,
  subtitle,
  imageAlt,
  viewProjectLabel,
  piecesGroupLabel,
  pendingPhotographyLabel,
  pendingProductLabel,
  imageAvailable,
  products,
}: ProjectRowProps) {
  const locale = useLocale();
  const href = `/projects/${project.slug}`;
  const image = project.image;
  const showImage = Boolean(image && imageAvailable);
  const objectPosition =
    image && locale === 'ar'
      ? (image.objectPositionRtl ?? image.objectPosition)
      : image?.objectPosition;

  return (
    <article
      className={cn(
        'featured-project-row',
        project.placement === 'end' && 'is-reversed',
      )}
      data-featured-project-row
    >
      <div className="featured-project-feature">
        <div className="featured-project-feature-media" data-project-reveal>
          {showImage && image ? (
            <Image
              src={image.src}
              alt={imageAlt}
              fill
              sizes="(min-width: 1440px) 720px, (min-width: 768px) 50vw, calc(100vw - 2.5rem)"
              quality={85}
              loading="lazy"
              decoding="async"
              className="featured-project-feature-image"
              style={objectPosition ? { objectPosition } : undefined}
            />
          ) : (
            <span
              className="featured-project-feature-pending"
              role="img"
              aria-label={imageAlt}
            />
          )}
          {showImage ? (
            <span className="featured-project-feature-scrim" aria-hidden="true" />
          ) : null}
          <div
            className={cn(
              'featured-project-feature-copy',
              !showImage && 'is-on-surface',
            )}
          >
            <h3 className="featured-project-feature-title">{name}</h3>
            <div className="featured-project-feature-cta">
              <p className="featured-project-feature-subtitle">{subtitle}</p>
              <LocalizedLink href={href} className="featured-project-view">
                <span className="featured-project-view-label">
                  {viewProjectLabel}
                </span>
                <span className="featured-project-view-arrow" aria-hidden="true">
                  <svg viewBox="0 0 28 12" fill="none">
                    <path d="M0 6h26M21.5 1.5 27 6l-5.5 4.5" />
                  </svg>
                </span>
              </LocalizedLink>
            </div>
          </div>
        </div>
      </div>

      <div
        className="featured-project-pieces"
        role="group"
        aria-label={piecesGroupLabel}
      >
        {products.map((item, index) => (
          <ProjectProductTile
            key={item.record?.id ?? `${project.id}-piece-${index}`}
            product={item.record}
            name={item.record ? item.name : pendingProductLabel}
            imageAlt={item.record ? item.imageAlt : pendingPhotographyLabel}
            pendingLabel={pendingProductLabel}
            imageAvailable={item.imageAvailable}
            pieceIndex={index === 0 ? 1 : 2}
          />
        ))}
      </div>
    </article>
  );
}
