/**
 * Future homepage hero — architecture only.
 *
 * Intended approach (not implemented yet):
 * - Canvas-based WebP or AVIF frame sequence
 * - Playback controlled with GSAP ScrollTrigger
 * - Separate desktop and mobile sequences — never load desktop frames on mobile
 * - Do not crop the desktop composition to fake a mobile crop
 * - Progressive frame preloading
 * - Static poster fallback for reduced motion and weak devices
 * - HTML text layered above the canvas
 * - No text embedded inside video frames
 *
 * Desktop strategy:
 * - Higher-resolution frames, more frames, longer scroll, cinematic framing
 *
 * Mobile strategy:
 * - Lower-resolution frames, fewer frames, shorter scroll, touch-friendly
 * - Correct mobile crop / focal point, lower memory use
 */

export type HeroSequenceSource = {
  frameCount: number;
  framePathPattern: string;
  width?: number;
  height?: number;
  scrollDuration: number;
  objectPosition?: string;
  preloadStrategy?: 'progressive' | 'none';
};

export type HeroSequenceConfig = {
  desktop: HeroSequenceSource;
  mobile: HeroSequenceSource;
  posterImage: string;
  fallbackVideo?: string;
  reducedMotionFallback: 'poster' | 'video';
  weakDeviceFallback: 'poster';
};
