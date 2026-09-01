import type { MetadataRoute } from 'next';
import { journalArticles } from '@/config/journal';
import { legalNavigation, mainNavigation } from '@/config/navigation';
import { catalogProducts } from '@/config/products';
import { featuredProjects } from '@/config/projects';
import { routing } from '@/i18n/routing';
import { getSiteUrl } from '@/lib/constants';
import { getArticlePath } from '@/lib/journal';

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const paths = [
    ...new Set(
      [...mainNavigation, ...legalNavigation].map(
        (item) => item.href.replace(/#.*$/, '').split('?')[0] || '/',
      ),
    ),
    ...catalogProducts.map((product) => `/products/${product.slug}`),
    ...featuredProjects.map((project) => `/projects/${project.slug}`),
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

  const articleEntries = journalArticles.flatMap((article) =>
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
