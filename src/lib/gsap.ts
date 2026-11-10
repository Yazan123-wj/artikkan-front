import gsap from 'gsap';
import { Flip } from 'gsap/Flip';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const isBrowser = typeof window !== 'undefined';

if (isBrowser) {
  gsap.registerPlugin(ScrollTrigger, Flip);
}

export function prefersReducedMotion(): boolean {
  if (!isBrowser) {
    return true;
  }

  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function isGsapTarget(
  target: gsap.TweenTarget | null | undefined,
): target is gsap.TweenTarget {
  if (!target) {
    return false;
  }
  if (typeof NodeList !== 'undefined' && target instanceof NodeList) {
    return target.length > 0;
  }
  if (Array.isArray(target)) {
    return target.some(Boolean);
  }
  return true;
}

export function gsapSet(
  target: gsap.TweenTarget | null | undefined,
  vars: gsap.TweenVars,
) {
  if (!isGsapTarget(target)) {
    return;
  }
  gsap.set(target, vars);
}

export { gsap, ScrollTrigger, Flip };
