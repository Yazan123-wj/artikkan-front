import { getSiteUrl } from '@/lib/constants';

type EnquiryMailtoInput = {
  email: string;
  productName: string;
  locale: string;
  slug: string;
  reference?: string;
};

type EnquiryFormMailtoInput = EnquiryMailtoInput & {
  senderName: string;
  senderEmail: string;
  senderPhone?: string;
  message: string;
};

export function buildProductEnquiryMailto({
  email,
  productName,
  locale,
  slug,
  reference,
}: EnquiryMailtoInput): string {
  const productUrl = `${getSiteUrl()}/${locale}/products/${slug}`;
  const isArabic = locale === 'ar';

  const subject = isArabic
    ? `استفسار عن منتج — ${productName}`
    : `Product enquiry — ${productName}`;

  const body = isArabic
    ? [
        'مرحباً أرتيكان،',
        `أود الاستفسار عن ${productName}.`,
        'يرجى مشاركة تفاصيل المنتج والأسعار.',
        '',
        reference ? `مرجع المنتج: ${reference}` : null,
        `رابط المنتج: ${productUrl}`,
      ]
        .filter((line) => line !== null)
        .join('\n')
    : [
        'Hello Artikkan,',
        `I am interested in ${productName}.`,
        'Please share the product details and pricing.',
        '',
        reference ? `Product reference: ${reference}` : null,
        `Product link: ${productUrl}`,
      ]
        .filter((line) => line !== null)
        .join('\n');

  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function buildProductEnquiryFormMailto({
  email,
  productName,
  locale,
  slug,
  reference,
  senderName,
  senderEmail,
  senderPhone,
  message,
}: EnquiryFormMailtoInput): string {
  const productUrl = `${getSiteUrl()}/${locale}/products/${slug}`;
  const isArabic = locale === 'ar';
  const phone = senderPhone?.trim();

  const subject = isArabic
    ? `استفسار عن منتج — ${productName}`
    : `Product enquiry — ${productName}`;

  const body = isArabic
    ? [
        'مرحباً أرتيكان،',
        '',
        `الاسم: ${senderName}`,
        `البريد: ${senderEmail}`,
        phone ? `الهاتف: ${phone}` : null,
        '',
        `القطعة: ${productName}`,
        reference ? `المرجع: ${reference}` : null,
        `الرابط: ${productUrl}`,
        '',
        'الرسالة:',
        message,
      ]
        .filter((line) => line !== null)
        .join('\n')
    : [
        'Hello Artikkan,',
        '',
        `Name: ${senderName}`,
        `Email: ${senderEmail}`,
        phone ? `Telephone: ${phone}` : null,
        '',
        `Piece: ${productName}`,
        reference ? `Reference: ${reference}` : null,
        `Link: ${productUrl}`,
        '',
        'Message:',
        message,
      ]
        .filter((line) => line !== null)
        .join('\n');

  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
