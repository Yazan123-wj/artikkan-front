'use client';

import { useRef } from 'react';
import { useTranslations } from 'next-intl';
import { ProjectRow } from '@/components/sections/home/projects/project-row';
import { LocalizedLink } from '@/components/shared/localized-link';
import { MOTION } from '@/config/motion';
import { useGsapContext } from '@/hooks/use-gsap-context';
import { revealElements } from '@/lib/motion-timelines';
import type { FeaturedProduct } from '@/types/product';
import type { FeaturedProject } from '@/types/project';

export type FeaturedProjectRowProduct = {
  record: FeaturedProduct | undefined;
  name: string;
  imageAlt: string;
  imageAvailable: boolean;
};

export type FeaturedProjectRowData = {
  project: FeaturedProject;
  name: string;
  subtitle: string;
  imageAlt: string;
  imageAvailable: boolean;
  products: readonly [FeaturedProjectRowProduct, FeaturedProjectRowProduct];
};

type FeaturedProjectsProps = {
  rows: FeaturedProjectRowData[];
};

export function FeaturedProjects({ rows }: FeaturedProjectsProps) {
  const t = useTranslations('home.projects');
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

  if (rows.length === 0) {
    return null;
  }

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
          {rows.map((row) => (
            <ProjectRow
              key={row.project.id}
              project={row.project}
              name={row.name}
              subtitle={row.subtitle}
              imageAlt={row.imageAlt}
              viewProjectLabel={t('viewProject')}
              piecesGroupLabel={t('piecesLabel')}
              pendingPhotographyLabel={t('pendingPhotography')}
              pendingProductLabel={t('pendingProduct')}
              imageAvailable={row.imageAvailable}
              products={row.products}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
