'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { ImageCurtain } from '@/components/motion/image-curtain';
import { ABOUT_IMAGE } from '@/config/home-content';
import { useGsapContext } from '@/hooks/use-gsap-context';
import { playInteriorHero } from '@/lib/motion-timelines';

type AboutPageHeroProps = {
  eyebrow: string;
  headlineLines: readonly string[];
  intro: string;
  leadAlt: string;
  imageAvailable: boolean;
};

export function AboutPageHero({
  eyebrow,
  headlineLines,
  intro,
  leadAlt,
  imageAvailable,
}: AboutPageHeroProps) {
  const rootRef = useRef<HTMLElement>(null);

  useGsapContext(() => {
    const root = rootRef.current;
    if (!root) {
      return;
    }

    // Media uses ImageCurtain — only animate copy to avoid a double reveal.
    playInteriorHero({
      eyebrow: root.querySelector('.about-page-eyebrow'),
      lines: root.querySelectorAll('.about-page-headline-line-inner'),
      follow: root.querySelectorAll('.about-page-intro'),
    });
  }, rootRef);

  return (
    <header ref={rootRef} className="about-page-hero">
      <div className="about-page-hero-grid site-container">
        <div className="about-page-hero-copy">
          <p className="about-page-eyebrow type-label">{eyebrow}</p>
          <h1 className="about-page-headline type-display">
            {headlineLines.map((line) => (
              <span key={line} className="about-page-headline-line">
                <span className="about-page-headline-line-inner">{line}</span>
              </span>
            ))}
          </h1>
          <p className="about-page-intro type-body-lg">{intro}</p>
        </div>

        <div className="about-page-hero-media">
          <ImageCurtain
            className="about-page-hero-curtain"
            aspectRatio="767 / 1024"
            parallax
          >
            {imageAvailable ? (
              <Image
                src={ABOUT_IMAGE.src}
                alt={leadAlt}
                fill
                priority
                quality={92}
                sizes="(min-width: 1024px) 42vw, calc(100vw - 2.5rem)"
                className="about-page-media-img"
              />
            ) : (
              <span className="about-page-media-pending" />
            )}
          </ImageCurtain>
        </div>
      </div>
    </header>
  );
}
