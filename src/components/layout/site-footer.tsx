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
import { useGsapContext } from '@/hooks/use-gsap-context';
import { MAIN_CONTENT_ID } from '@/lib/constants';
import { prefersReducedMotion } from '@/lib/gsap';
import { revealElements } from '@/lib/motion-timelines';

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
                src={BRAND_ASSETS.wordmark}
                alt={tA11y('logo')}
                className="site-footer-wordmark"
                width={1024}
                height={345}
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
                      className="site-footer-link"
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {link.platform}
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
