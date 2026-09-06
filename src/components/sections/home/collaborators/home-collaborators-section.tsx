'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { useTranslations } from 'next-intl';
import { homeCollaborators } from '@/config/collaborators';
import { useGsapContext } from '@/hooks/use-gsap-context';
import { revealElements } from '@/lib/motion-timelines';

type HomeCollaboratorsSectionProps = {
  logos: Record<string, string | null>;
};

export function HomeCollaboratorsSection({
  logos,
}: HomeCollaboratorsSectionProps) {
  const t = useTranslations('home.collaborators');
  const rootRef = useRef<HTMLElement>(null);

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

        <ul className="home-collaborators-grid">
          {homeCollaborators.map((item) => {
            const name = t(`names.${item.nameKey}`);
            const logoSrc = logos[item.id];

            return (
              <li
                key={item.id}
                className="home-collaborators-cell"
                data-collaborator
              >
                <span className="home-collaborators-kind type-label">
                  {t(`columns.${item.kind}`)}
                </span>
                <div className="home-collaborators-mark">
                  {logoSrc ? (
                    <Image
                      src={logoSrc}
                      alt={name}
                      width={220}
                      height={88}
                      className="home-collaborators-logo"
                      sizes="176px"
                    />
                  ) : (
                    <span className="home-collaborators-wordmark">{name}</span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
