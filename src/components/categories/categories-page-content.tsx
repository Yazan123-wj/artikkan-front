import { getTranslations } from 'next-intl/server';
import { CategoriesHero } from '@/components/categories/categories-hero';
import { CategoriesIndex } from '@/components/categories/categories-index';
import { featuredCategories } from '@/config/home-content';
import { publicAssetExists } from '@/lib/assets';
import { categoryProductsHref } from '@/lib/catalog';

const CATEGORY_FALLBACKS: Record<string, string> = {
  seating: '/images/catalog/categories/seating-hero.jpg',
  tables: '/images/catalog/categories/tables-hero.jpg',
  'unit-cabinets': '/images/catalog/categories/unit-cabinets-hero.jpg',
  'home-decor': '/images/catalog/categories/home-decor-hero.jpg',
  accessories: '/images/catalog/categories/accessories-hero.jpg',
};

export async function CategoriesPageContent() {
  const t = await getTranslations('categoriesPage');
  const tCategories = await getTranslations('home.categories');
  const headlineLines = t.raw('headlineLines') as readonly string[];
  const indexes = t.raw('indexes') as readonly string[];

  const items = featuredCategories.map((category, index) => {
    const preferred = category.image;
    const fallback = CATEGORY_FALLBACKS[category.id] ?? preferred;
    const image = publicAssetExists(preferred) ? preferred : fallback;

    return {
      id: category.id,
      href: categoryProductsHref(category.id),
      index: indexes[index] ?? String(index + 1).padStart(2, '0'),
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
        count={t('count')}
      />
      <CategoriesIndex label={t('indexLabel')} items={items} />
    </article>
  );
}
