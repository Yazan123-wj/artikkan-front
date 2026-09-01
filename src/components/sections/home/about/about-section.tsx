'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { useTranslations } from 'next-intl';
import { LocalizedLink } from '@/components/shared/localized-link';
import { BRAND_ASSETS } from '@/config/hero';
import { ABOUT_IMAGE } from '@/config/home-content';
import { MOTION, motionPair } from '@/config/motion';
import { useGsapContext } from '@/hooks/use-gsap-context';
import { gsap } from '@/lib/gsap';

type AboutSectionProps = {
  imageAvailable: boolean;
};

export function AboutSection({ imageAvailable }: AboutSectionProps) {
  const t = useTranslations('home.about');
  const rootRef = useRef<HTMLElement>(null);
  const headlineLines = t.raw('headlineLines') as readonly string[];

  useGsapContext(() => {
    const root = rootRef.current;
    if (!root) {
      return;
    }

    const rise = motionPair(MOTION.about.rise);
    const eyebrow = root.querySelector('.about-eyebrow');
    const lines = root.querySelectorAll('.about-headline-line-inner');
    const follow = root.querySelectorAll('.about-body, .about-cta');
    const reveal = root.querySelector('.about-media-reveal');
    const scale = root.querySelector('.about-media-scale');

    gsap.set(eyebrow, { autoAlpha: 0, y: rise });
    gsap.set(lines, { yPercent: 100 });
    gsap.set(follow, { autoAlpha: 0, y: rise * 0.5 });
    gsap.set(reveal, { clipPath: 'inset(8% 6% 10% 6%)' });
    gsap.set(scale, { scale: 1.06 });

    const timeline = gsap.timeline({
      defaults: { ease: MOTION.ease.out },
      scrollTrigger: {
        id: 'home-about-entrance',
        trigger: root,
        start: MOTION.about.start,
        once: true,
      },
    });

    timeline
      .to(eyebrow, { autoAlpha: 1, y: 0, duration: MOTION.about.eyebrow }, 0)
      .to(
        lines,
        {
          yPercent: 0,
          duration: MOTION.about.line,
          stagger: MOTION.about.lineStagger,
        },
        0.06,
      )
      .to(
        follow,
        {
          autoAlpha: 1,
          y: 0,
          duration: MOTION.about.follow,
          stagger: MOTION.about.followStagger,
        },
        MOTION.about.followAt,
      )
      .to(
        reveal,
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: MOTION.about.clip,
          ease: MOTION.ease.inOut,
        },
        0,
      )
      .to(
        scale,
        {
          scale: 1,
          duration: MOTION.about.scale,
          ease: MOTION.ease.settle,
        },
        0,
      );
  }, rootRef);

  return (
    <section
      ref={rootRef}
      className="about-section"
      aria-labelledby="home-about-heading"
    >
      <div className="about-grid site-container">
        <div className="about-copy-column">
          <Image
            src={BRAND_ASSETS.icon}
            alt=""
            width={720}
            height={720}
            className="about-watermark"
            aria-hidden={true}
          />
          <p className="about-eyebrow type-label">{t('eyebrow')}</p>
          <h2 id="home-about-heading" className="about-headline type-h1">
            {headlineLines.map((line) => (
              <span key={line} className="about-headline-line">
                <span className="about-headline-line-inner">{line}</span>
              </span>
            ))}
          </h2>
          <p className="about-body type-body-lg">{t('body')}</p>
          <LocalizedLink href="/about" className="about-cta touch-target">
            <span className="about-cta-label">{t('cta')}</span>
            <span className="about-cta-arrow" aria-hidden="true">
              <svg viewBox="0 0 28 12" fill="none">
                <path d="M0 6h26M21.5 1.5 27 6l-5.5 4.5" />
              </svg>
            </span>
          </LocalizedLink>
        </div>
        <div className="about-media-column">
          <div className="about-media-reveal">
            <div className="about-media-scale">
              {imageAvailable ? (
                <Image
                  src={ABOUT_IMAGE.src}
                  alt={t('imageAlt')}
                  fill
                  quality={90}
                  sizes="(min-width: 1440px) 36rem, (min-width: 768px) 42vw, calc(100vw - 2.5rem)"
                  className="about-media-img"
                />
              ) : (
                <div
                  className="about-media-pending"
                  role="img"
                  aria-label={t('imageAlt')}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
