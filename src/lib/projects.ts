import { getCatalogProductById } from '@/config/products';
import { featuredProjects } from '@/config/projects';
import type { FeaturedProduct } from '@/types/product';
import type { FeaturedProject, FeaturedProjectImage } from '@/types/project';

/**
 * Large project stills — lifestyle photography for hero / index layouts.
 * Gallery mixes lifestyle leads with catalogue product shots.
 */
export const projectLayoutStills = {
  one: {
    src: '/images/home/categories/outdoor.jpg',
    width: 1536,
    height: 1024,
    objectPosition: 'center 58%',
  },
  two: {
    src: '/images/home/categories/dining.jpg',
    width: 1536,
    height: 1024,
    objectPosition: 'center 52%',
  },
} as const satisfies Record<string, FeaturedProjectImage>;

export const projectGalleryStills = {
  one: [
    projectLayoutStills.one,
    {
      src: '/images/catalog/products/artk-sof-01.jpg',
      width: 300,
      height: 217,
      objectPosition: 'center center',
    },
    {
      src: '/images/catalog/products/artk-ben-01.jpg',
      width: 300,
      height: 217,
      objectPosition: 'center center',
    },
    {
      src: '/images/catalog/products/artk-sof-02.jpg',
      width: 300,
      height: 217,
      objectPosition: 'center center',
    },
    {
      src: '/images/home/artikkan-about.jpg',
      width: 767,
      height: 1024,
      objectPosition: 'center 62%',
    },
    {
      src: '/images/catalog/products/artk-ch-02.jpg',
      width: 300,
      height: 217,
      objectPosition: 'center center',
    },
  ],
  two: [
    projectLayoutStills.two,
    {
      src: '/images/catalog/products/artk-sof-05.jpg',
      width: 300,
      height: 217,
      objectPosition: 'center center',
    },
    {
      src: '/images/catalog/products/artk-ch-01-wv.jpg',
      width: 300,
      height: 217,
      objectPosition: 'center center',
    },
    {
      src: '/images/catalog/products/artk-ben-04.jpg',
      width: 300,
      height: 217,
      objectPosition: 'center center',
    },
    {
      src: '/images/home/categories/bedroom.jpg',
      width: 1536,
      height: 1024,
      objectPosition: 'center 48%',
    },
    {
      src: '/images/catalog/products/artk-ch-03.jpg',
      width: 300,
      height: 217,
      objectPosition: 'center center',
    },
  ],
} as const satisfies Record<string, readonly FeaturedProjectImage[]>;

/** Wide still on the project detail page. */
export const projectFeatureStills = {
  one: {
    src: '/images/home/categories/outdoor.jpg',
    width: 1536,
    height: 1024,
    objectPosition: 'center 48%',
  },
  two: {
    src: '/images/home/categories/dining.jpg',
    width: 1536,
    height: 1024,
    objectPosition: 'center 48%',
  },
} as const satisfies Record<string, FeaturedProjectImage>;

export { featuredProjects };

export function getProjectBySlug(slug: string): FeaturedProject | undefined {
  return featuredProjects.find((project) => project.slug === slug);
}

export function getProjectLayoutStill(
  project: FeaturedProject,
): FeaturedProjectImage {
  return (
    project.image ??
    projectLayoutStills[project.copyKey] ??
    projectLayoutStills.one
  );
}

export function getProjectFeatureStill(
  project: FeaturedProject,
): FeaturedProjectImage {
  return (
    projectFeatureStills[project.copyKey] ?? getProjectLayoutStill(project)
  );
}

export function getProjectGallery(
  project: FeaturedProject,
): readonly FeaturedProjectImage[] {
  return projectGalleryStills[project.copyKey] ?? [getProjectLayoutStill(project)];
}

export function getProjectProducts(
  project: FeaturedProject,
): FeaturedProduct[] {
  return project.productIds
    .map((id) => getCatalogProductById(id))
    .filter((product): product is FeaturedProduct => Boolean(product));
}
