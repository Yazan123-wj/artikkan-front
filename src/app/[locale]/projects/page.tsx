import { hasLocale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { ProjectsIndexContent } from '@/components/projects/projects-index-content';
import { routing, type AppLocale } from '@/i18n/routing';
import { createPageMetadata } from '@/lib/metadata';

type ProjectsPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: ProjectsPageProps) {
  const { locale } = await params;
  return createPageMetadata({
    locale,
    pathname: '/projects',
    titleKey: 'projects',
  });
}

export default async function ProjectsPage({ params }: ProjectsPageProps) {
  const { locale } = await params;
  const resolvedLocale: AppLocale = hasLocale(routing.locales, locale)
    ? locale
    : routing.defaultLocale;
  setRequestLocale(resolvedLocale);

  return <ProjectsIndexContent />;
}
