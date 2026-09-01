import { getEnquiryEmail } from '@/config/site';
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
  const phone = '+974 4412 8800';
  return {
    email: getEnquiryEmail(),
    phone,
    phoneHref: 'tel:+97444128800',
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
