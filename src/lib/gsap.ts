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

export { gsap, ScrollTrigger, Flip };
