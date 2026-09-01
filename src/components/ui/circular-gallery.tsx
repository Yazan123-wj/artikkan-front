'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';
import { cn } from '@/lib/utils';
import type { CircularGalleryItem } from '@/components/ui/circular-gallery-engine';

export type { CircularGalleryItem };

type CircularGalleryProps = {
  items: readonly CircularGalleryItem[];
  bend?: number;
  textColor?: string;
  borderRadius?: number;
  scrollSpeed?: number;
  scrollEase?: number;
  autoplay?: boolean;
  autoplaySpeed?: number;
  ariaLabel?: string;
  className?: string;
};

function StaticGallery({
  items,
  ariaLabel,
  className,
}: Pick<CircularGalleryProps, 'items' | 'ariaLabel' | 'className'>) {
  return (
    <ul
      className={cn('circular-gallery-static', className)}
      aria-label={ariaLabel}
    >
      {items.map((item) => (
        <li key={`${item.image}-${item.text}`}>
          <figure className="circular-gallery-static-item">
            <div className="circular-gallery-static-frame">
              <Image
                src={item.image}
                alt=""
                fill
                sizes="(max-width: 768px) 70vw, 240px"
              />
            </div>
          </figure>
        </li>
      ))}
    </ul>
  );
}

export function CircularGallery({
  items,
  bend = 3,
  textColor = '#161616',
  borderRadius = 0.02,
  scrollSpeed = 2.2,
  scrollEase = 0.05,
  autoplay = true,
  autoplaySpeed = 0.014,
  ariaLabel = 'Image gallery. Drag to browse.',
  className = '',
}: CircularGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const itemsKey = items.map((item) => `${item.image}:${item.text}`).join('|');

  useEffect(() => {
    const container = containerRef.current;
    if (!container || reduced !== false || items.length === 0) {
      return;
    }

    let cancelled = false;
    let app: import('./circular-gallery-engine').CircularGalleryApp | undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        app?.setVisible(Boolean(entry?.isIntersecting));
      },
      { rootMargin: '120px 0px' },
    );

    void import('./circular-gallery-engine').then(
      ({ CircularGalleryApp, resolveSiteFont }) => {
        if (cancelled || !containerRef.current) {
          return;
        }

        try {
          app = new CircularGalleryApp(containerRef.current, {
            items,
            bend,
            textColor,
            borderRadius,
            font: resolveSiteFont(22),
            scrollSpeed,
            scrollEase,
            autoplay,
            autoplaySpeed,
          });
          observer.observe(containerRef.current);
        } catch {
          app = undefined;
        }
      },
    );

    return () => {
      cancelled = true;
      observer.disconnect();
      app?.destroy();
    };
  }, [
    items,
    itemsKey,
    bend,
    textColor,
    borderRadius,
    scrollSpeed,
    scrollEase,
    autoplay,
    autoplaySpeed,
    reduced,
  ]);

  if (items.length === 0) {
    return null;
  }

  if (reduced) {
    return (
      <StaticGallery
        items={items}
        ariaLabel={ariaLabel}
        className={className}
      />
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn('circular-gallery', className)}
      tabIndex={0}
      role="region"
      aria-label={ariaLabel}
    />
  );
}
