'use client';

import { useRef, type ReactNode } from 'react';
import { useGsapContext } from '@/hooks/use-gsap-context';
import { revealElements } from '@/lib/motion-timelines';

type ContactRevealProps = {
  children: ReactNode;
};

export function ContactReveal({ children }: ContactRevealProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useGsapContext(() => {
    const root = rootRef.current;
    if (!root) {
      return;
    }

    const items = root.querySelectorAll('[data-contact-reveal]');
    if (items.length === 0) {
      return;
    }

    revealElements(items, { trigger: root });
  }, rootRef);

  return <div ref={rootRef}>{children}</div>;
}
