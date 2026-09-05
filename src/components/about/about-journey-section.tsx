'use client';

import { useRef } from 'react';
import { useGsapContext } from '@/hooks/use-gsap-context';
import { revealElements } from '@/lib/motion-timelines';

export type AboutJourneyStep = {
  id: string;
  index: string;
  title: string;
  body: string;
};

type AboutJourneySectionProps = {
  eyebrow: string;
  title: string;
  intro: string;
  steps: readonly AboutJourneyStep[];
};

export function AboutJourneySection({
  eyebrow,
  title,
  intro,
  steps,
}: AboutJourneySectionProps) {
  const rootRef = useRef<HTMLElement>(null);

  useGsapContext(() => {
    const root = rootRef.current;
    if (!root) {
      return;
    }

    const header = root.querySelector('[data-about-journey-header]');
    const items = root.querySelectorAll('[data-about-journey-step]');

    if (header) {
      revealElements(header, { trigger: root });
    }
    revealElements(items, { trigger: root });
  }, rootRef);

  return (
    <section
      ref={rootRef}
      className="about-page-journey"
      aria-labelledby="about-journey-heading"
    >
      <div className="about-page-journey-inner site-container">
        <header className="about-page-journey-header" data-about-journey-header>
          <p className="about-page-section-eyebrow type-label">{eyebrow}</p>
          <h2 id="about-journey-heading" className="about-page-section-title type-h2">
            {title}
          </h2>
          <p className="about-page-section-lede type-body-lg">{intro}</p>
        </header>

        <ol className="about-page-journey-list">
          {steps.map((step) => (
            <li
              key={step.id}
              className="about-page-journey-step"
              data-about-journey-step
            >
              <span className="about-page-journey-index type-label" aria-hidden="true">
                {step.index}
              </span>
              <div className="about-page-journey-copy">
                <h3 className="about-page-journey-step-title">{step.title}</h3>
                <p className="about-page-journey-step-body type-body">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
