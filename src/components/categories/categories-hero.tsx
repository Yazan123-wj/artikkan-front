'use client';

import { useRef } from 'react';
import { useGsapContext } from '@/hooks/use-gsap-context';
import { playInteriorHero } from '@/lib/motion-timelines';

type CategoriesHeroProps = {
  eyebrow: string;
  headlineLines: readonly string[];
  intro: string;
  count: string;
};

export function CategoriesHero({
  eyebrow,
  headlineLines,
  intro,
  count,
}: CategoriesHeroProps) {
  const rootRef = useRef<HTMLElement>(null);

  useGsapContext(() => {
    const root = rootRef.current;
    if (!root) {
      return;
    }

    playInteriorHero({
      eyebrow: root.querySelector('.categories-hero-eyebrow'),
      lines: root.querySelectorAll('.categories-hero-line-inner'),
      follow: root.querySelectorAll(
        '.categories-hero-intro, .categories-hero-count',
      ),
    });
  }, rootRef);

  return (
    <header ref={rootRef} className="categories-hero">
      <div className="categories-hero-grid site-container">
        <div className="categories-hero-copy">
          <p className="categories-hero-eyebrow type-label">{eyebrow}</p>
          <h1 className="categories-hero-headline type-display">
            {headlineLines.map((line) => (
              <span key={line} className="categories-hero-line">
                <span className="categories-hero-line-inner">{line}</span>
              </span>
            ))}
          </h1>
        </div>
        <div className="categories-hero-aside">
          <p className="categories-hero-count type-label">{count}</p>
          <p className="categories-hero-intro type-body-lg">{intro}</p>
        </div>
      </div>
    </header>
  );
}
