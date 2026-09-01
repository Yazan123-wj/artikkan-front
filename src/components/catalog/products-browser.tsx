'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { CatalogProductCard } from '@/components/catalog/catalog-product-card';
import { ProductFilters } from '@/components/catalog/product-filters';
import { ProductsHero } from '@/components/catalog/products-hero';
import { LocalizedLink } from '@/components/shared/localized-link';
import type { FeaturedProduct } from '@/types/product';

export type CatalogListItem = {
  product: FeaturedProduct;
  name: string;
  category: string;
  imageAlt: string;
  imageAvailable: boolean;
};

type ProductsBrowserProps = {
  eyebrow: string;
  headlineLines: readonly string[];
  intro: string;
  collectionsHref?: string;
  collectionsLabel?: string;
  items: readonly CatalogListItem[];
  initialQuery: string;
  category: string;
  categories: readonly string[];
  categoryLabels: Record<string, string>;
  searchLabel: string;
  searchPlaceholder: string;
  searchSubmit: string;
  filtersLabel: string;
  allLabel: string;
  viewDetailsLabel: string;
  emptyLabel: string;
  emptyActionLabel: string;
};

export function ProductsBrowser({
  eyebrow,
  headlineLines,
  intro,
  collectionsHref,
  collectionsLabel,
  items,
  initialQuery,
  category,
  categories,
  categoryLabels,
  searchLabel,
  searchPlaceholder,
  searchSubmit,
  filtersLabel,
  allLabel,
  viewDetailsLabel,
  emptyLabel,
  emptyActionLabel,
}: ProductsBrowserProps) {
  const t = useTranslations('productsPage');
  const [query, setQuery] = useState(initialQuery);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) {
      return items;
    }

    return items.filter((item) => {
      return (
        item.name.toLowerCase().includes(needle) ||
        item.category.toLowerCase().includes(needle) ||
        item.product.slug.toLowerCase().includes(needle)
      );
    });
  }, [items, query]);

  return (
    <>
      <ProductsHero
        eyebrow={eyebrow}
        headlineLines={headlineLines}
        intro={intro}
        count={t('pieceCount', { count: visible.length })}
        collectionsHref={collectionsHref}
        collectionsLabel={collectionsLabel}
      />

      <ProductFilters
        query={query}
        category={category}
        categories={categories}
        categoryLabels={categoryLabels}
        searchLabel={searchLabel}
        searchPlaceholder={searchPlaceholder}
        searchSubmit={searchSubmit}
        filtersLabel={filtersLabel}
        allLabel={allLabel}
        onQueryChange={setQuery}
      />

      <div className="site-container">
        {visible.length === 0 ? (
          <div className="products-empty">
            <p>{emptyLabel}</p>
            <LocalizedLink href="/products" className="products-reset">
              {emptyActionLabel}
            </LocalizedLink>
          </div>
        ) : (
          <div className="products-grid">
            {visible.map((item) => (
              <CatalogProductCard
                key={item.product.id}
                product={item.product}
                name={item.name}
                category={item.category}
                imageAlt={item.imageAlt}
                viewDetailsLabel={viewDetailsLabel}
                imageAvailable={item.imageAvailable}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
