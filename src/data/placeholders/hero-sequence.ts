import type { HeroSequenceConfig } from '@/types/hero-sequence';

/**
 * Paths only. Frame files are not included yet.
 * Load `mobile` or `desktop` from matchMedia — never both.
 */
export const heroSequencePlaceholder: HeroSequenceConfig = {
  desktop: {
    frameCount: 0,
    framePathPattern: '/media/hero/desktop/sequence/hero-desktop-{index}.webp',
    scrollDuration: 0,
    preloadStrategy: 'progressive',
  },
  mobile: {
    frameCount: 0,
    framePathPattern: '/media/hero/mobile/sequence/hero-mobile-{index}.webp',
    scrollDuration: 0,
    objectPosition: 'center',
    preloadStrategy: 'progressive',
  },
  posterImage: '/media/hero/fallback/hero-poster.webp',
  fallbackVideo: '/media/hero/fallback/hero-fallback.mp4',
  reducedMotionFallback: 'poster',
  weakDeviceFallback: 'poster',
};
