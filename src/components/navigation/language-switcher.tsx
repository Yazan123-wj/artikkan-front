'use client';

import { useLocale, useTranslations } from 'next-intl';
import { LocalizedLink } from '@/components/shared/localized-link';
import { usePathname } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { cn } from '@/lib/utils';

type LanguageSwitcherProps = {
  compact?: boolean;
  className?: string;
};

export function LanguageSwitcher({
  compact = false,
  className,
}: LanguageSwitcherProps) {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations('language');

  return (
    <nav
      className={cn('language-switcher', compact && 'is-compact', className)}
      aria-label={t('switcherLabel')}
    >
      {routing.locales.map((nextLocale) => {
        const isCurrent = nextLocale === locale;

        return (
          <LocalizedLink
            key={nextLocale}
            href={pathname}
            locale={nextLocale}
            hrefLang={nextLocale}
            aria-current={isCurrent ? 'page' : undefined}
            aria-label={t(nextLocale)}
            className="interactive"
          >
            {nextLocale === 'en' ? t('enShort') : t('arShort')}
          </LocalizedLink>
        );
      })}
    </nav>
  );
}
