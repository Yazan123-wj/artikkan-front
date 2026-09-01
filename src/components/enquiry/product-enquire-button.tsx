'use client';

import Image from 'next/image';
import {
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type FormEvent,
} from 'react';
import { createPortal } from 'react-dom';
import { useLocale, useTranslations } from 'next-intl';
import { LocalizedLink } from '@/components/shared/localized-link';
import { useFocusTrap } from '@/hooks/use-focus-trap';
import { useLockBodyScroll } from '@/hooks/use-lock-body-scroll';
import { buildProductEnquiryFormMailto } from '@/lib/enquiry';
import { cn } from '@/lib/utils';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function subscribeNoop() {
  return () => undefined;
}

function useIsClient() {
  return useSyncExternalStore(subscribeNoop, () => true, () => false);
}

export type EnquiryProduct = {
  name: string;
  category: string;
  slug: string;
  reference?: string;
  imageSrc: string;
  imageAlt: string;
};

type EnquiryModalProps = {
  open: boolean;
  onClose: () => void;
  product: EnquiryProduct;
  enquiryEmail: string | null;
};

type FormValues = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

type FieldErrors = Partial<Record<'name' | 'email' | 'message', string>>;

const emptyValues: FormValues = {
  name: '',
  email: '',
  phone: '',
  message: '',
};

export function EnquiryModal({
  open,
  onClose,
  product,
  enquiryEmail,
}: EnquiryModalProps) {
  const t = useTranslations('enquiryModal');
  const locale = useLocale();
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const isClient = useIsClient();
  const [values, setValues] = useState<FormValues>(emptyValues);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<'idle' | 'ready' | 'missing'>('idle');

  useFocusTrap(open, dialogRef);
  useLockBodyScroll(open, 'is-enquiry-open');

  useEffect(() => {
    if (!open) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      nameRef.current?.focus({ preventScroll: true });
    });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      window.cancelAnimationFrame(frame);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onClose]);

  if (!isClient || !open) {
    return null;
  }

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
    if (!values.message.trim()) {
      nextErrors.message = t('errors.message');
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setStatus('idle');
      return;
    }

    if (!enquiryEmail) {
      setStatus('missing');
      return;
    }

    const mailto = buildProductEnquiryFormMailto({
      email: enquiryEmail,
      productName: product.name,
      locale,
      slug: product.slug,
      reference: product.reference,
      senderName: values.name.trim(),
      senderEmail: values.email.trim(),
      senderPhone: values.phone,
      message: values.message.trim(),
    });

    setStatus('ready');
    window.location.href = mailto;
  }

  return createPortal(
    <div
      ref={dialogRef}
      className="enquiry-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="enquiry-modal-panel">
        <header className="enquiry-modal-header">
          <div className="enquiry-modal-heading">
            <p className="enquiry-modal-eyebrow type-label">{t('eyebrow')}</p>
            <h2 id={titleId} className="enquiry-modal-title type-h3">
              {t('title')}
            </h2>
            <p className="enquiry-modal-lede type-body">{t('lede')}</p>
          </div>
          <button
            type="button"
            className="enquiry-modal-close touch-target"
            onClick={onClose}
          >
            {t('close')}
          </button>
        </header>

        <div className="enquiry-modal-piece">
          <div className="enquiry-modal-piece-media">
            <Image
              src={product.imageSrc}
              alt={product.imageAlt}
              fill
              sizes="120px"
              quality={85}
              className="enquiry-modal-piece-image"
            />
          </div>
          <div className="enquiry-modal-piece-copy">
            <p className="enquiry-modal-piece-category type-label">
              {product.category}
            </p>
            <p className="enquiry-modal-piece-name">{product.name}</p>
            {product.reference ? (
              <p className="enquiry-modal-piece-ref" dir="ltr">
                {product.reference}
              </p>
            ) : null}
          </div>
        </div>

        <form className="enquiry-modal-form" noValidate onSubmit={onSubmit}>
          <div className="enquiry-modal-fields">
            <div className="enquiry-modal-field">
              <label htmlFor="enquiry-name">{t('name')}</label>
              <input
                ref={nameRef}
                id="enquiry-name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={values.name}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? 'enquiry-name-error' : undefined}
                onChange={(event) => update('name', event.target.value)}
              />
              {errors.name ? (
                <p id="enquiry-name-error" className="enquiry-modal-field-error">
                  {errors.name}
                </p>
              ) : null}
            </div>

            <div className="enquiry-modal-field">
              <label htmlFor="enquiry-email">{t('email')}</label>
              <input
                id="enquiry-email"
                name="email"
                type="email"
                autoComplete="email"
                inputMode="email"
                dir="ltr"
                required
                value={values.email}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={
                  errors.email ? 'enquiry-email-error' : undefined
                }
                onChange={(event) => update('email', event.target.value)}
              />
              {errors.email ? (
                <p id="enquiry-email-error" className="enquiry-modal-field-error">
                  {errors.email}
                </p>
              ) : null}
            </div>

            <div className="enquiry-modal-field">
              <label htmlFor="enquiry-phone">{t('phone')}</label>
              <input
                id="enquiry-phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                inputMode="tel"
                dir="ltr"
                value={values.phone}
                onChange={(event) => update('phone', event.target.value)}
              />
            </div>

            <div className="enquiry-modal-field is-wide">
              <label htmlFor="enquiry-message">{t('message')}</label>
              <textarea
                id="enquiry-message"
                name="message"
                required
                rows={4}
                value={values.message}
                aria-invalid={Boolean(errors.message)}
                aria-describedby={
                  errors.message ? 'enquiry-message-error' : undefined
                }
                onChange={(event) => update('message', event.target.value)}
              />
              {errors.message ? (
                <p
                  id="enquiry-message-error"
                  className="enquiry-modal-field-error"
                >
                  {errors.message}
                </p>
              ) : null}
            </div>
          </div>

          <p className="enquiry-modal-privacy">
            {t.rich('privacy', {
              privacy: (chunks) => (
                <LocalizedLink href="/privacy-policy" onClick={onClose}>
                  {chunks}
                </LocalizedLink>
              ),
            })}
          </p>

          <button type="submit" className="enquiry-modal-submit">
            <span className="enquiry-modal-submit-label">{t('submit')}</span>
            <span className="enquiry-modal-submit-arrow" aria-hidden="true">
              <svg viewBox="0 0 28 12" fill="none">
                <path d="M0 6h26M21.5 1.5 27 6l-5.5 4.5" />
              </svg>
            </span>
          </button>

          <p className="enquiry-modal-status" role="status" aria-live="polite">
            {status === 'ready' ? t('openedMail') : null}
            {status === 'missing' ? t('missingEmail') : null}
          </p>
        </form>
      </div>
    </div>,
    document.body,
  );
}

