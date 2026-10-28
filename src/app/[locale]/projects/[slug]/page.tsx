import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { ProjectDetailContent } from '@/components/projects/project-detail-content';
import { featuredProjects } from '@/config/projects';
import { routing, type AppLocale } from '@/i18n/routing';
import { fetchLiveProject, liveName } from '@/lib/live-catalog';
import { createPageMetadata } from '@/lib/metadata';
import { getProjectBySlug } from '@/lib/projects';

type ProjectSlugPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export const dynamicParams = true;

export function generateStaticParams() {
  return featuredProjects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: ProjectSlugPageProps) {
  const { locale, slug } = await params;
  const live = await fetchLiveProject(slug);
  const project = live ? null : getProjectBySlug(slug);

  if (!live && !project) {
    notFound();
  }

  const resolvedLocale: AppLocale = hasLocale(routing.locales, locale)
    ? locale
    : routing.defaultLocale;
  const tHome = await getTranslations({
    locale: resolvedLocale,
    namespace: 'home.projects',
  });
  const title = live
    ? liveName(live.title, resolvedLocale)
    : tHome(`entries.${project?.copyKey ?? 'one'}.name`);

  return createPageMetadata({
    locale: resolvedLocale,
    pathname: `/projects/${live?.slug ?? project?.slug}`,
    titleKey: 'projects',
    title,
  });
}

export default async function ProjectSlugPage({ params }: ProjectSlugPageProps) {
  const { locale, slug } = await params;
  const resolvedLocale: AppLocale = hasLocale(routing.locales, locale)
    ? locale
    : routing.defaultLocale;
  setRequestLocale(resolvedLocale);

  const live = await fetchLiveProject(slug);
  if (live) {
    return <ProjectDetailContent live={live} />;
  }

  const project = getProjectBySlug(slug);
  if (!project) {
    notFound();
  }

  return <ProjectDetailContent project={project} />;
}
