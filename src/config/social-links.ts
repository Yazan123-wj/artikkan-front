export type SocialPlatform = 'instagram' | 'facebook' | 'pinterest' | 'linkedin';

export type SocialLink = {
  platform: SocialPlatform;
  href: string;
  labelKey: SocialPlatform;
};

export const SOCIAL_LABELS: Record<SocialPlatform, string> = {
  instagram: 'Instagram',
  facebook: 'Facebook',
  pinterest: 'Pinterest',
  linkedin: 'LinkedIn',
};

export const socialLinks: readonly SocialLink[] = [
  {
    platform: 'instagram',
    href: 'https://www.instagram.com/artikkan',
    labelKey: 'instagram',
  },
  {
    platform: 'facebook',
    href: 'https://www.facebook.com/artikkan',
    labelKey: 'facebook',
  },
];
