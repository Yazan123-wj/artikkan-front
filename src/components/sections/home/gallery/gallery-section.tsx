'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { CircularGallery } from '@/components/ui/circular-gallery';
import { homeGalleryItems } from '@/config/home-content';

type HomeGallerySectionProps = {
  imageAvailability: Record<string, boolean>;
};

export function HomeGallerySection({
  imageAvailability,
}: HomeGallerySectionProps) {
  const t = useTranslations('home.gallery');

  const items = useMemo(
    () =>
      homeGalleryItems
        .filter((item) => imageAvailability[item.id])
        .map((item) => ({
          image: item.image,
          text: '',
        })),
    [imageAvailability, t],
  );

  if (items.length < 2) {
    return null;
  }

  return (
    <section
      className="home-gallery-section"
      aria-labelledby="home-gallery-heading"
    >
      <div className="site-container">
        <div className="home-gallery-header">
          <p className="home-gallery-eyebrow type-label">{t('eyebrow')}</p>
          <h2
            id="home-gallery-heading"
            className="home-gallery-headline type-h2"
          >
            {t('headline')}
          </h2>
        </div>
      </div>
      <div className="home-gallery-stage">
        <CircularGallery
          items={items}
          bend={3}
          textColor="#161616"
          borderRadius={0.02}
          scrollSpeed={2.2}
          scrollEase={0.05}
          autoplay
          autoplaySpeed={0.014}
          ariaLabel={t('regionLabel')}
        />
      </div>
    </section>
  );
}
