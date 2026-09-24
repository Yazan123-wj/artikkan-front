'use client';

/* Brand marks must keep source proportions; do not route through next/image. */
/* eslint-disable @next/next/no-img-element */

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { useTranslations } from 'next-intl';
import { HamburgerButton } from '@/components/navigation/hamburger-button';
import { LanguageSwitcher } from '@/components/navigation/language-switcher';
import { useLogoDock } from '@/components/navigation/logo-dock-context';
import { MenuOverlay } from '@/components/navigation/menu-overlay';
import { LocalizedLink } from '@/components/shared/localized-link';
import { BRAND_ASSETS } from '@/config/hero';
import { MOTION, motionPair } from '@/config/motion';
import { useFocusTrap } from '@/hooks/use-focus-trap';
import { useLockBodyScroll } from '@/hooks/use-lock-body-scroll';
import { usePathname } from '@/i18n/navigation';
import { gsap, prefersReducedMotion, ScrollTrigger } from '@/lib/gsap';
import { cn } from '@/lib/utils';

type SiteHeaderProps = {
  isHome: boolean;
};

export function SiteHeader({ isHome }: SiteHeaderProps) {
  const t = useTranslations('a11y');
  const pathname = usePathname();
  const { headerRef, navSlotRef, wordmarkRef } = useLogoDock();
  const chromeRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const lockedScrollYRef = useRef<number | null>(null);
  const menuCloseGenRef = useRef(0);
  const menuTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const pageOnLightRef = useRef(!isHome);
  const [open, setOpen] = useState(false);
  const [menuChrome, setMenuChrome] = useState(false);
  const [onLight, setOnLight] = useState(!isHome);
  const [navReady, setNavReady] = useState(!isHome);
  const [menuPath, setMenuPath] = useState(pathname);

  const menuActive = open || menuChrome;

  if (menuPath !== pathname) {
    setMenuPath(pathname);
    setOpen(false);
    setMenuChrome(false);
    setOnLight(!isHome);
  }

  const resolvePageTheme = useCallback(() => {
    const chrome = chromeRef.current;
    const header = headerRef.current;
    let next = true;

    if (isHome) {
      const preservedY = lockedScrollYRef.current;
      const scrollCollapsed =
        preservedY != null && preservedY > 1 && window.scrollY < 1;

      if (!header || scrollCollapsed) {
        next = pageOnLightRef.current;
      } else {
        const hero = document.querySelector('.hero');
        next = hero
          ? hero.getBoundingClientRect().bottom <=
            header.getBoundingClientRect().bottom + 1
          : false;
      }
    }

    if (header) {
      const darkSection = document.querySelector('[data-nav-theme="dark"]');
      if (
        darkSection &&
        darkSection.getBoundingClientRect().top <=
          header.getBoundingClientRect().bottom + 1
      ) {
        next = false;
      }
    }

    pageOnLightRef.current = next;
    chrome?.classList.toggle('is-on-light', next);
    chrome?.classList.add('is-nav-ready');
    return next;
  }, [headerRef, isHome]);

  const commitPageTheme = useCallback(() => {
    const next = resolvePageTheme();
    setOnLight((current) => (current === next ? current : next));
    setNavReady(true);
  }, [resolvePageTheme]);

  const openMenu = () => {
    menuCloseGenRef.current += 1;
    lockedScrollYRef.current = window.scrollY;
    setMenuChrome(true);
    setOpen(true);
  };

  const requestCloseMenu = () => {
    setOpen(false);
  };

  useLockBodyScroll(menuActive, 'is-menu-open');
  useFocusTrap(open, chromeRef);

  useEffect(() => {
    if (!open) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        requestCloseMenu();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  useLayoutEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) {
      return;
    }

    /* Do not transform the overlay itself — the curtain panels move instead. */
    gsap.set(overlay, {
      clearProps: 'transform,translate,y,yPercent',
    });

    const surface = overlay.querySelector<HTMLElement>('[data-menu-curtain]');
    const ink = overlay.querySelector<HTMLElement>('[data-menu-curtain-ink]');
    const flow = overlay.querySelector<HTMLElement>('[data-menu-flow]');

    if (surface && ink) {
      gsap.set([surface, ink], { y: 0, yPercent: -101, force3D: true });
    }

    if (flow) {
      gsap.set(flow, { autoAlpha: 0, y: 0 });
    }
  }, []);

  const prevPathnameRef = useRef(pathname);

  useLayoutEffect(() => {
    if (prevPathnameRef.current === pathname) {
      return;
    }

    prevPathnameRef.current = pathname;
    menuCloseGenRef.current += 1;
    lockedScrollYRef.current = null;
  }, [pathname]);

  useLayoutEffect(() => {
    const overlay = overlayRef.current;
    const surface = overlay?.querySelector<HTMLElement>('[data-menu-curtain]');
    const ink = overlay?.querySelector<HTMLElement>('[data-menu-curtain-ink]');
    const flow = overlay?.querySelector<HTMLElement>('[data-menu-flow]');

    menuTimelineRef.current?.kill();
    menuTimelineRef.current = null;

    if (!overlay || !surface || !ink || !flow) {
      return;
    }

    const parkCurtain = () => {
      gsap.set([surface, ink], { y: 0, yPercent: -101, force3D: true });
      gsap.set(flow, { autoAlpha: 0, y: 0 });
    };

    if (!menuChrome) {
      parkCurtain();
      return;
    }

    const generation = menuCloseGenRef.current;
    const reduced = prefersReducedMotion();
    const dropDuration = motionPair(MOTION.menu.drop);
    const liftDuration = motionPair(MOTION.menu.lift);
    const flowRise = motionPair(MOTION.menu.flowRise);
    const flowExit = motionPair(MOTION.menu.flowExit);
    const flowIn = motionPair(MOTION.menu.flowIn);

    const finishClose = () => {
      if (generation !== menuCloseGenRef.current) {
        return;
      }

      parkCurtain();
      commitPageTheme();
      lockedScrollYRef.current = null;
      setMenuChrome(false);
    };

    if (reduced) {
      if (open) {
        gsap.set(surface, { y: 0, yPercent: 0, force3D: true });
        gsap.set(ink, { y: 0, yPercent: -101, force3D: true });
        gsap.set(flow, { autoAlpha: 1, y: 0 });
        return;
      }

      resolvePageTheme();
      queueMicrotask(finishClose);
      return;
    }

    if (open) {
      const timeline = gsap.timeline({
        defaults: { ease: MOTION.ease.inOut, overwrite: 'auto' },
        onComplete: () => {
          menuTimelineRef.current = null;
        },
      });

      timeline
        .fromTo(
          surface,
          { yPercent: -101 },
          { yPercent: 0, duration: dropDuration },
          0,
        )
        .fromTo(
          ink,
          { yPercent: -101 },
          { yPercent: 0, duration: dropDuration },
          MOTION.menu.inkOffset,
        )
        .to(ink, { yPercent: -101, duration: liftDuration })
        .fromTo(
          flow,
          { autoAlpha: 0, y: flowRise },
          {
            autoAlpha: 1,
            y: 0,
            duration: flowIn,
            ease: MOTION.ease.out,
          },
          '<0.08',
        );

      menuTimelineRef.current = timeline;
      return () => {
        timeline.kill();
        if (menuTimelineRef.current === timeline) {
          menuTimelineRef.current = null;
        }
      };
    }

    resolvePageTheme();

    const timeline = gsap.timeline({
      defaults: { ease: MOTION.ease.inOut, overwrite: 'auto' },
      onComplete: () => {
        menuTimelineRef.current = null;
        finishClose();
      },
    });

    timeline
      .to(flow, {
        autoAlpha: 0,
        y: flowExit,
        duration: MOTION.menu.flowOut,
        ease: MOTION.ease.in,
      })
      .to(
        ink,
        { yPercent: 0, duration: dropDuration * MOTION.menu.closeInkCover },
        '<0.03',
      )
      .to([surface, ink], { yPercent: -101, duration: liftDuration });

    menuTimelineRef.current = timeline;
    return () => {
      timeline.kill();
      if (menuTimelineRef.current === timeline) {
        menuTimelineRef.current = null;
      }
    };
  }, [open, menuChrome, resolvePageTheme, commitPageTheme]);

  useLayoutEffect(() => {
    const chrome = chromeRef.current;
    const header = headerRef.current;
    if (!chrome || !header) {
      return;
    }

    let trigger: ScrollTrigger | undefined;
    let cancelled = false;
    let attempts = 0;
    let raf = 0;

    const applyTheme = () => {
      if (cancelled || chrome.classList.contains('is-menu-open')) {
        return;
      }

      commitPageTheme();
    };

    const setup = () => {
      if (cancelled) {
        return;
      }

      if (isHome) {
        const reduced = prefersReducedMotion();
        const pin = ScrollTrigger.getById('artikkan-hero');
        const about = document.querySelector('.about-section');

        if (!about || (!reduced && !pin && attempts < 180)) {
          attempts += 1;
          raf = requestAnimationFrame(setup);
          return;
        }
      }

      ScrollTrigger.getById('nav-on-light')?.kill();

      trigger = ScrollTrigger.create({
        id: 'nav-on-light',
        start: 0,
        end: 'max',
        invalidateOnRefresh: true,
        onUpdate: applyTheme,
        onRefresh: applyTheme,
      });

      resolvePageTheme();
    };

    setup();

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      trigger?.kill();
    };
  }, [commitPageTheme, headerRef, isHome, resolvePageTheme]);

  return (
    <div
      ref={chromeRef}
      className={cn(
        'site-chrome',
        onLight && 'is-on-light',
        (!isHome || navReady) && 'is-nav-ready',
        menuActive && 'is-menu-open',
      )}
    >
      <header
        ref={headerRef}
        className={cn(
          'site-header',
          isHome ? 'is-home' : 'is-interior',
          menuActive && 'is-menu-open',
        )}
      >
        <div className="site-header-backdrop" data-nav-backdrop />
        <div className="site-header-grid site-container">
          <div className="site-header-start site-header-controls" data-header-controls>
            <HamburgerButton
              open={menuActive}
              onToggle={() => (open ? requestCloseMenu() : openMenu())}
              openLabel={t('openMenu')}
              closeLabel={t('closeMenu')}
            />
          </div>

          <div className="site-header-center">
            <div
              ref={navSlotRef}
              className="site-header-logo-slot"
              aria-hidden="true"
            />
            {isHome ? null : (
              <LocalizedLink href="/" className="touch-target">
                {/* Transparent RGBA asset recolored via CSS filter; the
                    "-dark" file is an opaque JPEG and renders as a box. */}
                <img
                  src={BRAND_ASSETS.navWordmark}
                  alt={t('logo')}
                  className="artikkan-wordmark is-nav"
                  width={1400}
                  height={392}
                  draggable={false}
                />
              </LocalizedLink>
            )}
          </div>

          <div className="site-header-end site-header-controls" data-header-controls>
            <LanguageSwitcher compact />
          </div>
        </div>
      </header>

      {isHome ? (
        <img
          ref={wordmarkRef}
          src={BRAND_ASSETS.navWordmark}
          alt={t('logo')}
          className="artikkan-wordmark is-hero"
          width={1400}
          height={392}
          draggable={false}
        />
      ) : null}

      <div className="menu-overlay-frost" data-menu-frost aria-hidden="true" />
      <MenuOverlay
        ref={overlayRef}
        open={open}
        visible={menuActive}
        onNavigate={requestCloseMenu}
      />
    </div>
  );
}
