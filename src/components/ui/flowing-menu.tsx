'use client';

import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { LocalizedLink } from '@/components/shared/localized-link';
import { MOTION } from '@/config/motion';
import { gsap, prefersReducedMotion } from '@/lib/gsap';
import { cn } from '@/lib/utils';
import type { NavItem } from '@/types/navigation';

export type FlowingMenuItem = {
  href: NavItem['href'];
  text: string;
  image: string;
};

type FlowingMenuProps = {
  items: readonly FlowingMenuItem[];
  speed?: number;
  textColor?: string;
  bgColor?: string;
  marqueeBgColor?: string;
  marqueeTextColor?: string;
  borderColor?: string;
  active?: boolean;
  onNavigate?: () => void;
  className?: string;
  'aria-label'?: string;
};

type MenuItemProps = FlowingMenuItem & {
  speed: number;
  textColor: string;
  marqueeBgColor: string;
  marqueeTextColor: string;
  borderColor: string;
  active: boolean;
  onNavigate?: () => void;
};

function distMetric(x: number, y: number, x2: number, y2: number): number {
  const xDiff = x - x2;
  const yDiff = y - y2;
  return xDiff * xDiff + yDiff * yDiff;
}

function findClosestEdge(
  mouseX: number,
  mouseY: number,
  width: number,
  height: number,
): 'top' | 'bottom' {
  const topEdgeDist = distMetric(mouseX, mouseY, width / 2, 0);
  const bottomEdgeDist = distMetric(mouseX, mouseY, width / 2, height);
  return topEdgeDist < bottomEdgeDist ? 'top' : 'bottom';
}

function MenuItem({
  href,
  text,
  image,
  speed,
  textColor,
  marqueeBgColor,
  marqueeTextColor,
  borderColor,
  active,
  onNavigate,
}: MenuItemProps) {
  const itemRef = useRef<HTMLDivElement | null>(null);
  const marqueeRef = useRef<HTMLDivElement | null>(null);
  const marqueeInnerRef = useRef<HTMLDivElement | null>(null);
  const animationRef = useRef<gsap.core.Tween | null>(null);
  const [repetitions, setRepetitions] = useState(4);

  useEffect(() => {
    const calculateRepetitions = () => {
      const marqueeContent =
        marqueeInnerRef.current?.querySelector<HTMLElement>(
          '.flowing-menu__part',
        );
      if (!marqueeContent) {
        return;
      }

      const contentWidth = marqueeContent.offsetWidth;
      if (contentWidth === 0) {
        return;
      }

      const needed = Math.ceil(window.innerWidth / contentWidth) + 2;
      setRepetitions(Math.max(4, needed));
    };

    calculateRepetitions();
    window.addEventListener('resize', calculateRepetitions);
    return () => window.removeEventListener('resize', calculateRepetitions);
  }, [text, image]);

  useEffect(() => {
    if (prefersReducedMotion()) {
      animationRef.current?.kill();
      animationRef.current = null;
      return;
    }

    const setupMarquee = () => {
      const inner = marqueeInnerRef.current;
      const marqueeContent = inner?.querySelector<HTMLElement>(
        '.flowing-menu__part',
      );
      if (!inner || !marqueeContent) {
        return;
      }

      const contentWidth = marqueeContent.offsetWidth;
      if (contentWidth === 0) {
        return;
      }

      animationRef.current?.kill();
      animationRef.current = gsap.to(inner, {
        x: -contentWidth,
        duration: speed,
        ease: 'none',
        repeat: -1,
      });
    };

    const timer = window.setTimeout(setupMarquee, 50);
    return () => {
      window.clearTimeout(timer);
      animationRef.current?.kill();
      animationRef.current = null;
    };
  }, [text, image, repetitions, speed]);

  const animationDefaults = {
    duration: MOTION.flowingMenu.hover,
    ease: MOTION.flowingMenu.ease,
  };

  const handleMouseEnter = (event: MouseEvent<HTMLAnchorElement>) => {
    const item = itemRef.current;
    const marquee = marqueeRef.current;
    const inner = marqueeInnerRef.current;
    if (!item || !marquee || !inner || prefersReducedMotion()) {
      return;
    }

    const rect = item.getBoundingClientRect();
    const edge = findClosestEdge(
      event.clientX - rect.left,
      event.clientY - rect.top,
      rect.width,
      rect.height,
    );

    gsap.killTweensOf([marquee, inner], 'y');
    gsap
      .timeline({ defaults: animationDefaults })
      .set(marquee, { y: edge === 'top' ? '-101%' : '101%' }, 0)
      .set(inner, { y: edge === 'top' ? '101%' : '-101%' }, 0)
      .to([marquee, inner], { y: '0%' }, 0);
  };

  const handleMouseLeave = (event: MouseEvent<HTMLAnchorElement>) => {
    const item = itemRef.current;
    const marquee = marqueeRef.current;
    const inner = marqueeInnerRef.current;
    if (!item || !marquee || !inner || prefersReducedMotion()) {
      return;
    }

    const rect = item.getBoundingClientRect();
    const edge = findClosestEdge(
      event.clientX - rect.left,
      event.clientY - rect.top,
      rect.width,
      rect.height,
    );

    gsap.killTweensOf([marquee, inner], 'y');
    gsap
      .timeline({ defaults: animationDefaults })
      .to(marquee, { y: edge === 'top' ? '-101%' : '101%' }, 0)
      .to(inner, { y: edge === 'top' ? '101%' : '-101%' }, 0);
  };

  return (
    <div
      ref={itemRef}
      className="flowing-menu__item"
      style={{ borderColor }}
    >
      <LocalizedLink
        href={href}
        className="flowing-menu__link"
        tabIndex={active ? undefined : -1}
        onClick={onNavigate}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ color: textColor }}
      >
        {text}
      </LocalizedLink>
      <div
        className="flowing-menu__marquee"
        ref={marqueeRef}
        style={{ backgroundColor: marqueeBgColor }}
        aria-hidden="true"
      >
        <div className="flowing-menu__marquee-inner-wrap">
          <div className="flowing-menu__marquee-inner" ref={marqueeInnerRef}>
            {Array.from({ length: repetitions }, (_, idx) => (
              <div
                className="flowing-menu__part"
                key={`${text}-${idx}`}
                style={{ color: marqueeTextColor }}
              >
                <span>{text}</span>
                <div
                  className="flowing-menu__img"
                  style={{ backgroundImage: `url(${image})` }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function FlowingMenu({
  items = [],
  speed = 15,
  textColor = '#161616',
  bgColor = '#f6f4f0',
  marqueeBgColor = '#111111',
  marqueeTextColor = '#f4f1ea',
  borderColor = 'rgb(22 22 22 / 0.14)',
  active = true,
  onNavigate,
  className,
  'aria-label': ariaLabel,
}: FlowingMenuProps) {
  return (
    <div
      className={cn('flowing-menu', className)}
      style={{ backgroundColor: bgColor }}
    >
      <nav className="flowing-menu__nav" aria-label={ariaLabel}>
        {items.map((item) => (
          <MenuItem
            key={`${item.href}-${item.text}`}
            {...item}
            speed={speed}
            textColor={textColor}
            marqueeBgColor={marqueeBgColor}
            marqueeTextColor={marqueeTextColor}
            borderColor={borderColor}
            active={active}
            onNavigate={onNavigate}
          />
        ))}
      </nav>
    </div>
  );
}
