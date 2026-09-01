'use client';

import { useEffect, type RefObject } from 'react';

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

export function useFocusTrap(
  active: boolean,
  containerRef: RefObject<HTMLElement | null>,
): void {
  useEffect(() => {
    if (!active) {
      return;
    }

    const root = containerRef.current;
    if (!root) {
      return;
    }

    const previouslyFocused = document.activeElement as HTMLElement | null;

    const getFocusable = () =>
      [...root.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
        (node) => !node.hasAttribute('disabled') && node.tabIndex !== -1,
      );

    const menuFirst =
      root.querySelector<HTMLElement>('#site-menu .flowing-menu__link, #site-menu a') ??
      getFocusable()[0];
    menuFirst?.focus({ preventScroll: true });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') {
        return;
      }

      const items = getFocusable();
      if (items.length === 0) {
        event.preventDefault();
        return;
      }

      const first = items[0];
      const last = items[items.length - 1];
      const current = document.activeElement;

      if (event.shiftKey && current === first) {
        event.preventDefault();
        last.focus({ preventScroll: true });
        return;
      }

      if (!event.shiftKey && current === last) {
        event.preventDefault();
        first.focus({ preventScroll: true });
      }
    };

    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      previouslyFocused?.focus({ preventScroll: true });
    };
  }, [active, containerRef]);
}
