'use client';

import { useEffect, useState } from 'react';

/**
 * For capability checks only (hero sequence choice, reduced motion).
 * Do not use this hook to switch ordinary layout — use CSS.
 */

export function useMediaQuery(query: string): boolean | undefined {
  const [matches, setMatches] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const update = () => {
      setMatches(mediaQuery.matches);
    };

    update();
    mediaQuery.addEventListener('change', update);

    return () => {
      mediaQuery.removeEventListener('change', update);
    };
  }, [query]);

  return matches;
}
