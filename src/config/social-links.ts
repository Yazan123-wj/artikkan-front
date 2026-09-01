export type SocialPlatform = 'instagram' | 'pinterest' | 'linkedin';

export type SocialLink = {
  platform: SocialPlatform;
  href: string;
  labelKey: 'instagram' | 'pinterest' | 'linkedin';
};

/** Demo social destinations for layout review. */
export const socialLinks: readonly SocialLink[] = [
  {
    platform: 'instagram',
    href: 'https://www.instagram.com/artikkan',
    labelKey: 'instagram',
  },
  {
    platform: 'pinterest',
    href: 'https://www.pinterest.com/artikkan',
    labelKey: 'pinterest',
  },
  {
    platform: 'linkedin',
    href: 'https://www.linkedin.com/company/artikkan',
    labelKey: 'linkedin',
  },
];
