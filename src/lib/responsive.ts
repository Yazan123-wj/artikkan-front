/**
 * Shared responsive contract for every section.
 * Use these tokens from CSS / Tailwind. Do not use JavaScript
 * to switch ordinary layout. JS is reserved for cases CSS cannot
 * handle, such as loading the mobile vs desktop hero sequence.
 */

export const breakpoints = {
  mobileSmall: 320,
  mobile: 375,
  tablet: 768,
  laptop: 1024,
  desktop: 1440,
  wide: 1920,
} as const;

export const breakpointQueries = {
  tablet: `(min-width: ${breakpoints.tablet}px)`,
  laptop: `(min-width: ${breakpoints.laptop}px)`,
  desktop: `(min-width: ${breakpoints.desktop}px)`,
  wide: `(min-width: ${breakpoints.wide}px)`,
  hover: '(hover: hover) and (pointer: fine)',
  reducedMotion: '(prefers-reduced-motion: reduce)',
} as const;

export const testViewports = [
  { name: 'small-mobile', width: 320, height: 568 },
  { name: 'standard-mobile', width: 375, height: 812 },
  { name: 'mobile-390', width: 390, height: 844 },
  { name: 'mobile-430', width: 430, height: 932 },
  { name: 'tablet-portrait', width: 768, height: 1024 },
  { name: 'tablet-landscape', width: 1024, height: 768 },
  { name: 'laptop', width: 1280, height: 800 },
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'large-desktop', width: 1920, height: 1080 },
] as const;

export const touchTargetPx = 44;

export const imageSizes = {
  fullBleed: '100vw',
  standard:
    '(min-width: 1440px) 1440px, calc(100vw - 2 * 1.25rem)',
  wide: '(min-width: 1440px) 1440px, 100vw',
  narrow: '(min-width: 768px) 40rem, calc(100vw - 2.5rem)',
  splitHalf: '(min-width: 1024px) 50vw, 100vw',
} as const;

export type BreakpointName = keyof typeof breakpoints;
export type TestViewport = (typeof testViewports)[number];
