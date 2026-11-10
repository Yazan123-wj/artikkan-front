import type { MetadataRoute } from 'next';
import { journalArticles } from '@/config/journal';
import { legalNavigation, mainNavigation } from '@/config/navigation';
import { catalogProducts } from '@/config/products';
import { featuredProjects } from '@/config/projects';
import { routing } from '@/i18n/routing';
import { getSiteUrl } from '@/lib/constants';
import { getArticlePath } from '@/lib/journal';
import {
  fetchLiveJournal,
  fetchLiveProducts,
  fetchLiveProjects,
} from '@/lib/live-catalog';
import { liveArticleToJournal } from '@/lib/live-site';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const [liveProducts, liveProjects, liveArticles] = await Promise.all([
    fetchLiveProducts(),
    fetchLiveProjects(),
    fetchLiveJournal(),
  ]);

  const productPaths = (
    liveProducts && liveProducts.length > 0
      ? liveProducts.map((product) => `/products/${product.slug}`)
      : catalogProducts.map((product) => `/products/${product.slug}`)
  );
  const projectPaths = (
    liveProjects && liveProjects.length > 0
      ? liveProjects.map((project) => `/projects/${project.slug}`)
      : featuredProjects.map((project) => `/projects/${project.slug}`)
  );

  const paths = [
    ...new Set(
      [...mainNavigation, ...legalNavigation].map(
        (item) => item.href.replace(/#.*$/, '').split('?')[0] || '/',
      ),
    ),
    ...productPaths,
    ...projectPaths,
  ];

  const navEntries = routing.locales.flatMap((locale) =>
    paths.map((path) => {
      const pathname = path === '/' ? '' : path;

      return {
        url: `${siteUrl}/${locale}${pathname}`,
        alternates: {
          languages: Object.fromEntries(
            routing.locales.map((alternateLocale) => [
              alternateLocale,
              `${siteUrl}/${alternateLocale}${pathname}`,
            ]),
          ),
        },
      };
    }),
  );

  const articles =
    liveArticles && liveArticles.length > 0
      ? liveArticles.map(liveArticleToJournal)
      : journalArticles;

  const articleEntries = articles.flatMap((article) =>
    routing.locales.map((locale) => ({
      url: `${siteUrl}/${locale}${getArticlePath(article, locale)}`,
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((alternateLocale) => [
            alternateLocale,
            `${siteUrl}/${alternateLocale}${getArticlePath(article, alternateLocale)}`,
          ]),
        ),
      },
    })),
  );

  return [...navEntries, ...articleEntries];
}
