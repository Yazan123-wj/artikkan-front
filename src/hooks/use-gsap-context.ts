'use client';

import {
  useLayoutEffect,
  type DependencyList,
  type RefObject,
} from 'react';
import { gsap, prefersReducedMotion } from '@/lib/gsap';

type GsapContextCallback = (context: gsap.Context) => void | (() => void);

export function useGsapContext(
  callback: GsapContextCallback,
  scopeRef: RefObject<Element | null>,
  deps: DependencyList = [],
): void {
  useLayoutEffect(() => {
    if (typeof window === 'undefined' || prefersReducedMotion()) {
      return;
    }

    let extraCleanup: void | (() => void);

    const ctx = gsap.context((self) => {
      extraCleanup = callback(self);
    }, scopeRef);

    return () => {
      extraCleanup?.();
      ctx.revert();
    };
    // Consumers pass an explicit dependency list, matching useEffect.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- deps are caller-controlled
  }, deps);
}
