import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { ProjectDetailContent } from '@/components/projects/project-detail-content';
import { featuredProjects } from '@/config/projects';
import { routing, type AppLocale } from '@/i18n/routing';
import { createPageMetadata } from '@/lib/metadata';
import { getProjectBySlug } from '@/lib/projects';

type ProjectSlugPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  return featuredProjects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: ProjectSlugPageProps) {
  const { locale, slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const resolvedLocale: AppLocale = hasLocale(routing.locales, locale)
    ? locale
    : routing.defaultLocale;
  const tHome = await getTranslations({
    locale: resolvedLocale,
    namespace: 'home.projects',
  });
  const title = tHome(`entries.${project.copyKey}.name`);

  return createPageMetadata({
    locale: resolvedLocale,
    pathname: `/projects/${project.slug}`,
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

  const project = getProjectBySlug(slug);
  if (!project) {
    notFound();
  }

  return <ProjectDetailContent project={project} />;
}
