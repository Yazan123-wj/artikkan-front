'use client';

/* Hero poster must keep source proportions; do not route through next/image. */
/* eslint-disable @next/next/no-img-element */

import { useLayoutEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { useLogoDock } from '@/components/navigation/logo-dock-context';
import {
  getHeroSequenceVariant,
  HERO_MEDIA,
  HERO_SEQUENCE,
  LOGO_DOCK_PROGRESS,
  MOBILE_HERO_QUERY,
} from '@/config/hero';
import { gsap, prefersReducedMotion, ScrollTrigger } from '@/lib/gsap';
import {
  canvasIsSupported,
  detectHeroFrameCount,
  drawHeroFrame,
  getHeroFrameCount,
  getLoadedHeroFrame,
  loadHeroFrame,
  resizeHeroCanvas,
  startHeroSequenceBackground,
} from './hero-sequence';
import { frameIndexFromProgress } from './hero.utils';

const HERO_SCROLL_ID = 'artikkan-hero';

type FitValues = {
  x: number;
  y: number;
  scale: number;
};

function captureLogoFit(
  logo: HTMLElement,
  slot: HTMLElement,
): FitValues {
  gsap.set(logo, {
    x: 0,
    y: 0,
    scale: 1,
    xPercent: -50,
    yPercent: -50,
    rotation: 0,
  });

  const logoRect = logo.getBoundingClientRect();
  const slotRect = slot.getBoundingClientRect();
  const logoWidth = logoRect.width || 1;

  return {
    x: window.innerWidth / 2 - (logoRect.left + logoRect.width / 2),
    y: slotRect.top + slotRect.height / 2 - (logoRect.top + logoRect.height / 2),
    scale: slotRect.width / logoWidth,
  };
}

export function Hero() {
  const t = useTranslations('a11y');
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { headerRef, navSlotRef, wordmarkRef } = useLogoDock();

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const logo = wordmarkRef.current;
    const slot = navSlotRef.current;
    const header = headerRef.current;
    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (!section || !logo || !slot) {
      return;
    }

    ScrollTrigger.getById(HERO_SCROLL_ID)?.kill();

    const chrome = header?.closest('.site-chrome');
    const reduced = prefersReducedMotion();
    const mobileQuery = window.matchMedia(MOBILE_HERO_QUERY);

    const setNavDocked = (docked: boolean) => {
      header?.classList.toggle('is-nav-docked', docked);
      chrome?.classList.toggle('is-nav-docked', docked);
    };

    gsap.set(logo, {
      xPercent: -50,
      yPercent: -50,
      x: 0,
      y: 0,
      scale: 1,
      transformOrigin: 'center center',
    });

    if (reduced) {
      const fit = captureLogoFit(logo, slot);
      gsap.set(logo, {
        x: fit.x,
        y: fit.y,
        scale: fit.scale,
        xPercent: -50,
        yPercent: -50,
      });
      setNavDocked(true);
      section.classList.add('is-reduced');
      return;
    }

    const runtime = {
      cancelled: false,
      raf: 0,
      targetFrame: 1,
      displayFrame: 1,
      drawnFrame: -1,
      lastTime: 0,
      variant: getHeroSequenceVariant(mobileQuery.matches),
      ctx: null as CanvasRenderingContext2D | null,
      stopBackground: () => undefined as void,
      fallback: false,
    };

    const enableFallback = () => {
      if (runtime.fallback || runtime.cancelled) {
        return;
      }

      runtime.fallback = true;
      section.classList.add('is-fallback');

      if (!video) {
        return;
      }

      video.src = HERO_MEDIA.fallbackVideo;
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      video.preload = 'metadata';
      void video.play().catch(() => {
        video.classList.remove('is-ready');
      });
      video.classList.add('is-ready');
    };

    const paint = (time: number) => {
      runtime.raf = 0;
      if (runtime.cancelled || runtime.fallback || !canvas) {
        return;
      }

      const ctx = runtime.ctx;
      if (!ctx) {
        return;
      }

      const deltaMs = runtime.lastTime ? Math.min(48, time - runtime.lastTime) : 16.67;
      runtime.lastTime = time;
      const distance = runtime.targetFrame - runtime.displayFrame;
      const catchUp = Math.min(0.42, 0.2 + Math.abs(distance) / 90);
      const smoothing = 1 - Math.pow(1 - catchUp, deltaMs / 16.67);
      runtime.displayFrame += distance * smoothing;

      if (Math.abs(runtime.targetFrame - runtime.displayFrame) < 0.28) {
        runtime.displayFrame = runtime.targetFrame;
      }

      const view = resizeHeroCanvas(canvas);
      const requested = Math.round(runtime.displayFrame);
      const loaded = getLoadedHeroFrame(runtime.variant, requested);

      if (loaded && (loaded.index !== runtime.drawnFrame || view.changed)) {
        drawHeroFrame(ctx, loaded.frame, view);
        runtime.drawnFrame = loaded.index;
        canvas.classList.add('is-ready');
      }

      const stillMoving =
        Math.abs(runtime.targetFrame - runtime.displayFrame) >= 0.28;
      if (stillMoving) {
        runtime.raf = requestAnimationFrame(paint);
      }
    };

    const scheduleDraw = () => {
      if (runtime.cancelled || runtime.fallback || runtime.raf) {
        return;
      }
      runtime.lastTime = 0;
      runtime.raf = requestAnimationFrame(paint);
    };

    const setTargetFrame = (index: number) => {
      const frameCount = getHeroFrameCount(runtime.variant);
      const next = Math.min(frameCount, Math.max(1, index));
      if (next === runtime.targetFrame) {
        return;
      }
      runtime.targetFrame = next;
      scheduleDraw();
    };

    const applySequenceProgress = (progress: number) => {
      if (progress <= LOGO_DOCK_PROGRESS) {
        setTargetFrame(1);
        return;
      }

      const sequenceProgress =
        (progress - LOGO_DOCK_PROGRESS) / (1 - LOGO_DOCK_PROGRESS);
      setTargetFrame(
        frameIndexFromProgress(
          sequenceProgress,
          getHeroFrameCount(runtime.variant),
        ),
      );
    };

    const startSequence = () => {
      if (!canvas || !canvasIsSupported()) {
        enableFallback();
        return;
      }

      runtime.ctx = canvas.getContext('2d', { alpha: false });
      if (!runtime.ctx) {
        enableFallback();
        return;
      }

      const variant = runtime.variant;

      void detectHeroFrameCount(variant).then((count) => {
        if (runtime.cancelled || runtime.variant !== variant || count <= 0) {
          if (count <= 0 && runtime.variant === variant) {
            enableFallback();
          }
          return;
        }
        ScrollTrigger.refresh();
      });

      void loadHeroFrame(variant, 1)
        .then(() => {
          if (runtime.cancelled || runtime.variant !== variant) {
            return;
          }
          runtime.drawnFrame = -1;
          scheduleDraw();
        })
        .catch(() => {
          if (runtime.variant === variant) {
            enableFallback();
          }
        });

      runtime.stopBackground();
      runtime.stopBackground = startHeroSequenceBackground(
        variant === 'mobile',
        () => runtime.targetFrame,
        () => {
          runtime.drawnFrame = -1;
          scheduleDraw();
        },
      );
    };

    startSequence();

    const fit: FitValues = { x: 0, y: 0, scale: 1 };
    const recapture = () => {
      Object.assign(fit, captureLogoFit(logo, slot));
    };
    recapture();

    const ctx = gsap.context(() => {
      const pinDistance = () => {
        const viewports = HERO_SEQUENCE[runtime.variant].pinViewports;
        return Math.round(window.innerHeight * viewports);
      };

      const timeline = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          id: HERO_SCROLL_ID,
          trigger: section,
          start: 'top top',
          end: () => `+=${pinDistance()}`,
          pin: true,
          pinSpacing: true,
          scrub: mobileQuery.matches ? 0.28 : 0.38,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onRefreshInit: recapture,
          onUpdate: (self) => {
            setNavDocked(self.progress >= LOGO_DOCK_PROGRESS);
            applySequenceProgress(self.progress);
          },
        },
      });

      timeline.fromTo(
        logo,
        { x: 0, y: 0, scale: 1, xPercent: -50, yPercent: -50 },
        {
          x: () => fit.x,
          y: () => fit.y,
          scale: () => fit.scale,
          xPercent: -50,
          yPercent: -50,
          duration: LOGO_DOCK_PROGRESS,
          ease: 'power2.inOut',
        },
        0,
      );

      timeline.to({}, { duration: 1 - LOGO_DOCK_PROGRESS }, LOGO_DOCK_PROGRESS);
    }, section);

    const onMedia = () => {
      runtime.variant = getHeroSequenceVariant(mobileQuery.matches);
      runtime.targetFrame = 1;
      runtime.displayFrame = 1;
      runtime.drawnFrame = -1;
      runtime.stopBackground();
      startSequence();
      ScrollTrigger.refresh();
    };
    mobileQuery.addEventListener('change', onMedia);

    const viewport = window.visualViewport;
    let viewportRaf = 0;
    const onViewportResize = () => {
      if (viewportRaf) {
        return;
      }
      viewportRaf = requestAnimationFrame(() => {
        viewportRaf = 0;
        recapture();
        runtime.drawnFrame = -1;
        scheduleDraw();
        ScrollTrigger.refresh();
      });
    };
    viewport?.addEventListener('resize', onViewportResize);
    window.addEventListener('resize', onViewportResize);

    const atHeroStart = () => {
      const pin = ScrollTrigger.getById(HERO_SCROLL_ID);
      return window.scrollY <= 0 || (pin != null && pin.progress <= 0.001);
    };

    const blockTopOverscroll = (event: WheelEvent) => {
      if (event.deltaY < 0 && atHeroStart()) {
        event.preventDefault();
      }
    };

    let touchStartY = 0;
    const onTouchStart = (event: TouchEvent) => {
      touchStartY = event.touches[0]?.clientY ?? 0;
    };
    const onTouchMove = (event: TouchEvent) => {
      const y = event.touches[0]?.clientY ?? 0;
      if (y > touchStartY && atHeroStart() && event.cancelable) {
        event.preventDefault();
      }
    };

    window.addEventListener('wheel', blockTopOverscroll, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });

    return () => {
      runtime.cancelled = true;
      runtime.stopBackground();
      if (runtime.raf) {
        cancelAnimationFrame(runtime.raf);
      }
      if (viewportRaf) {
        cancelAnimationFrame(viewportRaf);
      }
      viewport?.removeEventListener('resize', onViewportResize);
      window.removeEventListener('resize', onViewportResize);
      window.removeEventListener('wheel', blockTopOverscroll);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      mobileQuery.removeEventListener('change', onMedia);
      video?.pause();
      setNavDocked(false);
      ctx.revert();
      ScrollTrigger.getById(HERO_SCROLL_ID)?.kill();
    };
  }, [headerRef, navSlotRef, wordmarkRef]);

  return (
    <section ref={sectionRef} className="hero" aria-label={t('logo')}>
      <h1 className="hero-sr-only">{t('logo')}</h1>
      <div className="hero-media">
        <img
          src={HERO_MEDIA.poster}
          alt=""
          className="hero-poster"
          width={1920}
          height={1080}
          draggable={false}
        />
        <canvas
          ref={canvasRef}
          className="hero-canvas"
          aria-hidden="true"
        />
        <video
          ref={videoRef}
          className="hero-video"
          poster={HERO_MEDIA.poster}
          muted
          playsInline
          loop
          preload="none"
          controls={false}
          disablePictureInPicture
          disableRemotePlayback
          tabIndex={-1}
          aria-hidden="true"
        />
      </div>
      <div className="hero-overlay" aria-hidden="true" />
    </section>
  );
}
