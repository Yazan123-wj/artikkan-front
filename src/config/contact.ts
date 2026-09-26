import { socialLinks } from '@/config/social-links';

/**
 * Demo contact details for client review.
 * Map pin comes from the Artikkan-supplied short URL:
 * https://maps.app.goo.gl/cWUecqmhWhgL37aC7
 */
export type ContactMapConfig = {
  directionsUrl: string;
  latitude: number;
  longitude: number;
};

export const CONTACT_MAP: ContactMapConfig = {
  directionsUrl: 'https://maps.app.goo.gl/cWUecqmhWhgL37aC7',
  latitude: 31.9701947,
  longitude: 35.8701582,
};

export function getMapEmbedSrc(locale: string): string {
  const hl = locale === 'ar' ? 'ar' : 'en';
  const { latitude, longitude } = CONTACT_MAP;
  const params = new URLSearchParams({
    q: `${latitude},${longitude}`,
    z: '16',
    hl,
    output: 'embed',
  });
  return `https://www.google.com/maps?${params.toString()}`;
}

export function getVerifiedContact() {
  const phone = '+974 3331 4418';
  return {
    email: 'info@artikkan.com',
    phone,
    phoneHref: 'tel:+97433314418',
    address: {
      en: 'Doha, Qatar',
      ar: 'الدوحة، قطر',
    },
    hours: {
      en: 'Sunday–Thursday, 10:00–19:00',
      ar: 'الأحد–الخميس، ١٠:٠٠–١٩:٠٠',
    },
    map: CONTACT_MAP,
    social: socialLinks,
  };
}

export const CONTACT_ENDPOINT = null;
export const NEWSLETTER_ENDPOINT = null;
