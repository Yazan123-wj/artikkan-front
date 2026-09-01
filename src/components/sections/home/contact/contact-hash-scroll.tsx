'use client';

import { useEffect } from 'react';
import { usePathname } from '@/i18n/navigation';
import { prefersReducedMotion } from '@/lib/gsap';

const CONTACT_HASH = '#contact';

function scrollToContact() {
  if (window.location.hash !== CONTACT_HASH) {
    return false;
  }

  const target = document.getElementById('contact');
  if (!target) {
    return false;
  }

  const covered = document.documentElement.classList.contains(
    'is-page-transitioning',
  );

  target.scrollIntoView({
    behavior: covered || prefersReducedMotion() ? 'auto' : 'smooth',
    block: 'start',
  });
  return true;
}

export function ContactHashScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== '/') {
      return;
    }

    let cancelled = false;
    let attempts = 0;
    let raf = 0;

    const tryScroll = () => {
      if (cancelled) {
        return;
      }

      if (scrollToContact() || attempts >= 180) {
        return;
      }

      attempts += 1;
      raf = requestAnimationFrame(tryScroll);
    };

    raf = requestAnimationFrame(tryScroll);
    window.addEventListener('hashchange', tryScroll);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      window.removeEventListener('hashchange', tryScroll);
    };
  }, [pathname]);

  return null;
}
