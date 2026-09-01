'use client';

import { useRef } from 'react';
import { useTranslations } from 'next-intl';
import { ProjectRow } from '@/components/sections/home/projects/project-row';
import { LocalizedLink } from '@/components/shared/localized-link';
import { getFeaturedProductById } from '@/config/products';
import { featuredProjects } from '@/config/projects';
import { MOTION } from '@/config/motion';
import { useGsapContext } from '@/hooks/use-gsap-context';
import { revealElements } from '@/lib/motion-timelines';
import { productPieceKey } from '@/lib/product-messages';
import type { FeaturedProjectCopyKey } from '@/types/project';

type FeaturedProjectsProps = {
  projectImageAvailability: Record<string, boolean>;
  productImageAvailability: Record<string, boolean>;
};

function resolveRowProduct(
  productId: string,
  t: ReturnType<typeof useTranslations<'home.projects'>>,
  tProducts: ReturnType<typeof useTranslations<'home.products'>>,
  productImageAvailability: Record<string, boolean>,
) {
  const record = getFeaturedProductById(productId);
  const nameKey = record?.nameKey;

  return {
    record,
    name: nameKey ? tProducts(productPieceKey(nameKey, 'name')) : t('pendingProduct'),
    imageAlt: nameKey
      ? tProducts(productPieceKey(nameKey, 'alt'))
      : t('pendingPhotography'),
    imageAvailable: Boolean(record && productImageAvailability[record.id]),
  };
}

function projectCopy(
  t: ReturnType<typeof useTranslations<'home.projects'>>,
  copyKey: FeaturedProjectCopyKey,
  field: 'name' | 'subtitle' | 'alt',
) {
  return t(`entries.${copyKey}.${field}`);
}

export function FeaturedProjects({
  projectImageAvailability,
  productImageAvailability,
}: FeaturedProjectsProps) {
  const t = useTranslations('home.projects');
  const tProducts = useTranslations('home.products');
  const rootRef = useRef<HTMLElement>(null);

  useGsapContext(() => {
    const root = rootRef.current;
    if (!root) {
      return;
    }

    const heading = root.querySelectorAll('[data-featured-projects-reveal]');
    revealElements(heading, { trigger: root });

    root.querySelectorAll('[data-featured-project-row]').forEach((row) => {
      const media = row.querySelectorAll('[data-project-reveal]');
      revealElements(media, {
        trigger: row,
        start: MOTION.section.start,
        duration: MOTION.section.duration,
        stagger: 0.1,
      });
    });
  }, rootRef);

  return (
    <section
      ref={rootRef}
      className="featured-projects-section"
      aria-labelledby="home-projects-heading"
    >
      <div className="site-container">
        <header className="featured-projects-header">
          <h2
            id="home-projects-heading"
            className="featured-projects-headline type-h2"
            data-featured-projects-reveal
          >
            {t('heading')}
          </h2>
          <LocalizedLink
            href="/projects"
            className="featured-projects-cta touch-target"
            data-featured-projects-reveal
          >
            <span className="featured-projects-cta-label">{t('viewAll')}</span>
            <span className="featured-projects-cta-arrow" aria-hidden="true">
              <svg viewBox="0 0 28 12" fill="none">
                <path d="M0 6h26M21.5 1.5 27 6l-5.5 4.5" />
              </svg>
            </span>
          </LocalizedLink>
        </header>

        <div className="featured-projects-list">
          {featuredProjects.map((project) => (
              <ProjectRow
                key={project.id}
                project={project}
                name={projectCopy(t, project.copyKey, 'name')}
                subtitle={projectCopy(t, project.copyKey, 'subtitle')}
                imageAlt={projectCopy(t, project.copyKey, 'alt')}
                viewProjectLabel={t('viewProject')}
                piecesGroupLabel={t('piecesLabel')}
                pendingPhotographyLabel={t('pendingPhotography')}
                pendingProductLabel={t('pendingProduct')}
                imageAvailable={Boolean(
                  project.image && projectImageAvailability[project.id],
                )}
                products={[
                  resolveRowProduct(
                    project.productIds[0],
                    t,
                    tProducts,
                    productImageAvailability,
                  ),
                  resolveRowProduct(
                    project.productIds[1],
                    t,
                    tProducts,
                    productImageAvailability,
                  ),
                ]}
              />
          ))}
        </div>
      </div>
    </section>
  );
}
