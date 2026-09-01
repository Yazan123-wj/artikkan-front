'use client';

import { useRef, type ReactNode } from 'react';
import { useGsapContext } from '@/hooks/use-gsap-context';
import { revealElements } from '@/lib/motion-timelines';
import { cn } from '@/lib/utils';

type InteriorRevealProps = {
  children: ReactNode;
  className?: string;
};

export function InteriorReveal({ children, className }: InteriorRevealProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useGsapContext(() => {
    const root = rootRef.current;
    if (!root) {
      return;
    }

    const items = root.querySelectorAll('[data-interior-reveal]');
    if (items.length === 0) {
      return;
    }

    revealElements(items, { trigger: root });
  }, rootRef);

  return (
    <div ref={rootRef} className={cn(className)}>
      {children}
    </div>
  );
}
