'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { ImageCurtain } from '@/components/motion/image-curtain';
import { LocalizedLink } from '@/components/shared/localized-link';
import { useGsapContext } from '@/hooks/use-gsap-context';
import { revealElements } from '@/lib/motion-timelines';

export type CategoryShowcaseItem = {
  id: string;
  href: string;
  index: string;
  title: string;
  lede: string;
  cta: string;
  image: string;
  alt: string;
  available: boolean;
  featured: boolean;
};

type CategoriesIndexProps = {
  label: string;
  items: readonly CategoryShowcaseItem[];
};

export function CategoriesIndex({ label, items }: CategoriesIndexProps) {
  const rootRef = useRef<HTMLElement>(null);

  useGsapContext(() => {
    const root = rootRef.current;
    if (!root) {
      return;
    }

    const cards = root.querySelectorAll('[data-category-card]');
    revealElements(cards, { trigger: root });
  }, rootRef);

  return (
    <section
      ref={rootRef}
      className="categories-index site-container"
      aria-label={label}
    >
      <ul className="categories-index-grid">
        {items.map((item) => (
          <li
            key={item.id}
            className={
              item.featured
                ? 'categories-index-item is-feature'
                : 'categories-index-item'
            }
            data-category-card
          >
            <LocalizedLink href={item.href} className="categories-index-link">
              <ImageCurtain
                className="categories-index-curtain"
                aspectRatio={item.featured ? '16 / 9' : '4 / 3'}
                parallax
              >
                {item.available ? (
                  <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    priority={item.featured}
                    quality={90}
                    sizes={
                      item.featured
                        ? '(min-width: 1024px) 88vw, calc(100vw - 2.5rem)'
                        : '(min-width: 1024px) 44vw, calc(100vw - 2.5rem)'
                    }
                    className="categories-index-image"
                  />
                ) : (
                  <span className="categories-index-pending" />
                )}
              </ImageCurtain>
              <span className="categories-index-scrim" aria-hidden="true" />
              <div className="categories-index-copy">
                <span className="categories-index-number type-label">
                  {item.index}
                </span>
                <div className="categories-index-meta">
                  <h2 className="categories-index-title">{item.title}</h2>
                  <p className="categories-index-lede">{item.lede}</p>
                  <span className="categories-index-cta">
                    <span className="categories-index-cta-label">{item.cta}</span>
                    <span className="categories-index-cta-arrow" aria-hidden="true">
                      <svg viewBox="0 0 28 12" fill="none">
                        <path d="M0 6h26M21.5 1.5 27 6l-5.5 4.5" />
                      </svg>
                    </span>
                  </span>
                </div>
              </div>
            </LocalizedLink>
          </li>
        ))}
      </ul>
    </section>
  );
}
