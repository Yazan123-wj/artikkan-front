/**
 * Site-wide motion language for Artikkan.
 * Curtain wipes, reveals, and heroes should all pull from here.
 */

export const MOTION = {
  ease: {
    out: 'power3.out',
    inOut: 'power3.inOut',
    in: 'power2.in',
    settle: 'power2.out',
  },

  /** Menu overlay dual-panel curtain */
  menu: {
    drop: { mobile: 0.34, desktop: 0.42 },
    lift: { mobile: 0.3, desktop: 0.36 },
    inkOffset: 0.06,
    flowIn: { mobile: 0.28, desktop: 0.34 },
    flowOut: 0.16,
    flowRise: { mobile: 10, desktop: 14 },
    flowExit: { mobile: -8, desktop: -12 },
    closeInkCover: 0.68,
  },

  /** Route change horizontal wipe — same curtain family as the menu */
  page: {
    cover: { mobile: 0.28, desktop: 0.34 },
    reveal: { mobile: 0.32, desktop: 0.4 },
    inkOffset: 0.05,
    contentRise: { mobile: 10, desktop: 14 },
  },

  /** First-load screen lift */
  loader: {
    curtain: 0.85,
    reducedFade: 0.2,
    spinSeconds: 1,
    minDisplayMs: 1000,
    maxWaitMs: 7500,
  },

  /** ImageCurtain panel lift + settle */
  imageCurtain: {
    panel: 0.85,
    scale: 0.95,
    scaleFrom: 1.04,
    copy: 0.55,
    copyStagger: 0.07,
    copyY: 14,
    start: 'top 85%',
    scrub: 0.4,
    parallaxFrom: -14,
    parallaxTo: 20,
  },

  /** Shared fade/rise used by Interior / Journal / Contact reveals */
  reveal: {
    duration: 0.5,
    stagger: 0.07,
    y: 18,
    start: 'top 88%',
  },

  /** Interior page heroes (products / categories / about) */
  hero: {
    delay: 0.06,
    eyebrow: 0.42,
    line: 0.52,
    lineStagger: 0.06,
    lineAt: 0.08,
    follow: 0.45,
    followStagger: 0.06,
    followAt: 0.18,
    rise: { mobile: 10, desktop: 14 },
  },

  /** Homepage about editorial entrance */
  about: {
    eyebrow: 0.42,
    line: 0.52,
    lineStagger: 0.05,
    follow: 0.45,
    followStagger: 0.05,
    followAt: 0.18,
    clip: 0.62,
    scale: 0.78,
    rise: { mobile: 8, desktop: 12 },
    start: 'top 88%',
  },

  /** Generic section card / row entrances */
  section: {
    duration: 0.5,
    stagger: 0.07,
    y: 18,
    start: 'top 88%',
  },

  counter: { mobile: 1.4, desktop: 1.7 },

  accordion: {
    duration: 0.55,
    stagger: 0.05,
    ease: 'power3.out',
  },

  /** Flowing menu hover marquee */
  flowingMenu: {
    hover: 0.45,
    ease: 'power3.out',
  },
} as const;

export type MotionPair = { readonly mobile: number; readonly desktop: number };

export function isMotionMobile(): boolean {
  return window.matchMedia('(max-width: 767px)').matches;
}

export function motionPair(pair: MotionPair): number {
  return isMotionMobile() ? pair.mobile : pair.desktop;
}
