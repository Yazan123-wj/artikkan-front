'use client';

/* Brand marks must keep source proportions; do not route through next/image. */
/* eslint-disable @next/next/no-img-element */

import { useRef } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { FooterNewsletter } from '@/components/layout/footer-newsletter';
import { LocalizedLink } from '@/components/shared/localized-link';
import { getVerifiedContact } from '@/config/contact';
import { BRAND_ASSETS } from '@/config/hero';
import { legalNavigation, mainNavigation } from '@/config/navigation';
import {
  SOCIAL_LABELS,
  type SocialPlatform,
} from '@/config/social-links';
import { useGsapContext } from '@/hooks/use-gsap-context';
import { MAIN_CONTENT_ID } from '@/lib/constants';
import { prefersReducedMotion } from '@/lib/gsap';
import { revealElements } from '@/lib/motion-timelines';

function InstagramIcon() {
  return (
    <svg
      className="site-footer-social-icon"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle className="is-dot" cx="17.4" cy="6.6" r="0.85" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg
      className="site-footer-social-icon"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <rect x="3.5" y="3.5" width="17" height="17" rx="4" />
      <path
        className="is-mark"
        d="M13.15 18.5v-6.15h2.06l.31-2.4h-2.37V8.35c0-.7.2-1.18 1.2-1.18h1.28V5.02A16.6 16.6 0 0 0 13.9 4.9c-2.16 0-3.64 1.32-3.64 3.74v1.31H8.2v2.4h2.06V18.5h2.89Z"
      />
    </svg>
  );
}

function SocialIcon({ platform }: { platform: SocialPlatform }) {
  if (platform === 'instagram') {
    return <InstagramIcon />;
  }

  if (platform === 'facebook') {
    return <FacebookIcon />;
  }

  return null;
}

function BackToTopButton({ label }: { label: string }) {
  function onClick() {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    });

    const main = document.getElementById(MAIN_CONTENT_ID);
    if (main instanceof HTMLElement) {
      main.focus({ preventScroll: true });
    }
  }

  return (
    <button type="button" className="site-footer-top" onClick={onClick}>
      <span className="site-footer-top-arrow" aria-hidden="true">
        <svg viewBox="0 0 12 28" fill="none">
          <path d="M6 28V2M1.5 6.5 6 1l4.5 5.5" />
        </svg>
      </span>
      <span>{label}</span>
    </button>
  );
}

export function SiteFooter() {
  const locale = useLocale();
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');
  const tA11y = useTranslations('a11y');
  const year = new Date().getFullYear();
  const contact = getVerifiedContact();
  const address =
    contact.address && (locale === 'ar' ? contact.address.ar : contact.address.en);
  const rootRef = useRef<HTMLElement>(null);
  const hasConnectDetails = Boolean(
    contact.email || contact.phone || address || contact.social.length > 0,
  );

  useGsapContext(() => {
    const root = rootRef.current;
    if (!root) {
      return;
    }

    const items = root.querySelectorAll('[data-footer-reveal]');
    if (items.length === 0) {
      return;
    }

    revealElements(items, { trigger: root, start: 'top 90%' });
  }, rootRef);

  return (
    <footer ref={rootRef} className="site-footer" data-nav-theme="dark">
      <div className="site-footer-main site-container">
        <div
          className="site-footer-upper"
          data-columns={hasConnectDetails ? '3' : '2'}
        >
          <div className="site-footer-intro" data-footer-reveal>
            <LocalizedLink href="/" className="site-footer-wordmark-link">
              <img
                src={BRAND_ASSETS.navWordmark}
                alt={tA11y('logo')}
                className="site-footer-wordmark"
                width={772}
                height={240}
                draggable={false}
              />
            </LocalizedLink>
            <p className="site-footer-brand-line">{t('brandLine')}</p>
            <FooterNewsletter />
          </div>

          <nav
            className="site-footer-nav"
            aria-label={t('exploreLabel')}
            data-footer-reveal
          >
            <p className="site-footer-heading">{t('explore')}</p>
            <ul className="site-footer-list is-explore">
              {mainNavigation.map((item) => (
                <li key={item.id}>
                  <LocalizedLink href={item.href} className="site-footer-link">
                    {item.id === 'about' ? t('about') : tNav(item.labelKey)}
                  </LocalizedLink>
                </li>
              ))}
            </ul>
          </nav>

          {hasConnectDetails ? (
            <div className="site-footer-connect" data-footer-reveal>
              <p className="site-footer-heading" id="footer-connect-heading">
                {t('connect')}
              </p>
              <ul
                className="site-footer-list"
                aria-labelledby="footer-connect-heading"
              >
                {contact.email ? (
                  <li>
                    <span className="site-footer-meta">{t('email')}</span>
                    <a
                      href={`mailto:${contact.email}`}
                      className="site-footer-link"
                      dir="ltr"
                    >
                      {contact.email}
                    </a>
                  </li>
                ) : null}
                {contact.phone && contact.phoneHref ? (
                  <li>
                    <span className="site-footer-meta">{t('telephone')}</span>
                    <a
                      href={contact.phoneHref}
                      className="site-footer-link"
                      dir="ltr"
                    >
                      {contact.phone}
                    </a>
                  </li>
                ) : null}
                {address ? (
                  <li>
                    <span className="site-footer-meta">{t('showroom')}</span>
                    <span className="site-footer-text">{address}</span>
                  </li>
                ) : null}
                {contact.social.map((link) => (
                  <li key={link.platform}>
                    <a
                      href={link.href}
                      className="site-footer-link site-footer-social"
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <SocialIcon platform={link.platform} />
                      <span>{SOCIAL_LABELS[link.platform]}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>

      <div className="site-footer-bar">
        <div className="site-footer-bar-inner site-container">
          <p className="site-footer-copy">{t('copyright', { year })}</p>
          <nav className="site-footer-legal" aria-label={t('legalLabel')}>
            {legalNavigation.map((item) => (
              <LocalizedLink
                key={item.id}
                href={item.href}
                className="site-footer-link is-quiet"
              >
                {tNav(item.labelKey)}
              </LocalizedLink>
            ))}
          </nav>
          <BackToTopButton label={tA11y('backToTop')} />
        </div>
      </div>
    </footer>
  );
}
