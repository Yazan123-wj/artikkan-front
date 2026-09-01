import type { FeaturedProject } from '@/types/project';

/**
 * Homepage featured projects paired with live catalogue product IDs.
 */
export const featuredProjects: readonly FeaturedProject[] = [
  {
    id: 'one',
    slug: 'one',
    copyKey: 'one',
    placement: 'start',
    productIds: ['artk-sof-01', 'artk-ben-01', 'artk-ct-01'],
    image: {
      src: '/images/home/categories/outdoor.jpg',
      width: 1536,
      height: 1024,
      objectPosition: 'center 58%',
    },
  },
  {
    id: 'two',
    slug: 'two',
    copyKey: 'two',
    placement: 'end',
    productIds: ['artk-dt-01', 'artk-ch-01-wv', 'artk-cot-02'],
    image: {
      src: '/images/home/categories/dining.jpg',
      width: 1536,
      height: 1024,
      objectPosition: 'center 52%',
    },
  },
];
