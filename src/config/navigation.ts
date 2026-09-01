import type { NavItem } from '@/types/navigation';

/**
 * Single source for desktop navigation, the future mobile menu,
 * language-adjacent header actions, and the inquiry CTA.
 * Do not copy these arrays into components.
 */

export const mainNavigation = [
  { id: 'home', href: '/', labelKey: 'home' },
  { id: 'about', href: '/about', labelKey: 'about' },
  { id: 'categories', href: '/categories', labelKey: 'categories' },
  { id: 'products', href: '/products', labelKey: 'products' },
  { id: 'projects', href: '/projects', labelKey: 'projects' },
  { id: 'journal', href: '/journal', labelKey: 'journal' },
  { id: 'contact', href: '/#contact', labelKey: 'contact' },
] as const satisfies readonly NavItem[];

export const legalNavigation = [
  { id: 'privacy-policy', href: '/privacy-policy', labelKey: 'privacyPolicy' },
  { id: 'terms', href: '/terms', labelKey: 'terms' },
] as const satisfies readonly NavItem[];

export const inquiryCta = {
  id: 'inquiry',
  href: '/#contact',
  labelKey: 'inquiry',
} as const;

export type MainNavItem = (typeof mainNavigation)[number];
export type LegalNavItem = (typeof legalNavigation)[number];

export const headerNavigation = {
  primary: mainNavigation,
  legal: legalNavigation,
  cta: inquiryCta,
} as const;

/** Marquee stills for the fullscreen flowing menu. Local brand assets only. */
export const menuPreviewImages = {
  home: '/media/hero/artikkan-hero-poster.jpg',
  about: '/images/home/artikkan-about.jpg',
  categories: '/images/catalog/categories/seating-hero.jpg',
  products: '/images/catalog/products/artk-sof-01.jpg',
  projects: '/images/catalog/products/artk-dt-01.jpg',
  journal: '/images/catalog/products/artk-un-01.jpg',
  contact: '/images/catalog/products/artk-cot-02.jpg',
} as const satisfies Record<MainNavItem['id'], string>;
