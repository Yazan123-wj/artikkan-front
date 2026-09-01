'use client';

import { useLayoutEffect } from 'react';

export function ScrollOrigin() {
  useLayoutEffect(() => {
    try {
      if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
      }

      if (!window.location.hash) {
        window.scrollTo(0, 0);
      }

      const onPageShow = () => {
        if (!window.location.hash) {
          window.scrollTo(0, 0);
        }
      };

      window.addEventListener('pageshow', onPageShow);
      return () => window.removeEventListener('pageshow', onPageShow);
    } catch {
      return undefined;
    }
  }, []);

  return null;
}