type ProductEnquireButtonProps = {
  product: EnquiryProduct;
  enquiryEmail: string | null;
  label: string;
  className?: string;
  labelClassName?: string;
  arrowClassName?: string;
  variant?: 'featured' | 'editorial';
};

export function ProductEnquireButton({
  product,
  enquiryEmail,
  label,
  className,
  labelClassName,
  arrowClassName,
  variant = 'featured',
}: ProductEnquireButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className={cn(
          variant === 'editorial'
            ? 'editorial-link touch-target product-detail-enquire'
            : 'featured-product-enquire touch-target',
          className,
        )}
        onClick={() => setOpen(true)}
      >
        <span
          className={cn(
            variant === 'editorial'
              ? 'editorial-link-label'
              : 'featured-product-enquire-label',
            labelClassName,
          )}
        >
          {label}
        </span>
        <span
          className={cn(
            variant === 'editorial'
              ? 'editorial-link-arrow'
              : 'featured-product-enquire-arrow',
            arrowClassName,
          )}
          aria-hidden="true"
        >
          <svg viewBox="0 0 28 12" fill="none">
            <path d="M0 6h26M21.5 1.5 27 6l-5.5 4.5" />
          </svg>
        </span>
      </button>

      {open ? (
        <EnquiryModal
          key={product.slug}
          open
          onClose={() => setOpen(false)}
          product={product}
          enquiryEmail={enquiryEmail}
        />
      ) : null}
    </>
  );
}
