import { MOTION, motionPair } from '@/config/motion';
import { gsap } from '@/lib/gsap';

type RevealOptions = {
  y?: number;
  duration?: number;
  stagger?: number;
  start?: string;
  trigger?: Element | string;
};

/** Shared fade/rise used across interior, journal, contact, and section cards. */
export function revealElements(
  items: gsap.TweenTarget,
  options: RevealOptions = {},
): gsap.core.Tween {
  const {
    y = MOTION.reveal.y,
    duration = MOTION.reveal.duration,
    stagger = MOTION.reveal.stagger,
    start = MOTION.reveal.start,
    trigger,
  } = options;

  gsap.set(items, { autoAlpha: 0, y });

  return gsap.to(items, {
    autoAlpha: 1,
    y: 0,
    duration,
    stagger,
    ease: MOTION.ease.out,
    scrollTrigger: trigger
      ? {
          trigger,
          start,
          once: true,
        }
      : undefined,
  });
}

type InteriorHeroNodes = {
  eyebrow: Element | null;
  lines: ArrayLike<Element>;
  follow: ArrayLike<Element>;
};

/** Shared interior-page hero entrance (products / categories / about). */
export function playInteriorHero({
  eyebrow,
  lines,
  follow,
}: InteriorHeroNodes): gsap.core.Timeline {
  const rise = motionPair(MOTION.hero.rise);

  gsap.set(eyebrow, { autoAlpha: 0, y: rise });
  gsap.set(lines, { yPercent: 110 });
  gsap.set(follow, { autoAlpha: 0, y: rise * 0.65 });

  return gsap
    .timeline({
      defaults: { ease: MOTION.ease.out },
      delay: MOTION.hero.delay,
    })
    .to(
      eyebrow,
      { autoAlpha: 1, y: 0, duration: MOTION.hero.eyebrow },
      0,
    )
    .to(
      lines,
      {
        yPercent: 0,
        duration: MOTION.hero.line,
        stagger: MOTION.hero.lineStagger,
        ease: MOTION.ease.out,
      },
      MOTION.hero.lineAt,
    )
    .to(
      follow,
      {
        autoAlpha: 1,
        y: 0,
        duration: MOTION.hero.follow,
        stagger: MOTION.hero.followStagger,
      },
      MOTION.hero.followAt,
    );
}
