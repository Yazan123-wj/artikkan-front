'use client';

import { useMemo, useState, type FormEvent } from 'react';
import { useTranslations } from 'next-intl';
import { LocalizedLink } from '@/components/shared/localized-link';
import { CONTACT_ENDPOINT } from '@/config/contact';

type FormValues = {
  name: string;
  email: string;
};

type FieldErrors = Partial<Record<'email', string>>;

type ContactFormProps = {
  enquiryEmail: string | null;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const emptyValues: FormValues = {
  name: '',
  email: '',
};

export function ContactForm({ enquiryEmail }: ContactFormProps) {
  const t = useTranslations('home.contact.form');
  const [values, setValues] = useState<FormValues>(emptyValues);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<'idle' | 'success' | 'unconnected'>(
    'idle',
  );

  const statusMessage = useMemo(() => {
    if (status === 'success') {
      return t('success');
    }
    if (status === 'unconnected') {
      return enquiryEmail ? t('unconnected') : t('unconnectedNoEmail');
    }
    return null;
  }, [enquiryEmail, status, t]);

  function update<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: FieldErrors = {};
    if (!EMAIL_PATTERN.test(values.email.trim())) {
      nextErrors.email = t('errors.email');
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setStatus('idle');
      return;
    }

    if (!CONTACT_ENDPOINT) {
      setStatus('unconnected');
      return;
    }

    setStatus('success');
  }

  return (
    <form className="home-contact-form" noValidate onSubmit={onSubmit}>
      <div className="home-contact-fields">
        <div className="home-contact-field">
          <label htmlFor="newsletter-name">{t('name')}</label>
          <input
            id="newsletter-name"
            name="name"
            type="text"
            autoComplete="name"
            value={values.name}
            onChange={(event) => update('name', event.target.value)}
          />
        </div>

        <div className="home-contact-field">
          <label htmlFor="newsletter-email">{t('email')}</label>
          <input
            id="newsletter-email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            dir="ltr"
            required
            value={values.email}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'newsletter-email-error' : undefined}
            onChange={(event) => update('email', event.target.value)}
          />
          {errors.email ? (
            <p id="newsletter-email-error" className="home-contact-field-error">
              {errors.email}
            </p>
          ) : null}
        </div>
      </div>

      <p className="home-contact-privacy">
        {t.rich('privacy', {
          privacy: (chunks) => (
            <LocalizedLink href="/privacy-policy">{chunks}</LocalizedLink>
          ),
        })}
      </p>

      <button type="submit" className="home-contact-submit">
        <span className="home-contact-submit-label">{t('submit')}</span>
        <span className="home-contact-submit-arrow" aria-hidden="true">
          <svg viewBox="0 0 28 12" fill="none">
            <path d="M0 6h26M21.5 1.5 27 6l-5.5 4.5" />
          </svg>
        </span>
      </button>

      <p className="home-contact-status" role="status" aria-live="polite">
        {statusMessage}
        {status === 'unconnected' && enquiryEmail ? (
          <>
            {' '}
            <a href={`mailto:${enquiryEmail}`} dir="ltr">
              {enquiryEmail}
            </a>
          </>
        ) : null}
      </p>
    </form>
  );
}
