import type { LocalizedImage, LocalizedString } from './common';

export type Project = {
  slug: string;
  title: LocalizedString;
  excerpt?: LocalizedString;
  image?: LocalizedImage;
};

export type FeaturedProjectCopyKey = 'one' | 'two';

export type FeaturedProjectImage = {
  src: string;
  width: number;
  height: number;
  objectPosition?: string;
  objectPositionRtl?: string;
};

export type FeaturedProject = {
  id: string;
  slug: string;
  copyKey: FeaturedProjectCopyKey;
  /**
   * Visual placement of the project photograph on desktop.
   * `start` = inline-start (left in English, right in Arabic).
   * `end` = inline-end. DOM order stays project then products.
   */
  placement: 'start' | 'end';
  /**
   * Three catalog product `id` values for the project detail page.
   * Homepage featured rows still use the first two.
   */
  productIds: readonly [string, string, string];
  /** Optional flag for unfinished project records. */
  placeholder?: boolean;
  image?: FeaturedProjectImage;
};
