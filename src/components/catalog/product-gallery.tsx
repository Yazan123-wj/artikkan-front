'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useLocale } from 'next-intl';
import { useFocusTrap } from '@/hooks/use-focus-trap';
import { useLockBodyScroll } from '@/hooks/use-lock-body-scroll';
import { cn } from '@/lib/utils';
import type { FeaturedProductImage } from '@/types/product';

type ProductGalleryProps = {
  images: readonly FeaturedProductImage[];
  alt: string;
  zoomLabel: string;
  closeLabel: string;
  galleryLabel: string;
};

export function ProductGallery({
  images,
  alt,
  zoomLabel,
  closeLabel,
  galleryLabel,
}: ProductGalleryProps) {
  const locale = useLocale();
  const dialogRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const current = images[0];

  useFocusTrap(open, dialogRef);
  useLockBodyScroll(open, 'is-zoom-open');

  useEffect(() => {
    if (!open) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  if (!current) {
    return <div className="product-detail-stage" />;
  }

  const objectPosition =
    locale === 'ar'
      ? (current.objectPositionRtl ?? current.objectPosition)
      : current.objectPosition;

  return (
    <div className="product-detail-gallery" aria-label={galleryLabel}>
      <div className="product-detail-stage">
        <Image
          src={current.src}
          alt={alt}
          fill
          priority
          quality={90}
          sizes="(min-width: 1024px) 52vw, calc(100vw - 2.5rem)"
          className={cn(
            'product-detail-stage-image',
            current.fit === 'contain' ? 'is-contain' : 'is-cover',
          )}
          style={objectPosition ? { objectPosition } : undefined}
        />
        <button
          type="button"
          className="product-detail-zoom"
          onClick={() => setOpen(true)}
        >
          {zoomLabel}
        </button>
      </div>

      {open ? (
          <div
            ref={dialogRef}
            className="product-zoom-dialog"
            role="dialog"
            aria-modal="true"
            aria-label={zoomLabel}
            onClick={(event) => {
              if (event.target === event.currentTarget) {
                setOpen(false);
              }
            }}
          >
          <button
            type="button"
            className="product-zoom-close"
            onClick={() => setOpen(false)}
          >
            {closeLabel}
          </button>
          <div className="product-zoom-dialog-image">
            <Image
              src={current.src}
              alt={alt}
              fill
              quality={90}
              sizes="92vw"
              className="is-contain"
              style={{ objectFit: 'contain' }}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
