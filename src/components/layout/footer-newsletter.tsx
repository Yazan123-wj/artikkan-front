'use client';

import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { useTranslations } from 'next-intl';
import { NEWSLETTER_ENDPOINT } from '@/config/contact';
import { prefersReducedMotion } from '@/lib/gsap';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function scrollToNewsletter() {
  if (window.location.hash !== '#newsletter') {
    return;
  }

  const target = document.getElementById('newsletter');
  if (!target) {
    return;
  }

  target.scrollIntoView({
    behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    block: 'start',
  });
}

export function FooterNewsletter() {
  const t = useTranslations('footer.newsletter');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'success' | 'unconnected'>(
    'idle',
  );

  useEffect(() => {
    scrollToNewsletter();
    window.addEventListener('hashchange', scrollToNewsletter);
    return () => window.removeEventListener('hashchange', scrollToNewsletter);
  }, []);

  const statusMessage = useMemo(() => {
    if (status === 'success') {
      return t('success');
    }
    if (status === 'unconnected') {
      return t('unconnected');
    }
    return null;
  }, [status, t]);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!EMAIL_PATTERN.test(email.trim())) {
      setError(t('error'));
      setStatus('idle');
      return;
    }

    setError(null);

    if (!NEWSLETTER_ENDPOINT) {
      setStatus('unconnected');
      return;
    }

    setStatus('success');
  }

  return (
    <form
      id="newsletter"
      className="site-footer-newsletter"
      noValidate
      onSubmit={onSubmit}
    >
      <p className="site-footer-heading">{t('label')}</p>
      <p className="site-footer-newsletter-lede">{t('lede')}</p>
      <div className="site-footer-newsletter-row">
        <label className="sr-only" htmlFor="footer-newsletter-email">
          {t('email')}
        </label>
        <input
          id="footer-newsletter-email"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          dir="ltr"
          required
          placeholder={t('email')}
          value={email}
          aria-invalid={Boolean(error)}
          aria-describedby={
            error
              ? 'footer-newsletter-error'
              : statusMessage
                ? 'footer-newsletter-status'
                : undefined
          }
          onChange={(event) => setEmail(event.target.value)}
        />
        <button type="submit">{t('submit')}</button>
      </div>
      {error ? (
        <p id="footer-newsletter-error" className="site-footer-newsletter-note">
          {error}
        </p>
      ) : null}
      <p
        id="footer-newsletter-status"
        className="site-footer-newsletter-note"
        role="status"
        aria-live="polite"
      >
        {statusMessage}
      </p>
    </form>
  );
}
