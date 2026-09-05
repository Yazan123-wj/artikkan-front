'use client';

/* Brand marks must keep source proportions; do not route through next/image. */
/* eslint-disable @next/next/no-img-element */

import { useLayoutEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { BRAND_ASSETS, ENTRANCE, HERO_MEDIA, MOBILE_HERO_QUERY } from '@/config/hero';
import { MOTION } from '@/config/motion';
import { playEntranceAudio, preloadEntranceAudio } from '@/lib/entrance-audio';
import { gsap, prefersReducedMotion } from '@/lib/gsap';
import {
  decodeImage,
  waitForFonts,
  waitForTimeout,
  withTimeout,
} from '@/lib/entrance-assets';
import { preloadHeroSequenceStart } from '@/components/sections/home/hero/hero-sequence';

declare global {
  interface Window {
    __artikkanEntered?: boolean;
  }
}

let entranceCompleted = false;

function hasEntered(): boolean {
  return (
    entranceCompleted ||
    (typeof window !== 'undefined' && window.__artikkanEntered === true)
  );
}

function markEntered(): void {
  entranceCompleted = true;
  window.__artikkanEntered = true;
}

export function LoadingScreen() {
  const t = useTranslations('a11y');
  const screenRef = useRef<HTMLDivElement | null>(null);
  const [state, setState] = useState<'loading' | 'exiting' | 'gone'>(() =>
    hasEntered() ? 'gone' : 'loading',
  );

  useLayoutEffect(() => {
    if (hasEntered()) {
      document.documentElement.classList.remove('is-loading');
      return;
    }

    const screen = screenRef.current;
    if (!screen) {
      return;
    }

    document.documentElement.classList.add('is-loading');
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    let cancelled = false;
    let tween: gsap.core.Tween | null = null;
    const reduced = prefersReducedMotion();

    const finishExit = () => {
      window.scrollTo(0, 0);
      document.documentElement.classList.remove('is-loading');
      screen.style.pointerEvents = 'none';
      setState('gone');
    };

    const run = async () => {
      const started = performance.now();
      const isMobile = window.matchMedia(MOBILE_HERO_QUERY).matches;
      preloadEntranceAudio();

      await withTimeout(
        Promise.all([
          waitForFonts(),
          decodeImage(HERO_MEDIA.poster),
          decodeImage(BRAND_ASSETS.icon),
          decodeImage(BRAND_ASSETS.wordmark),
          reduced
            ? Promise.resolve()
            : preloadHeroSequenceStart(isMobile),
        ]),
        ENTRANCE.maxWaitMs,
      );

      const remaining = ENTRANCE.minDisplayMs - (performance.now() - started);
      if (remaining > 0) {
        await waitForTimeout(remaining);
      }

      if (cancelled) {
        return;
      }

      markEntered();
      playEntranceAudio();

      if (reduced) {
        tween = gsap.to(screen, {
          autoAlpha: 0,
          duration: MOTION.loader.reducedFade,
          ease: MOTION.ease.out,
          onComplete: finishExit,
        });
        return;
      }

      setState('exiting');
      tween = gsap.to(screen, {
        yPercent: -100,
        duration: ENTRANCE.curtainDuration,
        ease: MOTION.ease.inOut,
        onComplete: finishExit,
      });
    };

    void run();

    return () => {
      cancelled = true;
      tween?.kill();
    };
  }, []);

  if (state === 'gone') {
    return null;
  }

  return (
    <div
      ref={screenRef}
      className="loading-screen"
      data-state={state}
      role="status"
      aria-live="polite"
      aria-label={t('loading')}
      suppressHydrationWarning
    >
      <img
        src={BRAND_ASSETS.icon}
        alt=""
        className="loading-icon is-spinning"
        width={88}
        height={88}
        draggable={false}
      />
    </div>
  );
}
