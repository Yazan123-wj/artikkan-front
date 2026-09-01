'use client';

import Image from 'next/image';
import { useLayoutEffect, useRef } from 'react';
import { MOTION } from '@/config/motion';
import { gsap, prefersReducedMotion } from '@/lib/gsap';

type AboutPullquoteBandProps = {
  quote: string;
  label: string;
  imageSrc: string;
  imageAvailable: boolean;
};

export function AboutPullquoteBand({
  quote,
  label,
  imageSrc,
  imageAvailable,
}: AboutPullquoteBandProps) {
  const rootRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) {
      return;
    }

    const media = root.querySelector<HTMLElement>('[data-about-quote-media]');
    if (!media) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        media,
        { y: -24 },
        {
          y: 24,
          ease: 'none',
          scrollTrigger: {
            trigger: root,
            start: 'top bottom',
            end: 'bottom top',
            scrub: MOTION.imageCurtain.scrub,
          },
        },
      );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      className="about-page-quote-band"
      aria-label={label}
    >
      <div className="about-page-quote-media" data-about-quote-media>
        {imageAvailable ? (
          <Image
            src={imageSrc}
            alt=""
            fill
            quality={85}
            sizes="100vw"
            className="about-page-quote-image"
            aria-hidden={true}
          />
        ) : (
          <span className="about-page-media-pending" aria-hidden={true} />
        )}
        <span className="about-page-quote-scrim" aria-hidden={true} />
      </div>
      <div className="about-page-quote-copy site-container">
        <blockquote className="about-page-quote-text type-h2">
          <p>{quote}</p>
        </blockquote>
      </div>
    </section>
  );
}
