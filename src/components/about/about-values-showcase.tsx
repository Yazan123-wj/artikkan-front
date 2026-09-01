'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { useGsapContext } from '@/hooks/use-gsap-context';
import { revealElements } from '@/lib/motion-timelines';

export type AboutValueItem = {
  id: string;
  index: string;
  title: string;
  image: string;
  alt: string;
  available: boolean;
};

type AboutValuesShowcaseProps = {
  eyebrow: string;
  title: string;
  items: readonly AboutValueItem[];
};

export function AboutValuesShowcase({
  eyebrow,
  title,
  items,
}: AboutValuesShowcaseProps) {
  const rootRef = useRef<HTMLElement>(null);

  useGsapContext(() => {
    const root = rootRef.current;
    if (!root) {
      return;
    }

    const panels = root.querySelectorAll('[data-about-value]');
    revealElements(panels, { trigger: root });
  }, rootRef);

  return (
    <section
      ref={rootRef}
      className="about-page-values-showcase"
      aria-labelledby="about-values-heading"
    >
      <div className="about-page-values-showcase-head site-container">
        <p className="about-page-section-eyebrow type-label">{eyebrow}</p>
        <h2 id="about-values-heading" className="about-page-values-showcase-title">
          {title}
        </h2>
      </div>

      <div className="about-page-values-track-wrap site-container">
        <ul className="about-page-values-track">
          {items.map((item) => (
            <li key={item.id} className="about-page-value-panel" data-about-value>
              <div className="about-page-value-panel-media">
                {item.available ? (
                  <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    quality={85}
                    sizes="(min-width: 1024px) 30vw, 78vw"
                    className="about-page-media-img"
                  />
                ) : (
                  <span className="about-page-media-pending" />
                )}
                <span className="about-page-value-panel-scrim" aria-hidden="true" />
                <div className="about-page-value-panel-copy">
                  <span className="about-page-value-panel-index" aria-hidden="true">
                    {item.index}
                  </span>
                  <h3 className="about-page-value-panel-title">{item.title}</h3>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
