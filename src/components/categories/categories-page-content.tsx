import { getTranslations } from 'next-intl/server';
import { CategoriesHero } from '@/components/categories/categories-hero';
import { CategoriesIndex } from '@/components/categories/categories-index';
import { featuredCategories } from '@/config/home-content';
import { publicAssetExists } from '@/lib/assets';
import { categoryProductsHref } from '@/lib/catalog';
import type { AppLocale } from '@/i18n/routing';
import {
  fetchLiveCategories,
  liveAssetAvailable,
  liveMedia,
  liveName,
} from '@/lib/live-catalog';

const CATEGORY_FALLBACKS: Record<string, string> = {
  seating: '/images/catalog/categories/seating-hero.jpg',
  tables: '/images/catalog/categories/tables-hero.jpg',
  'unit-cabinets': '/images/catalog/categories/unit-cabinets-hero.jpg',
  'home-decor': '/images/catalog/categories/home-decor-hero.jpg',
  accessories: '/images/catalog/categories/accessories-hero.jpg',
};

function imageReady(src: string) {
  return liveAssetAvailable(src) || publicAssetExists(src);
}

type CategoriesPageContentProps = {
  locale: AppLocale;
};

export async function CategoriesPageContent({ locale }: CategoriesPageContentProps) {
  const t = await getTranslations('categoriesPage');
  const tCategories = await getTranslations('home.categories');
  const headlineLines = t.raw('headlineLines') as readonly string[];
  const live = await fetchLiveCategories();

  const items =
    live && live.length > 0
      ? live.map((category, index) => {
          const raw = category.imageSrc || CATEGORY_FALLBACKS[category.slug] || '';
          const image = liveMedia(raw);
          return {
            id: category.slug,
            href: categoryProductsHref(category.slug),
            index: String(index + 1).padStart(2, '0'),
            title: liveName(category.name, locale),
            lede:
              liveName(category.lede, locale) ||
              (CATEGORY_FALLBACKS[category.slug]
                ? t(`ledes.${category.slug}` as 'ledes.seating')
                : ''),
            cta: t('viewCollection'),
            image,
            alt: liveName(category.name, locale),
            available: Boolean(image) && imageReady(raw),
            featured: index === 0,
          };
        })
      : featuredCategories.map((category, index) => {
          const preferred = category.image;
          const fallback = CATEGORY_FALLBACKS[category.id] ?? preferred;
          const image = publicAssetExists(preferred) ? preferred : fallback;
          return {
            id: category.id,
            href: categoryProductsHref(category.id),
            index: String(index + 1).padStart(2, '0'),
            title: tCategories(category.labelKey),
            lede: t(`ledes.${category.id}`),
            cta: t('viewCollection'),
            image,
            alt: tCategories(category.altKey),
            available: publicAssetExists(image),
            featured: index === 0,
          };
        });

  return (
    <article className="categories-page">
      <CategoriesHero
        eyebrow={t('eyebrow')}
        headlineLines={headlineLines}
        intro={t('intro')}
        count={t('count', { count: String(items.length).padStart(2, '0') })}
      />
      <CategoriesIndex label={t('indexLabel')} items={items} />
    </article>
  );
}
