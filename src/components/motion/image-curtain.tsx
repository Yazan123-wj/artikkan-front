'use client';

import { useLayoutEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import { MOTION } from '@/config/motion';
import { gsap, prefersReducedMotion } from '@/lib/gsap';
import { cn } from '@/lib/utils';

type ImageCurtainProps = {
  children: ReactNode;
  className?: string;
  frameClassName?: string;
  aspectRatio?: string;
  parallax?: boolean;
  header?: ReactNode;
  copy?: ReactNode;
};

const PARALLAX_QUERY = '(min-width: 768px) and (hover: hover) and (pointer: fine)';

function waitForFrameImage(root: HTMLElement): Promise<void> {
  const image = root.querySelector('img');
  if (!image) {
    return Promise.resolve();
  }

  if (image.complete && image.naturalWidth > 0) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    const finish = () => resolve();
    image.addEventListener('load', finish, { once: true });
    image.addEventListener('error', finish, { once: true });
  });
}

export function ImageCurtain({
  children,
  className,
  frameClassName,
  aspectRatio = '4 / 5',
  parallax = false,
  header,
  copy,
}: ImageCurtainProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) {
      return;
    }

    const panel = root.querySelector<HTMLElement>('[data-curtain-panel]');
    const scale = root.querySelector<HTMLElement>('[data-curtain-scale]');
    const parallaxLayer = root.querySelector<HTMLElement>('[data-curtain-parallax]');
    const copyNodes = root.querySelectorAll<HTMLElement>('[data-curtain-copy]');
    const reduced = prefersReducedMotion();

    if (reduced) {
      if (panel) {
        gsap.set(panel, { yPercent: -101 });
      }
      if (scale) {
        gsap.set(scale, { scale: 1 });
      }
      if (copyNodes.length > 0) {
        gsap.set(copyNodes, { autoAlpha: 1, y: 0 });
      }
      return;
    }

    const ctx = gsap.context(() => {
      if (panel) {
        gsap.set(panel, { yPercent: 0 });
      }
      if (scale) {
        gsap.set(scale, { scale: MOTION.imageCurtain.scaleFrom });
      }
      if (copyNodes.length > 0) {
        gsap.set(copyNodes, {
          autoAlpha: 0,
          y: MOTION.imageCurtain.copyY,
        });
      }
    }, root);

    let revealed = false;
    let failsafe = 0;

    const reveal = () => {
      if (revealed) {
        return;
      }
      revealed = true;
      window.clearTimeout(failsafe);

      ctx.add(() => {
        const timeline = gsap.timeline({
          defaults: { ease: MOTION.ease.inOut },
          scrollTrigger: {
            trigger: root,
            start: MOTION.imageCurtain.start,
            once: true,
          },
        });

        if (panel) {
          timeline.to(
            panel,
            { yPercent: -101, duration: MOTION.imageCurtain.panel },
            0,
          );
        }

        if (scale) {
          timeline.to(
            scale,
            {
              scale: 1,
              duration: MOTION.imageCurtain.scale,
              ease: MOTION.ease.settle,
            },
            0.06,
          );
        }

        if (copyNodes.length > 0) {
          timeline.to(
            copyNodes,
            {
              autoAlpha: 1,
              y: 0,
              duration: MOTION.imageCurtain.copy,
              stagger: MOTION.imageCurtain.copyStagger,
              ease: MOTION.ease.out,
            },
            0.22,
          );
        }
      });
    };

    failsafe = window.setTimeout(reveal, 2500);
    void waitForFrameImage(root).then(reveal);

    const desktop = window.matchMedia(PARALLAX_QUERY);
    if (parallax && parallaxLayer && desktop.matches) {
      ctx.add(() => {
        gsap.fromTo(
          parallaxLayer,
          { y: MOTION.imageCurtain.parallaxFrom },
          {
            y: MOTION.imageCurtain.parallaxTo,
            ease: 'none',
            scrollTrigger: {
              trigger: root,
              start: 'top bottom',
              end: 'bottom top',
              scrub: MOTION.imageCurtain.scrub,
            },
          },
        );
      });
    }

    return () => {
      window.clearTimeout(failsafe);
      ctx.revert();
    };
  }, [parallax]);

  const frameStyle = {
    '--curtain-aspect': aspectRatio,
  } as CSSProperties;

  return (
    <div ref={rootRef} className={cn('image-curtain', className)}>
      {header ? <div data-curtain-copy>{header}</div> : null}
      <div
        className={cn('image-curtain-frame', frameClassName)}
        style={frameStyle}
      >
        <div className="image-curtain-parallax" data-curtain-parallax>
          <div className="image-curtain-scale" data-curtain-scale>
            {children}
          </div>
        </div>
        <div className="image-curtain-panel" data-curtain-panel aria-hidden="true" />
      </div>
      {copy ? <div data-curtain-copy>{copy}</div> : null}
    </div>
  );
}
