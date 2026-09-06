'use client';

import Image from 'next/image';
import { useCallback, useRef, useState, type PointerEvent } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { prefersReducedMotion } from '@/lib/gsap';
import { cn } from '@/lib/utils';
import type { FeaturedProductImage } from '@/types/product';

type ProductGalleryProps = {
  images: readonly FeaturedProductImage[];
  alt: string;
  galleryLabel: string;
};

function canHoverZoom(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  return (
    window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
    !prefersReducedMotion()
  );
}

export function ProductGallery({
  images,
  alt,
  galleryLabel,
}: ProductGalleryProps) {
  const locale = useLocale();
  const t = useTranslations('productsPage');
  const stageRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const current = images[activeIndex] ?? images[0];
  const hasThumbs = images.length > 1;

  const setZoomPoint = useCallback((event: PointerEvent<HTMLDivElement>) => {
    const stage = stageRef.current;
    if (!stage || !canHoverZoom()) {
      return;
    }

    const rect = stage.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    stage.style.setProperty('--zoom-x', `${Math.min(100, Math.max(0, x))}%`);
    stage.style.setProperty('--zoom-y', `${Math.min(100, Math.max(0, y))}%`);
    stage.classList.add('is-zoomed');
  }, []);

  const clearZoom = useCallback(() => {
    stageRef.current?.classList.remove('is-zoomed');
  }, []);

  if (!current) {
    return <div className="product-detail-stage" />;
  }

  const objectPosition =
    locale === 'ar'
      ? (current.objectPositionRtl ?? current.objectPosition)
      : current.objectPosition;

  return (
    <div
      className={cn(
        'product-detail-gallery',
        hasThumbs && 'has-thumbs',
      )}
      aria-label={galleryLabel}
    >
      {hasThumbs ? (
        <div className="product-detail-thumbs" role="list">
          {images.map((image, index) => (
            <button
              key={image.src}
              type="button"
              role="listitem"
              className={cn(
                'product-detail-thumb',
                index === activeIndex && 'is-active',
              )}
              aria-label={t('selectImage', {
                index: index + 1,
                total: images.length,
              })}
              aria-current={index === activeIndex ? 'true' : undefined}
              onClick={() => {
                setActiveIndex(index);
                clearZoom();
              }}
            >
              <Image
                src={image.src}
                alt=""
                fill
                sizes="72px"
                quality={70}
                className={cn(
                  'product-detail-thumb-image',
                  image.fit === 'contain' ? 'is-contain' : 'is-cover',
                )}
              />
            </button>
          ))}
        </div>
      ) : null}

      <div
        ref={stageRef}
        className="product-detail-stage"
        onPointerEnter={setZoomPoint}
        onPointerMove={setZoomPoint}
        onPointerLeave={clearZoom}
      >
        <Image
          src={current.src}
          alt={alt}
          fill
          priority
          quality={90}
          sizes="(min-width: 1024px) 52vw, calc(100vw - 2.5rem)"
          className={cn(
            'product-detail-stage-image is-zoomable',
            current.fit === 'contain' ? 'is-contain' : 'is-cover',
          )}
          style={objectPosition ? { objectPosition } : undefined}
        />
      </div>
    </div>
  );
}
