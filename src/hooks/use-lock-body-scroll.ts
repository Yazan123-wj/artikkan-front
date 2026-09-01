'use client';

import { useEffect } from 'react';

/**
 * Freeze page scrolling without `overflow: hidden` on `html`.
 * Changing html overflow makes GSAP ScrollTrigger refresh and jumps the pinned hero.
 */
export function useLockBodyScroll(locked: boolean, className: string): void {
  useEffect(() => {
    if (!locked) {
      return;
    }

    let lockX = window.scrollX;
    let lockY = window.scrollY;

    const retargetLockFromHash = () => {
      const id = window.location.hash.replace(/^#/, '');
      if (!id) {
        return;
      }

      const target = document.getElementById(id);
      if (!target) {
        return;
      }

      const margin = Number.parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
      lockX = 0;
      lockY = Math.max(
        0,
        window.scrollY + target.getBoundingClientRect().top - margin,
      );
      window.scrollTo(lockX, lockY);
    };

    const shouldAllowInnerScroll = (target: EventTarget | null) => {
      if (!(target instanceof Element)) {
        return false;
      }

      const inner = target.closest(
        '.menu-overlay-inner, .enquiry-modal-panel',
      );
      if (!(inner instanceof HTMLElement)) {
        return false;
      }

      return inner.scrollHeight - inner.clientHeight > 1;
    };

    const onWheel = (event: WheelEvent) => {
      if (shouldAllowInnerScroll(event.target)) {
        const inner = (event.target as Element).closest(
          '.menu-overlay-inner, .enquiry-modal-panel',
        ) as HTMLElement;
        const atTop = inner.scrollTop <= 0 && event.deltaY < 0;
        const atBottom =
          inner.scrollTop + inner.clientHeight >= inner.scrollHeight - 1 &&
          event.deltaY > 0;
        if (!atTop && !atBottom) {
          return;
        }
      }

      event.preventDefault();
    };

    const onTouchMove = (event: TouchEvent) => {
      if (shouldAllowInnerScroll(event.target)) {
        return;
      }

      event.preventDefault();
    };

    /* Catch-all for scroll vectors that cannot be prevented (scrollbar
       drags, keyboard scrolling, browser find): pin the position back. */
    const onScroll = () => {
      if (window.scrollX !== lockX || window.scrollY !== lockY) {
        window.scrollTo(lockX, lockY);
      }
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('scroll', onScroll);
    window.addEventListener('hashchange', retargetLockFromHash);
    document.documentElement.classList.add(className);

    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('hashchange', retargetLockFromHash);
      document.documentElement.classList.remove(className);
      window.scrollTo(lockX, lockY);
    };
  }, [locked, className]);
}
