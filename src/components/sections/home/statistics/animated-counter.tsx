'use client';

import { useLayoutEffect, useRef, type RefObject } from 'react';
import { MOTION, motionPair } from '@/config/motion';
import { gsap, prefersReducedMotion } from '@/lib/gsap';
import { formatStatisticDisplay } from '@/lib/format-number';

type AnimatedCounterProps = {
  value: number;
  locale: string;
  prefix?: string;
  suffix?: string;
  delay?: number;
  triggerRef?: RefObject<Element | null>;
};

export function AnimatedCounter({
  value,
  locale,
  prefix = '',
  suffix = '',
  delay = 0,
  triggerRef,
}: AnimatedCounterProps) {
  const valueRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const node = valueRef.current;
    const trigger = triggerRef?.current ?? node;
    if (!node || !trigger) {
      return;
    }

    const write = (next: number) => {
      node.textContent = formatStatisticDisplay(next, locale, prefix, suffix);
    };

    if (prefersReducedMotion()) {
      write(value);
      return;
    }

    write(0);

    const proxy = { n: 0 };
    const tween = gsap.to(proxy, {
      n: value,
      duration: motionPair(MOTION.counter),
      ease: MOTION.ease.out,
      paused: true,
      onUpdate: () => {
        write(Math.round(proxy.n));
      },
      onComplete: () => {
        write(value);
      },
    });

    let played = false;
    let intro: gsap.core.Tween | undefined;
    const play = () => {
      if (played) {
        return;
      }
      played = true;
      intro = gsap.delayedCall(delay, () => {
        tween.play(0);
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          play();
          observer.disconnect();
        }
      },
      {
        threshold: 0.45,
        rootMargin: '0px 0px -12% 0px',
      },
    );

    observer.observe(trigger);

    return () => {
      observer.disconnect();
      intro?.kill();
      tween.kill();
    };
  }, [value, locale, prefix, suffix, delay, triggerRef]);

  return (
    <span ref={valueRef} className="statistics-value" aria-hidden="true">
      {formatStatisticDisplay(0, locale, prefix, suffix)}
    </span>
  );
}
