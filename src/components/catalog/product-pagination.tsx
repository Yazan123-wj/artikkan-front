import { LocalizedLink } from '@/components/shared/localized-link';
import { productListHref } from '@/lib/catalog';

type ProductPaginationProps = {
  query: string;
  category: string;
  sort: string;
  currentPage: number;
  totalPages: number;
  paginationLabel: string;
  previousLabel: string;
  nextLabel: string;
  pageOfLabel: string;
};

export function ProductPagination({
  query,
  category,
  sort,
  currentPage,
  totalPages,
  paginationLabel,
  previousLabel,
  nextLabel,
  pageOfLabel,
}: ProductPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);
  const hrefFor = (page: number) =>
    productListHref({ q: query, category, sort, page });

  return (
    <nav className="journal-pagination" aria-label={paginationLabel}>
      {currentPage <= 1 ? (
        <span className="journal-pagination-link" aria-disabled="true">
          {previousLabel}
        </span>
      ) : (
        <LocalizedLink
          href={hrefFor(currentPage - 1)}
          className="journal-pagination-link"
        >
          {previousLabel}
        </LocalizedLink>
      )}

      {pages.map((page) => (
        <LocalizedLink
          key={page}
          href={hrefFor(page)}
          className={
            page === currentPage
              ? 'journal-pagination-link is-current'
              : 'journal-pagination-link'
          }
          aria-current={page === currentPage ? 'page' : undefined}
        >
          {page}
        </LocalizedLink>
      ))}

      {currentPage >= totalPages ? (
        <span className="journal-pagination-link" aria-disabled="true">
          {nextLabel}
        </span>
      ) : (
        <LocalizedLink
          href={hrefFor(currentPage + 1)}
          className="journal-pagination-link"
        >
          {nextLabel}
        </LocalizedLink>
      )}

      <span className="journal-pagination-status">{pageOfLabel}</span>
    </nav>
  );
}
