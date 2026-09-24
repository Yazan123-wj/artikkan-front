/**
 * Founders shown on About. Drop portraits at the paths below.
 */
export const ABOUT_FOUNDERS = [
  {
    id: 'hussam',
    image: '/images/about/founders/hussam.jpg',
  },
  {
    id: 'hazar',
    image: '/images/about/founders/hazar.jpg',
  },
] as const;

export type AboutFounderId = (typeof ABOUT_FOUNDERS)[number]['id'];
