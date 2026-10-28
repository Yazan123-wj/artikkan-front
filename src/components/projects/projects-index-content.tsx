import Image from 'next/image';
import { getLocale, getTranslations } from 'next-intl/server';
import { ImageCurtain } from '@/components/motion/image-curtain';
import { EditorialLink } from '@/components/shared/editorial-link';
import { InteriorReveal } from '@/components/shared/interior-reveal';
import { featuredProjects, getProjectLayoutStill } from '@/lib/projects';
import { fetchLiveProjects, liveName } from '@/lib/live-catalog';
import {
  liveToFeaturedProject,
  projectImageAvailable,
} from '@/lib/project-display';

export async function ProjectsIndexContent() {
  const locale = await getLocale();
  const t = await getTranslations('projectsPage');
  const tHome = await getTranslations('home.projects');
  const live = await fetchLiveProjects();
  const rows =
    live === null
      ? featuredProjects.map((project) => {
          const still = getProjectLayoutStill(project);
          const copyKey = project.copyKey ?? 'one';
          return {
            id: project.id,
            slug: project.slug,
            placement: project.placement,
            name: tHome(`entries.${copyKey}.name`),
            subtitle: tHome(`entries.${copyKey}.subtitle`),
            image: still,
            available: projectImageAvailable(still.src),
          };
        })
      : live.map((project) => {
          const featured = liveToFeaturedProject(project);
          return {
            id: project.id,
            slug: project.slug,
            placement: featured.placement,
            name: liveName(project.title, locale),
            subtitle:
              liveName(project.overview, locale) ||
              liveName(project.type, locale),
            image: featured.image,
            available: projectImageAvailable(featured.image?.src),
          };
        });

  return (
    <div className="projects-page">
      <div className="site-container">
        <header className="interior-intro projects-intro">
          <p className="interior-eyebrow type-label">{t('eyebrow')}</p>
          <h1 className="interior-headline type-h1">{t('headline')}</h1>
          <p className="interior-lede type-body-lg">{t('intro')}</p>
        </header>

        <div className="projects-index">
          {rows.map((project) => {
            const still = project.image;
            const objectPosition =
              still && locale === 'ar'
                ? (still.objectPositionRtl ?? still.objectPosition)
                : still?.objectPosition;
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
                  {project.available && still ? (
                    <Image
                      src={still.src}
                      alt={t('leadAlt')}
                      fill
                      quality={85}
                      sizes="(min-width: 1024px) 58vw, calc(100vw - 2.5rem)"
                      className="about-page-lead-img"
                      style={objectPosition ? { objectPosition } : undefined}
                    />
                  ) : (
                    <span className="journal-pending" />
                  )}
                </ImageCurtain>
                <InteriorReveal className="project-index-copy-wrap">
                  <div className="project-index-copy" data-interior-reveal>
                    <h2 className="type-h2">{project.name}</h2>
                    <p className="type-body">{project.subtitle}</p>
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
