'use client';

import { useRef } from 'react';
import { useTranslations } from 'next-intl';
import { CollaboratorsGrid } from '@/components/sections/home/collaborators/collaborators-grid';
import { EditorialLink } from '@/components/shared/editorial-link';
import {
  HOME_COLLABORATOR_PREVIEW_COUNT,
  uniqueCollaborators,
} from '@/config/collaborators';
import { useGsapContext } from '@/hooks/use-gsap-context';
import { revealElements } from '@/lib/motion-timelines';

type LiveHomeCollaborator = {
  id: string;
  name: string;
  kindLabel: string;
  logoSrc: string | null;
};

type HomeCollaboratorsSectionProps = {
  logos: Record<string, string | null>;
  liveItems?: LiveHomeCollaborator[];
};

export function HomeCollaboratorsSection({
  logos,
  liveItems,
}: HomeCollaboratorsSectionProps) {
  const t = useTranslations('home.collaborators');
  const rootRef = useRef<HTMLElement>(null);
  const preview =
    liveItems
      ? liveItems.slice(0, HOME_COLLABORATOR_PREVIEW_COUNT)
      : uniqueCollaborators.slice(0, HOME_COLLABORATOR_PREVIEW_COUNT).map((item) => ({
          id: item.id,
          name: t(`names.${item.nameKey}`),
          kindLabel: t(`columns.${item.kind}`),
          logoSrc: logos[item.id],
        }));
  const hasMore =
    (liveItems ? liveItems.length : uniqueCollaborators.length) > preview.length;

  useGsapContext(() => {
    const root = rootRef.current;
    if (!root) {
      return;
    }

    const header = root.querySelector('[data-collaborators-header]');
    const items = root.querySelectorAll('[data-collaborator]');

    if (header) {
      revealElements(header, { trigger: root });
    }
    revealElements(items, { trigger: root, stagger: 0.05 });
  }, rootRef);

  return (
    <section
      ref={rootRef}
      className="home-collaborators-section"
      aria-labelledby="home-collaborators-heading"
    >
      <div className="site-container">
        <header className="home-collaborators-header" data-collaborators-header>
          <p className="home-collaborators-eyebrow type-label">{t('eyebrow')}</p>
          <h2
            id="home-collaborators-heading"
            className="home-collaborators-headline type-h2"
          >
            {t('headline')}
          </h2>
          <p className="home-collaborators-intro type-body">{t('intro')}</p>
        </header>

        <CollaboratorsGrid items={preview} />

        {hasMore ? (
          <div className="home-collaborators-more">
            <EditorialLink href="/clients">{t('viewMore')}</EditorialLink>
          </div>
        ) : null}
      </div>
    </section>
  );
}
