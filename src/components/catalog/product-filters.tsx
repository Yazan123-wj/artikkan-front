'use client';

import { LocalizedLink } from '@/components/shared/localized-link';

export type ProductFilterItem = {
  id: string;
  href: string;
  label: string;
};

type ProductFiltersProps = {
  query: string;
  filterItems?: readonly ProductFilterItem[];
  activeId: string;
  allHref: string;
  searchLabel: string;
  searchPlaceholder: string;
  searchSubmit: string;
  filtersLabel: string;
  allLabel: string;
  onQueryChange: (value: string) => void;
};

export function ProductFilters({
  query,
  filterItems = [],
  activeId,
  allHref,
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
          href={allHref}
          className={
            activeId === 'all' ? 'products-cat is-active' : 'products-cat'
          }
          aria-current={activeId === 'all' ? 'page' : undefined}
        >
          {allLabel}
        </LocalizedLink>
        {filterItems.map((item) => (
          <LocalizedLink
            key={item.id}
            href={item.href}
            className={
              activeId === item.id ? 'products-cat is-active' : 'products-cat'
            }
            aria-current={activeId === item.id ? 'page' : undefined}
          >
            {item.label}
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
