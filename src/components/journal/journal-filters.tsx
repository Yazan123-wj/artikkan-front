'use client';

import { LocalizedLink } from '@/components/shared/localized-link';
import { journalListHref } from '@/lib/journal';
import type { JournalCategoryId } from '@/types/journal';

type JournalFiltersProps = {
  query: string;
  category: string;
  categories: readonly JournalCategoryId[];
  searchLabel: string;
  searchPlaceholder: string;
  searchSubmit: string;
  filtersLabel: string;
  allLabel: string;
  categoryLabels: Record<JournalCategoryId, string>;
  onQueryChange: (value: string) => void;
};

export function JournalFilters({
  query,
  category,
  categories,
  searchLabel,
  searchPlaceholder,
  searchSubmit,
  filtersLabel,
  allLabel,
  categoryLabels,
  onQueryChange,
}: JournalFiltersProps) {
  return (
    <div className="journal-toolbar">
      <nav className="journal-cats" aria-label={filtersLabel}>
        <LocalizedLink
          href={journalListHref({ category: 'all' })}
          className={category === 'all' ? 'journal-cat is-active' : 'journal-cat'}
          aria-current={category === 'all' ? 'page' : undefined}
        >
          {allLabel}
        </LocalizedLink>
        {categories.map((id) => (
          <LocalizedLink
            key={id}
            href={journalListHref({ category: id })}
            className={category === id ? 'journal-cat is-active' : 'journal-cat'}
            aria-current={category === id ? 'page' : undefined}
          >
            {categoryLabels[id]}
          </LocalizedLink>
        ))}
      </nav>

      <form
        className="journal-search"
        role="search"
        onSubmit={(event) => event.preventDefault()}
      >
        <label htmlFor="journal-search" className="sr-only">
          {searchLabel}
        </label>
        <input
          id="journal-search"
          name="q"
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder={searchPlaceholder}
          className="journal-search-input"
          autoComplete="off"
        />
        <button type="submit" className="journal-search-submit">
          {searchSubmit}
        </button>
      </form>
    </div>
  );
}
