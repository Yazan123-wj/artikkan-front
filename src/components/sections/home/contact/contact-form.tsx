'use client';

import { useMemo, useState, type FormEvent } from 'react';
import { useTranslations } from 'next-intl';
import { LocalizedLink } from '@/components/shared/localized-link';
import { CONTACT_ENDPOINT } from '@/config/contact';

const ENQUIRY_TYPES = ['product', 'project', 'general'] as const;

type EnquiryType = (typeof ENQUIRY_TYPES)[number] | '';

type FormValues = {
  name: string;
  email: string;
  phone: string;
  type: EnquiryType;
  product: string;
  message: string;
};

type FieldErrors = Partial<Record<'name' | 'email' | 'type' | 'message', string>>;

type ContactFormProps = {
  enquiryEmail: string | null;
  initialProduct?: string | null;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const emptyValues: FormValues = {
  name: '',
  email: '',
  phone: '',
  type: '',
  product: '',
  message: '',
};

export function ContactForm({
  enquiryEmail,
  initialProduct = null,
}: ContactFormProps) {
  const t = useTranslations('home.contact.form');
  const [values, setValues] = useState<FormValues>(() =>
    initialProduct
      ? { ...emptyValues, type: 'product', product: initialProduct }
      : emptyValues,
  );
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<'idle' | 'unconnected'>('idle');

  const showProduct = values.type === 'product';

  const statusMessage = useMemo(() => {
    if (status !== 'unconnected') {
      return null;
    }

    return enquiryEmail ? t('unconnected') : t('unconnectedNoEmail');
  }, [enquiryEmail, status, t]);

  function update<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: FieldErrors = {};
    if (!values.name.trim()) {
      nextErrors.name = t('errors.name');
    }
    if (!EMAIL_PATTERN.test(values.email.trim())) {
      nextErrors.email = t('errors.email');
    }
    if (!values.type) {
      nextErrors.type = t('errors.type');
    }
    if (!values.message.trim()) {
      nextErrors.message = t('errors.message');
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setStatus('idle');
      return;
    }

    if (!CONTACT_ENDPOINT) {
      setStatus('unconnected');
    }
  }

  return (
    <form className="home-contact-form" noValidate onSubmit={onSubmit}>
      <div className="home-contact-fields">
        <div className="home-contact-field">
          <label htmlFor="contact-name">{t('name')}</label>
          <input
            id="contact-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            value={values.name}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'contact-name-error' : undefined}
            onChange={(event) => update('name', event.target.value)}
          />
          {errors.name ? (
            <p id="contact-name-error" className="home-contact-field-error">
              {errors.name}
            </p>
          ) : null}
        </div>

        <div className="home-contact-field">
          <label htmlFor="contact-email">{t('email')}</label>
          <input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            dir="ltr"
            required
            value={values.email}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'contact-email-error' : undefined}
            onChange={(event) => update('email', event.target.value)}
          />
          {errors.email ? (
            <p id="contact-email-error" className="home-contact-field-error">
              {errors.email}
            </p>
          ) : null}
        </div>

        <div className="home-contact-field">
          <label htmlFor="contact-phone">{t('phone')}</label>
          <input
            id="contact-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            dir="ltr"
            value={values.phone}
            onChange={(event) => update('phone', event.target.value)}
          />
        </div>

        <div className="home-contact-field">
          <label htmlFor="contact-type">{t('type')}</label>
          <select
            id="contact-type"
            name="type"
            required
            value={values.type}
            aria-invalid={Boolean(errors.type)}
            aria-describedby={errors.type ? 'contact-type-error' : undefined}
            onChange={(event) =>
              update('type', event.target.value as EnquiryType)
            }
          >
            <option value="" disabled>
              {t('typeEmpty')}
            </option>
            {ENQUIRY_TYPES.map((type) => (
              <option key={type} value={type}>
                {t(`types.${type}`)}
              </option>
            ))}
          </select>
          {errors.type ? (
            <p id="contact-type-error" className="home-contact-field-error">
              {errors.type}
            </p>
          ) : null}
        </div>

        {showProduct ? (
          <div className="home-contact-field is-wide">
            <label htmlFor="contact-product">{t('product')}</label>
            <input
              id="contact-product"
              name="product"
              type="text"
              autoComplete="off"
              value={values.product}
              onChange={(event) => update('product', event.target.value)}
            />
          </div>
        ) : null}

        <div className="home-contact-field is-wide">
          <label htmlFor="contact-message">{t('message')}</label>
          <textarea
            id="contact-message"
            name="message"
            required
            rows={5}
            value={values.message}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? 'contact-message-error' : undefined}
            onChange={(event) => update('message', event.target.value)}
          />
          {errors.message ? (
            <p id="contact-message-error" className="home-contact-field-error">
              {errors.message}
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
