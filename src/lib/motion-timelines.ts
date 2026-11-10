import { MOTION, motionPair } from '@/config/motion';
import { gsap, gsapSet, isGsapTarget, ScrollTrigger } from '@/lib/gsap';

type RevealOptions = {
  y?: number;
  duration?: number;
  stagger?: number;
  start?: string;
  trigger?: Element | string;
};

function revealNodes(items: gsap.TweenTarget): Element[] {
  if (typeof NodeList !== 'undefined' && items instanceof NodeList) {
    return [...items].filter((node): node is Element => node instanceof Element);
  }
  if (Array.isArray(items)) {
    return items.filter((node): node is Element => node instanceof Element);
  }
  if (items instanceof Element) {
    return [items];
  }
  return [];
}

function nodeInView(node: Element) {
  const rect = node.getBoundingClientRect();
  return rect.bottom > 0 && rect.top < (window.innerHeight || 0) + 80;
}

/** Shared fade/rise used across interior, journal, contact, and section cards. */
export function revealElements(
  items: gsap.TweenTarget,
  options: RevealOptions = {},
): gsap.core.Tween | undefined {
  if (!isGsapTarget(items)) {
    return undefined;
  }

  const nodes = revealNodes(items);
  if (nodes.length === 0) {
    return undefined;
  }

  const {
    y = MOTION.reveal.y,
    duration = MOTION.reveal.duration,
    stagger = MOTION.reveal.stagger,
    start = MOTION.reveal.start,
    trigger,
  } = options;

  const tween = gsap.fromTo(
    nodes,
    { autoAlpha: 0, y },
    {
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
            invalidateOnRefresh: true,
          }
        : undefined,
    },
  );

  const showVisible = () => {
    const pending = nodes.filter((node) => {
      const opacity = window.getComputedStyle(node).opacity;
      return opacity === '0' && nodeInView(node);
    });
    if (pending.length === 0) {
      return;
    }
    gsap.to(pending, {
      autoAlpha: 1,
      y: 0,
      duration: 0.35,
      overwrite: 'auto',
      ease: MOTION.ease.out,
    });
  };

  requestAnimationFrame(() => {
    ScrollTrigger.refresh();
    showVisible();
  });
  window.setTimeout(showVisible, 320);

  return tween;
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

  gsapSet(eyebrow, { y: rise });
  gsapSet(lines, { yPercent: 110 });
  gsapSet(follow, { y: rise * 0.65 });

  const timeline = gsap.timeline({
    defaults: { ease: MOTION.ease.out },
    delay: MOTION.hero.delay,
  });

  if (eyebrow) {
    timeline.to(
      eyebrow,
      { y: 0, duration: MOTION.hero.eyebrow },
      0,
    );
  }
  if (isGsapTarget(lines)) {
    timeline.to(
      lines,
      {
        yPercent: 0,
        duration: MOTION.hero.line,
        stagger: MOTION.hero.lineStagger,
        ease: MOTION.ease.out,
      },
      MOTION.hero.lineAt,
    );
  }
  if (isGsapTarget(follow)) {
    timeline.to(
      follow,
      {
        y: 0,
        duration: MOTION.hero.follow,
        stagger: MOTION.hero.followStagger,
      },
      MOTION.hero.followAt,
    );
  }

  return timeline;
}
