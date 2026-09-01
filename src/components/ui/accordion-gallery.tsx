'use client';

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
} from 'react';
import Image from 'next/image';
import { LocalizedLink } from '@/components/shared/localized-link';
import { MOTION } from '@/config/motion';
import { useMediaQuery } from '@/hooks/use-media-query';
import { gsap, prefersReducedMotion } from '@/lib/gsap';
import { cn } from '@/lib/utils';

export type AccordionGalleryItem = {
  image: string;
  label: string;
  link?: string;
  alt?: string;
  imageAvailable?: boolean;
};

type AccordionGalleryProps = {
  items: readonly AccordionGalleryItem[];
  defaultIndex?: number;
  accentColor?: string;
  overlayColor?: string;
  textColor?: string;
  height?: number;
  gap?: number;
  radius?: number;
  expandRatio?: number;
  orientation?: 'horizontal' | 'vertical';
  duration?: number;
  ease?: string;
  parallax?: number;
  tilt?: number;
  stagger?: number;
  trigger?: 'hover' | 'click';
  showLabels?: boolean;
  grayscale?: boolean;
  className?: string;
  ariaLabel?: string;
};

export function AccordionGallery({
  items,
  defaultIndex = 2,
  accentColor = '#f6f4f0',
  overlayColor = '#161616',
  textColor = '#f6f4f0',
  height = 560,
  gap = 8,
  radius = 2,
  expandRatio = 0.5,
  orientation = 'horizontal',
  duration = MOTION.accordion.duration,
  ease = MOTION.accordion.ease,
  parallax = 0.45,
  tilt = 6,
  stagger = MOTION.accordion.stagger,
  trigger = 'hover',
  showLabels = true,
  grayscale = true,
  className = '',
  ariaLabel = 'Image accordion gallery',
}: AccordionGalleryProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<Array<HTMLElement | null>>([]);
  const mediaRefs = useRef<Array<HTMLElement | null>>([]);
  const barRefs = useRef<Array<HTMLElement | null>>([]);
  const textRefs = useRef<Array<HTMLElement | null>>([]);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const firstRunRef = useRef(true);
  const mediaSizeRef = useRef(320);
  const finePointer = useMediaQuery('(hover: hover) and (pointer: fine)');
  const pointerTrigger = finePointer ? trigger : 'click';

  const vertical = orientation === 'vertical';
  const count = items.length;
  const [active, setActive] = useState(() =>
    Math.min(Math.max(defaultIndex, 0), Math.max(count - 1, 0)),
  );

  const applyLayout = useCallback(
    (animate: boolean) => {
      const panels = panelRefs.current;
      if (!panels.length) {
        return;
      }

      const reduced = prefersReducedMotion();
      const rtl =
        typeof document !== 'undefined' &&
        document.documentElement.dir === 'rtl';
      const r = Math.min(Math.max(expandRatio, 0.2), 0.9);
      const grow = count > 1 ? (r * (count - 1)) / (1 - r) : 1;
      const mediaSize = mediaSizeRef.current;
      const captionShift = rtl ? 14 : -14;

      tlRef.current?.kill();
      const dur = animate && !reduced ? duration : 0;
      const tl = gsap.timeline();

      panels.forEach((panel, i) => {
        if (!panel) {
          return;
        }

        const isActive = i === active;
        const media = mediaRefs.current[i];
        const bar = barRefs.current[i];
        const text = textRefs.current[i];
        const rot = isActive ? 0 : i < active ? tilt : -tilt;
        const signedRot = rtl ? -rot : rot;
        const rotProp = vertical
          ? { rotateX: -signedRot }
          : { rotateY: signedRot };

        tl.to(
          panel,
          { flexGrow: isActive ? grow : 1, ...rotProp, duration: dur, ease },
          0,
        );

        if (media) {
          const drift = Math.max(-1.5, Math.min(1.5, active - i));
          const shift = drift * parallax * mediaSize * 0.06;
          const gray = grayscale ? (isActive ? 0 : 1) : 0;
          tl.to(
            media,
            {
              xPercent: -50,
              yPercent: -50,
              x: vertical ? 0 : isActive ? 0 : shift,
              y: vertical ? (isActive ? 0 : shift) : 0,
              '--ag-gray': gray,
              '--ag-dim': isActive ? 0 : 0.35,
              duration: dur,
              ease,
            },
            0,
          );
        }

        if (showLabels && bar && text) {
          if (isActive) {
            tl.to(
              [bar, text],
              {
                opacity: 1,
                x: 0,
                duration: dur,
                ease,
                stagger: reduced ? 0 : stagger,
              },
              0,
            );
          } else {
            tl.to(
              [bar, text],
              {
                opacity: 0,
                x: captionShift,
                duration: dur * 0.6,
                ease,
              },
              0,
            );
          }
        }
      });

      tlRef.current = tl;
    },
    [
      active,
      count,
      duration,
      ease,
      expandRatio,
      grayscale,
      parallax,
      showLabels,
      stagger,
      tilt,
      vertical,
    ],
  );

  useLayoutEffect(() => {
    const el = rootRef.current;
    if (!el) {
      return;
    }

    const measure = () => {
      const rect = el.getBoundingClientRect();
      const total = vertical ? rect.height : rect.width;
      const usable = Math.max(total - gap * (count - 1), 120);
      const size = Math.max(
        140,
        usable * Math.min(Math.max(expandRatio, 0.2), 0.9) * 1.22,
      );
      mediaSizeRef.current = size;
      el.style.setProperty('--ag-media-size', `${size}px`);
      applyLayout(!firstRunRef.current);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [applyLayout, count, expandRatio, gap, vertical]);

  useLayoutEffect(() => {
    applyLayout(!firstRunRef.current);
    firstRunRef.current = false;
  }, [applyLayout]);

  useEffect(
    () => () => {
      tlRef.current?.kill();
    },
    [],
  );

  const handleEnter = (index: number) => {
    if (pointerTrigger === 'hover') {
      setActive(index);
    }
  };

  const handleClick = (index: number, event: MouseEvent<HTMLElement>) => {
    if (index !== active) {
      event.preventDefault();
      setActive(index);
    }
  };

  const handleKeyDown = (
    index: number,
    event: KeyboardEvent<HTMLElement>,
  ) => {
    const rtl = document.documentElement.dir === 'rtl';
    const nextKey = rtl ? 'ArrowLeft' : 'ArrowRight';
    const prevKey = rtl ? 'ArrowRight' : 'ArrowLeft';

    if (event.key === nextKey || event.key === 'ArrowDown') {
      event.preventDefault();
      setActive((index + 1) % count);
    } else if (event.key === prevKey || event.key === 'ArrowUp') {
      event.preventDefault();
      setActive((index - 1 + count) % count);
    }
  };

  return (
    <div
      ref={rootRef}
      className={cn(
        'accordion-gallery',
        vertical && 'accordion-gallery--vertical',
        className,
      )}
      style={{
        ['--ag-accent' as string]: accentColor,
        ['--ag-overlay' as string]: overlayColor,
        ['--ag-text' as string]: textColor,
        ['--ag-gap' as string]: `${gap}px`,
        ['--ag-radius' as string]: `${radius}px`,
        ['--ag-height' as string]: `${height}px`,
      }}
      role="list"
      aria-label={ariaLabel}
    >
      {items.map((item, index) => {
        const isActive = index === active;
        const assignPanel = (node: HTMLElement | null) => {
          panelRefs.current[index] = node;
        };
        const panelClass = cn(
          'ag-panel',
          isActive && 'ag-panel--active',
        );
        const panelStyle = { borderRadius: `${radius}px` };
        const content = (
          <>
            <span className="ag-panel__frame">
              <span
                className="ag-panel__media"
                ref={(node) => {
                  mediaRefs.current[index] = node;
                }}
              >
                {item.imageAvailable !== false && item.image ? (
                  <Image
                    src={item.image}
                    alt={item.alt || item.label || ''}
                    fill
                    quality={90}
                    sizes="(min-width: 1024px) 42vw, 100vw"
                    className="ag-panel__img"
                    draggable={false}
                  />
                ) : (
                  <span className="ag-panel__pending" aria-hidden="true" />
                )}
              </span>
              <span className="ag-panel__overlay" aria-hidden="true" />
            </span>
            {showLabels ? (
              <span className="ag-panel__label" aria-hidden="true">
                <span
                  className="ag-panel__bar"
                  ref={(node) => {
                    barRefs.current[index] = node;
                  }}
                />
                <span
                  className="ag-panel__text"
                  ref={(node) => {
                    textRefs.current[index] = node;
                  }}
                >
                  {item.label}
                </span>
              </span>
            ) : null}
          </>
        );

        if (item.link) {
          return (
            <LocalizedLink
              key={item.label + index}
              href={item.link}
              ref={assignPanel}
              className={panelClass}
              style={panelStyle}
              onClick={(event) => handleClick(index, event)}
              onMouseEnter={() => handleEnter(index)}
              onFocus={() => setActive(index)}
              onKeyDown={(event) => handleKeyDown(index, event)}
              role="listitem"
              tabIndex={0}
              aria-current={isActive ? 'true' : undefined}
              aria-label={item.label}
            >
              {content}
            </LocalizedLink>
          );
        }

        return (
          <div
            key={item.label + index}
            ref={assignPanel}
            className={panelClass}
            style={panelStyle}
            onClick={(event) => handleClick(index, event)}
            onMouseEnter={() => handleEnter(index)}
            onFocus={() => setActive(index)}
            onKeyDown={(event) => handleKeyDown(index, event)}
            role="listitem"
            tabIndex={0}
            aria-current={isActive ? 'true' : undefined}
            aria-label={item.label}
          >
            {content}
          </div>
        );
      })}
    </div>
  );
}
