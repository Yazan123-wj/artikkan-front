'use client';

import { useRef, type ReactNode } from 'react';
import { useGsapContext } from '@/hooks/use-gsap-context';
import { revealElements } from '@/lib/motion-timelines';

type JournalRevealProps = {
  children: ReactNode;
  className?: string;
};

export function JournalReveal({ children, className }: JournalRevealProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useGsapContext(() => {
    const root = rootRef.current;
    if (!root) {
      return;
    }

    const items = [...root.querySelectorAll('[data-journal-reveal]')];
    if (items.length === 0) {
      return;
    }

    items.forEach((item) => {
      revealElements(item, { trigger: item, stagger: 0 });
    });
  }, rootRef);

  return (
    <div ref={rootRef} className={className}>
      {children}
    </div>
  );
}
