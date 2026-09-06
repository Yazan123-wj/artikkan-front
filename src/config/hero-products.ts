/**
 * Product close-ups in the pinned hero sequence (progress after the logo docks).
 * Windows follow the four slow holds in `SEQUENCE_SEGMENTS`.
 */
export const HERO_PRODUCT_WINDOWS = [
  { id: 'artk-sof-01', start: 0.02, end: 0.17 },
  { id: 'artk-dt-01', start: 0.25, end: 0.44 },
  { id: 'artk-un-01', start: 0.52, end: 0.7 },
  { id: 'artk-cot-02', start: 0.76, end: 1 },
] as const;

export function getHeroProductIdAtSequence(progress: number): string | null {
  if (progress < 0) {
    return null;
  }

  for (const window of HERO_PRODUCT_WINDOWS) {
    if (progress >= window.start && progress <= window.end) {
      return window.id;
    }
  }

  return null;
}
