'use client';

import { useLayoutEffect } from 'react';
import { ScrollTrigger } from '@/lib/gsap';
import {
  isReloadNavigation,
  persistScrollPosition,
  readSavedScrollPosition,
} from '@/lib/scroll-memory';

export function ScrollOrigin() {
  useLayoutEffect(() => {
    const restoreOnReload = isReloadNavigation();

    try {
      if ('scrollRestoration' in history) {
        history.scrollRestoration = restoreOnReload ? 'auto' : 'manual';
      }
    } catch {
      // ignore
    }

    const persist = () => persistScrollPosition();
    window.addEventListener('pagehide', persist);

    if (restoreOnReload) {
      const savedY = readSavedScrollPosition() ?? window.scrollY;
      const restore = () => {
        if (savedY > 1 && Math.abs(window.scrollY - savedY) > 8) {
          window.scrollTo(0, savedY);
        }
      };
      restore();
      const frame = window.requestAnimationFrame(() => {
        restore();
        window.requestAnimationFrame(restore);
      });
      const later = window.setTimeout(restore, 180);
      window.addEventListener('load', restore, { once: true });
      ScrollTrigger.addEventListener('refresh', restore);

      return () => {
        window.removeEventListener('pagehide', persist);
        window.cancelAnimationFrame(frame);
        window.clearTimeout(later);
        ScrollTrigger.removeEventListener('refresh', restore);
      };
    }

    if (!window.location.hash) {
      window.scrollTo(0, 0);
    }

    return () => window.removeEventListener('pagehide', persist);
  }, []);

  return null;
}
