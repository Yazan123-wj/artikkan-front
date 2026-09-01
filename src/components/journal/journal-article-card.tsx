import Image from 'next/image';
import { LocalizedLink } from '@/components/shared/localized-link';
import { loc } from '@/lib/journal';
import { cn } from '@/lib/utils';
import type { JournalArticle } from '@/types/journal';

type JournalArticleCardProps = {
  article: JournalArticle;
  locale: string;
  categoryLabel: string;
  dateLabel: string;
  readLabel: string;
  draftLabel: string;
  imageAvailable: boolean;
};

function ReadArrow() {
  return (
    <span className="journal-read-arrow" aria-hidden="true">
      <svg viewBox="0 0 28 12" fill="none">
        <path d="M0 6h26M21.5 1.5 27 6l-5.5 4.5" />
      </svg>
    </span>
  );
}

export function JournalArticleCard({
  article,
  locale,
  categoryLabel,
  dateLabel,
  readLabel,
  draftLabel,
  imageAvailable,
}: JournalArticleCardProps) {
  const href = `/journal/${loc(article.slug, locale)}`;
  const title = loc(article.title, locale);
  const objectPosition =
    locale === 'ar'
      ? (article.image.objectPositionRtl ?? article.image.objectPosition)
      : article.image.objectPosition;

  return (
    <article className="journal-card" data-journal-reveal>
      <div className="journal-card-media">
        <LocalizedLink href={href} className="journal-card-media-link" aria-label={title}>
          {imageAvailable ? (
            <Image
              src={article.image.src}
              alt={loc(article.imageAlt, locale)}
              fill
              sizes="(min-width: 1440px) 420px, (min-width: 768px) 45vw, calc(100vw - 2.5rem)"
              quality={85}
              loading="lazy"
              className="journal-card-image"
              style={objectPosition ? { objectPosition } : undefined}
            />
          ) : (
            <span className="journal-pending" />
          )}
        </LocalizedLink>
      </div>
      <p className="journal-meta">
        {article.status === 'draft' && draftLabel ? (
          <span>{draftLabel}</span>
        ) : null}
        <span>{categoryLabel}</span>
        <span>{dateLabel}</span>
      </p>
      <h3 className="journal-card-title">
        <LocalizedLink href={href} className="journal-card-title-link">
          {title}
        </LocalizedLink>
      </h3>
      <p className="journal-card-excerpt">{loc(article.excerpt, locale)}</p>
      <LocalizedLink href={href} className="journal-read">
        <span className="journal-read-label">{readLabel}</span>
        <ReadArrow />
      </LocalizedLink>
    </article>
  );
}

export function JournalReadLink({
  href,
  label,
  className,
}: {
  href: string;
  label: string;
  className?: string;
}) {
  return (
    <LocalizedLink href={href} className={cn('journal-read', className)}>
      <span className="journal-read-label">{label}</span>
      <ReadArrow />
    </LocalizedLink>
  );
}
