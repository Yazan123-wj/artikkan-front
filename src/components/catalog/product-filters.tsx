'use client';

import { LocalizedLink } from '@/components/shared/localized-link';
import { productListHref } from '@/lib/catalog';

type ProductFiltersProps = {
  query: string;
  category: string;
  categories: readonly string[];
  categoryLabels: Record<string, string>;
  searchLabel: string;
  searchPlaceholder: string;
  searchSubmit: string;
  filtersLabel: string;
  allLabel: string;
  onQueryChange: (value: string) => void;
};

export function ProductFilters({
  query,
  category,
  categories,
  categoryLabels,
  searchLabel,
  searchPlaceholder,
  searchSubmit,
  filtersLabel,
  allLabel,
  onQueryChange,
}: ProductFiltersProps) {
  return (
    <div className="products-toolbar site-container">
      <nav className="products-cats" aria-label={filtersLabel}>
        <LocalizedLink
          href={productListHref({ category: 'all' })}
          className={
            category === 'all' ? 'products-cat is-active' : 'products-cat'
          }
          aria-current={category === 'all' ? 'page' : undefined}
        >
          {allLabel}
        </LocalizedLink>
        {categories.map((id) => (
          <LocalizedLink
            key={id}
            href={productListHref({ category: id })}
            className={
              category === id ? 'products-cat is-active' : 'products-cat'
            }
            aria-current={category === id ? 'page' : undefined}
          >
            {categoryLabels[id] ?? id}
          </LocalizedLink>
        ))}
      </nav>

      <form
        className="products-search"
        role="search"
        onSubmit={(event) => event.preventDefault()}
      >
        <label htmlFor="product-search" className="sr-only">
          {searchLabel}
        </label>
        <input
          id="product-search"
          name="q"
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder={searchPlaceholder}
          className="products-search-input"
          autoComplete="off"
        />
        <button type="submit" className="products-search-submit">
          {searchSubmit}
        </button>
      </form>
    </div>
  );
}
