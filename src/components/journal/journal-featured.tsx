import Image from 'next/image';
import { ImageCurtain } from '@/components/motion/image-curtain';
import { JournalReadLink } from '@/components/journal/journal-article-card';
import { LocalizedLink } from '@/components/shared/localized-link';
import { loc } from '@/lib/journal';
import type { JournalArticle } from '@/types/journal';

type JournalFeaturedProps = {
  article: JournalArticle;
  locale: string;
  categoryLabel: string;
  dateLabel: string;
  readLabel: string;
  draftLabel: string;
  imageAvailable: boolean;
  priority?: boolean;
  titleLevel?: 2 | 3;
};

export function JournalFeatured({
  article,
  locale,
  categoryLabel,
  dateLabel,
  readLabel,
  draftLabel,
  imageAvailable,
  priority = true,
  titleLevel = 2,
}: JournalFeaturedProps) {
  const href = `/journal/${loc(article.slug, locale)}`;
  const objectPosition =
    locale === 'ar'
      ? (article.image.objectPositionRtl ?? article.image.objectPosition)
      : article.image.objectPosition;

  return (
    <article className="journal-featured" data-journal-reveal>
      <div className="journal-featured-media">
        <ImageCurtain className="journal-featured-curtain" aspectRatio="4 / 3">
          <LocalizedLink
            href={href}
            className="journal-featured-media-link"
            aria-label={loc(article.title, locale)}
          >
            {imageAvailable ? (
              <Image
                src={article.image.src}
                alt={loc(article.imageAlt, locale)}
                fill
                sizes="(min-width: 1024px) 55vw, calc(100vw - 2.5rem)"
                quality={85}
                priority={priority}
                className="journal-featured-image"
                style={objectPosition ? { objectPosition } : undefined}
              />
            ) : (
              <span className="journal-pending" />
            )}
          </LocalizedLink>
        </ImageCurtain>
      </div>
      <div className="journal-featured-copy">
        <p className="journal-meta">
          {article.status === 'draft' && draftLabel ? (
            <span>{draftLabel}</span>
          ) : null}
          <span>{categoryLabel}</span>
          <span>{dateLabel}</span>
        </p>
        {titleLevel === 3 ? (
          <h3 className="journal-featured-title">{loc(article.title, locale)}</h3>
        ) : (
          <h2 className="journal-featured-title">{loc(article.title, locale)}</h2>
        )}
        <p className="journal-featured-excerpt">{loc(article.excerpt, locale)}</p>
        <JournalReadLink href={href} label={readLabel} />
      </div>
    </article>
  );
}
