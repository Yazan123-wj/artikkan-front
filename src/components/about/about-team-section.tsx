'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { EditorialLink } from '@/components/shared/editorial-link';
import { useGsapContext } from '@/hooks/use-gsap-context';
import { revealElements } from '@/lib/motion-timelines';

export type AboutTeamMember = {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  available: boolean;
};

type AboutTeamSectionProps = {
  eyebrow: string;
  title: string;
  intro: string;
  contactCta: string;
  members: readonly AboutTeamMember[];
};

export function AboutTeamSection({
  eyebrow,
  title,
  intro,
  contactCta,
  members,
}: AboutTeamSectionProps) {
  const rootRef = useRef<HTMLElement>(null);

  useGsapContext(() => {
    const root = rootRef.current;
    if (!root) {
      return;
    }

    const header = root.querySelector('[data-about-team-header]');
    const cards = root.querySelectorAll('[data-about-team-card]');

    if (header) {
      revealElements(header, { trigger: root });
    }
    revealElements(cards, { trigger: root });
  }, rootRef);

  return (
    <section
      ref={rootRef}
      className="about-page-team"
      aria-labelledby="about-team-heading"
    >
      <div className="about-page-team-inner site-container">
        <div className="about-page-team-header" data-about-team-header>
          <div className="about-page-team-header-copy">
            <p className="about-page-section-eyebrow type-label">{eyebrow}</p>
            <h2 id="about-team-heading" className="about-page-team-title">
              {title}
            </h2>
            <p className="about-page-section-lede type-body-lg">{intro}</p>
          </div>
          <EditorialLink href="/#contact" className="about-page-contact-cta">
            {contactCta}
          </EditorialLink>
        </div>

        <ul className="about-page-team-grid">
          {members.map((member) => (
            <li key={member.id} className="about-page-team-card" data-about-team-card>
              <div className="about-page-team-card-media">
                {member.available ? (
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    quality={88}
                    sizes="(min-width: 1024px) 22vw, (min-width: 768px) 44vw, calc(100vw - 2.5rem)"
                    className="about-page-media-img"
                  />
                ) : (
                  <span className="about-page-media-pending" />
                )}
              </div>
              <p className="about-page-team-role type-label">{member.role}</p>
              <h3 className="about-page-team-name">{member.name}</h3>
              <p className="about-page-team-bio">{member.bio}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
