'use client';

import { useTranslations } from 'next-intl';
import { AccordionGallery } from '@/components/ui/accordion-gallery';
import { LocalizedLink } from '@/components/shared/localized-link';
import { featuredCategories } from '@/config/home-content';

type FeaturedCategoriesProps = {
  imageAvailability: Record<string, boolean>;
};

export function FeaturedCategories({
  imageAvailability,
}: FeaturedCategoriesProps) {
  const t = useTranslations('home.categories');

  const items = featuredCategories.map((category) => ({
    image: category.image,
    label: t(category.labelKey),
    alt: t(category.altKey),
    link: category.href,
    imageAvailable: Boolean(imageAvailability[category.id]),
  }));

  return (
    <section
      className="categories-section"
      aria-labelledby="home-categories-heading"
    >
      <div className="site-container">
        <div className="categories-header">
          <p className="categories-eyebrow type-label">{t('eyebrow')}</p>
          <div className="categories-heading-row">
            <h2
              id="home-categories-heading"
              className="categories-headline type-h2"
            >
              {t('headline')}
            </h2>
            <LocalizedLink
              href="/categories"
              className="categories-cta touch-target"
            >
              <span className="categories-cta-label">{t('cta')}</span>
              <span className="categories-cta-arrow" aria-hidden="true">
                <svg viewBox="0 0 28 12" fill="none">
                  <path d="M0 6h26M21.5 1.5 27 6l-5.5 4.5" />
                </svg>
              </span>
            </LocalizedLink>
          </div>
        </div>
        <div className="categories-gallery-wrap">
          <AccordionGallery
            items={items}
            defaultIndex={2}
            expandRatio={0.5}
            trigger="hover"
            ariaLabel={t('galleryLabel')}
          />
        </div>
      </div>
    </section>
  );
}
