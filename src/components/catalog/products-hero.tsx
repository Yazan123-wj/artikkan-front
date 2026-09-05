'use client';

import { useRef } from 'react';
import { EditorialLink } from '@/components/shared/editorial-link';
import { useGsapContext } from '@/hooks/use-gsap-context';
import { playInteriorHero } from '@/lib/motion-timelines';

type ProductsHeroProps = {
  eyebrow: string;
  headlineLines: readonly string[];
  intro: string;
  count: string;
  collectionsHref?: string;
  collectionsLabel?: string;
};

export function ProductsHero({
  eyebrow,
  headlineLines,
  intro,
  count,
  collectionsHref,
  collectionsLabel,
}: ProductsHeroProps) {
  const rootRef = useRef<HTMLElement>(null);

  useGsapContext(() => {
    const root = rootRef.current;
    if (!root) {
      return;
    }

    playInteriorHero({
      eyebrow: root.querySelector('.products-hero-eyebrow'),
      lines: root.querySelectorAll('.products-hero-line-inner'),
      follow: root.querySelectorAll(
        '.products-hero-intro, .products-hero-count, .products-hero-cta',
      ),
    });
  }, rootRef, [eyebrow, intro]);

  return (
    <header ref={rootRef} className="products-hero">
      <div className="products-hero-grid site-container">
        <div className="products-hero-copy">
          <p className="products-hero-eyebrow type-label">{eyebrow}</p>
          <h1 className="products-hero-headline type-display">
            {(headlineLines ?? []).map((line) => (
              <span key={line} className="products-hero-line">
                <span className="products-hero-line-inner">{line}</span>
              </span>
            ))}
          </h1>
        </div>
        <div className="products-hero-aside">
          <p className="products-hero-count type-label">{count}</p>
          <p className="products-hero-intro type-body-lg">{intro}</p>
          {collectionsHref && collectionsLabel ? (
            <EditorialLink href={collectionsHref} className="products-hero-cta">
              {collectionsLabel}
            </EditorialLink>
          ) : null}
        </div>
      </div>
    </header>
  );
}
