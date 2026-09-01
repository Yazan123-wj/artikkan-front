import Image from 'next/image';
import { LocalizedLink } from '@/components/shared/localized-link';
import { publicAssetExists } from '@/lib/assets';
import { isSafeHref, loc } from '@/lib/journal';
import type { JournalBlock, JournalInlinePart } from '@/types/journal';

type JournalArticleBodyProps = {
  blocks: readonly JournalBlock[];
  locale: string;
};

function InlineParts({
  parts,
  locale,
}: {
  parts: readonly JournalInlinePart[];
  locale: string;
}) {
  return (
    <>
      {parts.map((part, index) => {
        const text = loc(part.text, locale);

        if (!part.href || !isSafeHref(part.href)) {
          return <span key={index}>{text}</span>;
        }

        if (part.href.startsWith('/')) {
          return (
            <LocalizedLink key={index} href={part.href}>
              {text}
            </LocalizedLink>
          );
        }

        return (
          <a
            key={index}
            href={part.href}
            rel="noopener noreferrer"
            target="_blank"
          >
            {text}
          </a>
        );
      })}
    </>
  );
}

export function JournalArticleBody({ blocks, locale }: JournalArticleBodyProps) {
  return (
    <div className="journal-article-body">
      {blocks.map((block, index) => {
        if (block.type === 'heading') {
          const HeadingTag = block.level === 3 ? 'h3' : 'h2';
          return (
            <HeadingTag key={index}>{loc(block.text, locale)}</HeadingTag>
          );
        }

        if (block.type === 'paragraph') {
          return (
            <p key={index}>
              <InlineParts parts={block.parts} locale={locale} />
            </p>
          );
        }

        if (block.type === 'list') {
          const ListTag = block.ordered ? 'ol' : 'ul';
          return (
            <ListTag key={index}>
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex}>{loc(item, locale)}</li>
              ))}
            </ListTag>
          );
        }

        const objectPosition =
          locale === 'ar'
            ? (block.image.objectPositionRtl ?? block.image.objectPosition)
            : block.image.objectPosition;
        const imageAvailable = publicAssetExists(block.image.src);

        return (
          <figure key={index} className="journal-figure">
            <div className="journal-figure-frame">
              {imageAvailable ? (
                <Image
                  src={block.image.src}
                  alt={loc(block.alt, locale)}
                  fill
                  sizes="(min-width: 768px) 40rem, calc(100vw - 2.5rem)"
                  quality={85}
                  style={objectPosition ? { objectPosition } : undefined}
                />
              ) : (
                <span className="journal-pending" />
              )}
            </div>
            {block.caption ? (
              <figcaption className="journal-figure-caption">
                {loc(block.caption, locale)}
              </figcaption>
            ) : null}
          </figure>
        );
      })}
    </div>
  );
}
