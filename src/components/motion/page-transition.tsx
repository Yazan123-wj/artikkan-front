'use client';

import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { MOTION, motionPair } from '@/config/motion';
import { gsap, prefersReducedMotion } from '@/lib/gsap';
import { usePathname } from '@/i18n/navigation';

type PageTransitionProps = {
  children: ReactNode;
};

function getWipeOrigins(): { cover: string; reveal: string } {
  const isRtl = document.documentElement.dir === 'rtl';
  return isRtl
    ? { cover: '100% 50%', reveal: '0% 50%' }
    : { cover: '0% 50%', reveal: '100% 50%' };
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const pathRef = useRef(pathname);
  const childrenRef = useRef(children);
  const overlayRef = useRef<HTMLDivElement>(null);
  const surfaceRef = useRef<HTMLDivElement>(null);
  const inkRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const [displayed, setDisplayed] = useState(children);

  useLayoutEffect(() => {
    childrenRef.current = children;
  }, [children]);

  useLayoutEffect(() => {
    const isAnimating = Boolean(timelineRef.current?.isActive());
    if (pathname === pathRef.current && !isAnimating) {
      setDisplayed(children);
    }
  }, [children, pathname]);

  useLayoutEffect(() => {
    if (pathname === pathRef.current) {
      return;
    }

    pathRef.current = pathname;
    timelineRef.current?.kill();

    if (prefersReducedMotion()) {
      setDisplayed(childrenRef.current);
      return;
    }

    const overlay = overlayRef.current;
    const surface = surfaceRef.current;
    const ink = inkRef.current;
    const content = contentRef.current;

    if (!overlay || !surface || !ink || !content) {
      setDisplayed(childrenRef.current);
      return;
    }

    const { cover, reveal } = getWipeOrigins();
    const coverDuration = motionPair(MOTION.page.cover);
    const revealDuration = motionPair(MOTION.page.reveal);
    const contentRise = motionPair(MOTION.page.contentRise);

    document.documentElement.classList.add('is-page-transitioning');
    overlay.setAttribute('data-active', 'true');

    const ctx = gsap.context(() => {
      gsap.set([surface, ink], {
        scaleX: 0,
        transformOrigin: cover,
      });

      const timeline = gsap.timeline({
        defaults: { ease: MOTION.ease.inOut },
        onComplete: () => {
          document.documentElement.classList.remove('is-page-transitioning');
          overlay.removeAttribute('data-active');
          gsap.set([surface, ink, content], {
            clearProps: 'transform,transformOrigin,opacity,visibility',
          });
          timelineRef.current = null;
        },
      });

      timeline
        .to(surface, { scaleX: 1, duration: coverDuration })
        .to(
          ink,
          { scaleX: 1, duration: coverDuration },
          `<${MOTION.page.inkOffset}`,
        )
        .add(() => {
          setDisplayed(childrenRef.current);
          if (!window.location.hash) {
            window.scrollTo(0, 0);
          }
        })
        .set([surface, ink], { transformOrigin: reveal })
        .fromTo(
          content,
          { autoAlpha: 0, y: contentRise },
          {
            autoAlpha: 1,
            y: 0,
            duration: revealDuration,
            ease: MOTION.ease.out,
          },
          '+=0.02',
        )
        .to(ink, { scaleX: 0, duration: revealDuration }, '<')
        .to(
          surface,
          { scaleX: 0, duration: revealDuration },
          `<${MOTION.page.inkOffset}`,
        );

      timelineRef.current = timeline;
    }, overlayRef);

    return () => {
      timelineRef.current?.kill();
      timelineRef.current = null;
      ctx.revert();
      document.documentElement.classList.remove('is-page-transitioning');
    };
  }, [pathname]);

  return (
    <div className="page-transition">
      <div
        ref={overlayRef}
        className="page-transition-overlay"
        aria-hidden="true"
      >
        <div ref={surfaceRef} className="page-transition-panel is-surface" />
        <div ref={inkRef} className="page-transition-panel is-ink" />
      </div>
      <div ref={contentRef} className="page-transition-content">
        {displayed}
      </div>
    </div>
  );
}
