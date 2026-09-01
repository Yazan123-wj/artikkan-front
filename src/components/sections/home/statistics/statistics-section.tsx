'use client';

import { useRef } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { homeStatistics } from '@/config/home-content';
import { formatStatisticDisplay } from '@/lib/format-number';
import { AnimatedCounter } from './animated-counter';

export function StatisticsSection() {
  const t = useTranslations('home.statistics');
  const locale = useLocale();
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={sectionRef}
      className="statistics-section"
      aria-labelledby="home-statistics-heading"
    >
      <h2 id="home-statistics-heading" className="sr-only">
        {t('heading')}
      </h2>
      <div className="statistics-inner site-container">
        <ul className="statistics-grid">
          {homeStatistics.map((stat, index) => {
            const label = t(stat.labelKey);
            const finalValue = formatStatisticDisplay(
              stat.value,
              locale,
              stat.prefix,
              stat.suffix,
            );

            return (
              <li key={stat.id} className="statistics-item">
                <p className="sr-only">
                  {finalValue} {label}
                </p>
                <AnimatedCounter
                  value={stat.value}
                  locale={locale}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                  delay={index * 0.14}
                  triggerRef={sectionRef}
                />
                <span className="statistics-label" aria-hidden="true">
                  {label}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
