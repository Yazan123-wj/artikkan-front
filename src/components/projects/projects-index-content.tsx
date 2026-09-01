import Image from 'next/image';
import { getLocale, getTranslations } from 'next-intl/server';
import { ImageCurtain } from '@/components/motion/image-curtain';
import { EditorialLink } from '@/components/shared/editorial-link';
import { InteriorReveal } from '@/components/shared/interior-reveal';
import { publicAssetExists } from '@/lib/assets';
import {
  featuredProjects,
  getProjectLayoutStill,
} from '@/lib/projects';

export async function ProjectsIndexContent() {
  const locale = await getLocale();
  const t = await getTranslations('projectsPage');
  const tHome = await getTranslations('home.projects');

  return (
    <div className="projects-page">
      <div className="site-container">
        <header className="interior-intro projects-intro">
          <p className="interior-eyebrow type-label">{t('eyebrow')}</p>
          <h1 className="interior-headline type-h1">{t('headline')}</h1>
          <p className="interior-lede type-body-lg">{t('intro')}</p>
        </header>

        <div className="projects-index">
          {featuredProjects.map((project) => {
            const still = getProjectLayoutStill(project);
            const available = publicAssetExists(still.src);
            const name = tHome(`entries.${project.copyKey}.name`);
            const subtitle = tHome(`entries.${project.copyKey}.subtitle`);
            const objectPosition =
              locale === 'ar'
                ? (still.objectPositionRtl ?? still.objectPosition)
                : still.objectPosition;
            const href = `/projects/${project.slug}`;

            return (
              <article
                key={project.id}
                className={
                  project.placement === 'end'
                    ? 'project-index-row is-reversed'
                    : 'project-index-row'
                }
              >
                <ImageCurtain
                  className="project-index-media"
                  aspectRatio="4 / 3"
                  parallax={project.placement === 'start'}
                >
                  {available ? (
                    <Image
                      src={still.src}
                      alt={t('leadAlt')}
                      fill
                      quality={85}
                      sizes="(min-width: 1024px) 58vw, calc(100vw - 2.5rem)"
                      className="about-page-lead-img"
                      style={
                        objectPosition ? { objectPosition } : undefined
                      }
                    />
                  ) : (
                    <span className="journal-pending" />
                  )}
                </ImageCurtain>
                <InteriorReveal className="project-index-copy-wrap">
                  <div className="project-index-copy" data-interior-reveal>
                    <h2 className="type-h2">{name}</h2>
                    <p className="type-body">{subtitle}</p>
                    <EditorialLink href={href} className="project-index-cta">
                      {t('viewProject')}
                    </EditorialLink>
                  </div>
                </InteriorReveal>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
