'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { EditorialLink } from '@/components/shared/editorial-link';
import { useGsapContext } from '@/hooks/use-gsap-context';
import { cn } from '@/lib/utils';
import { revealElements } from '@/lib/motion-timelines';

export type AboutFounder = {
  id: string;
  name: string;
  role: string;
  words: string;
  image: string;
  available: boolean;
};

type AboutFoundersSectionProps = {
  eyebrow: string;
  title: string;
  intro: string;
  contactCta: string;
  wordsLabel: string;
  members: readonly AboutFounder[];
};

export function AboutFoundersSection({
  eyebrow,
  title,
  intro,
  contactCta,
  wordsLabel,
  members,
}: AboutFoundersSectionProps) {
  const rootRef = useRef<HTMLElement>(null);

  useGsapContext(() => {
    const root = rootRef.current;
    if (!root) {
      return;
    }

    const header = root.querySelector('[data-about-founders-header]');
    const panels = root.querySelectorAll('[data-about-founder]');

    if (header) {
      revealElements(header, { trigger: root });
    }
    revealElements(panels, { trigger: root, stagger: 0.08 });
  }, rootRef);

  return (
    <section
      ref={rootRef}
      className="about-page-founders"
      aria-labelledby="about-founders-heading"
    >
      <div className="about-page-founders-inner site-container">
        <div
          className="about-page-founders-header"
          data-about-founders-header
        >
          <div className="about-page-founders-header-copy">
            <p className="about-page-section-eyebrow type-label">{eyebrow}</p>
            <h2 id="about-founders-heading" className="about-page-founders-title">
              {title}
            </h2>
            <p className="about-page-section-lede type-body-lg">{intro}</p>
          </div>
          <EditorialLink href="/#contact" className="about-page-contact-cta">
            {contactCta}
          </EditorialLink>
        </div>

        <ul className="about-page-founders-track">
          {members.map((member, index) => (
            <li
              key={member.id}
              className={cn(
                'about-page-founder',
                index % 2 === 1 && 'is-reversed',
              )}
              data-about-founder
            >
              <div className="about-page-founder-media">
                {member.available ? (
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    quality={88}
                    sizes="(min-width: 768px) 42vw, calc(100vw - 2.5rem)"
                    className="about-page-media-img"
                  />
                ) : (
                  <span className="about-page-media-pending" />
                )}
              </div>
              <div className="about-page-founder-copy">
                <p className="about-page-founder-role type-label">{member.role}</p>
                <h3 className="about-page-founder-name">{member.name}</h3>
                <blockquote className="about-page-founder-words">
                  <p>
                    <span className="sr-only">{wordsLabel} </span>
                    {member.words}
                  </p>
                </blockquote>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
