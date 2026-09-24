import { MOTION } from '@/config/motion';

export const ENTRANCE_AUDIO = '/media/audio/artikkan-entrance.mp3';

export const HERO_MEDIA = {
  poster: '/media/hero/artikkan-hero-poster.jpg',
  desktopVideo: '/media/hero/artikkan-hero-desktop.mp4',
  mobileVideo: '/media/hero/artikkan-hero-mobile.mp4',
  fallbackVideo: '/media/hero/artikkan-hero-master.mp4',
} as const;

export const BRAND_ASSETS = {
  icon: '/logos/artikkan-icon.png',
  /* True RGBA PNG (white artwork on transparency); recolor with CSS filter.
     Do not use artikkan-wordmark-dark.png — it is an opaque JPEG. */
  wordmark: '/logos/artikkan-wordmark.png',
  /* Navbar lockup: artikkan + Gallery + ® */
  navWordmark: '/logos/artikkan-nav-wordmark.png',
} as const;

/** Logo docks by this point of the pinned hero timeline. */
export const LOGO_DOCK_PROGRESS = 0.12;

export const ENTRANCE = {
  minDisplayMs: MOTION.loader.minDisplayMs,
  maxWaitMs: MOTION.loader.maxWaitMs,
  spinDuration: MOTION.loader.spinSeconds,
  curtainDuration: MOTION.loader.curtain,
} as const;

/** Mobile sequence at 768px and below; desktop above 768px. */
export const MOBILE_HERO_QUERY = '(max-width: 768px)';

export const HERO_SEQUENCE = {
  desktop: {
    expectedFrameCount: 360,
    fps: 24,
    directory: '/media/hero/frames/desktop',
    width: 1920,
    height: 1082,
    initialPreload: 48,
    pinViewports: 6.4,
  },
  mobile: {
    expectedFrameCount: 300,
    fps: 20,
    directory: '/media/hero/frames/mobile',
    width: 960,
    height: 540,
    initialPreload: 48,
    pinViewports: 4.8,
  },
} as const;

export type HeroSequenceVariant = keyof typeof HERO_SEQUENCE;

export function padHeroFrame(index: number): string {
  return String(index).padStart(4, '0');
}

export function heroFrameUrl(
  variant: HeroSequenceVariant,
  index: number,
): string {
  const { directory } = HERO_SEQUENCE[variant];
  return `${directory}/frame-${padHeroFrame(index)}.webp`;
}

export function getHeroSequenceVariant(isMobile: boolean): HeroSequenceVariant {
  return isMobile ? 'mobile' : 'desktop';
}

export function getHeroVideoSrc(isMobile: boolean): string {
  return isMobile ? HERO_MEDIA.mobileVideo : HERO_MEDIA.desktopVideo;
}
