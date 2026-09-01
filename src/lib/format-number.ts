/**
 * Locale-aware statistic formatting.
 * English uses Western (latn) digits.
 * Arabic uses Eastern Arabic-Indic digits (`arab`) via `ar-QA`.
 * Confirm with Artikkan if Arabic should instead keep Western numerals.
 */
export function formatStatisticNumber(value: number, locale: string): string {
  return new Intl.NumberFormat(locale === 'ar' ? 'ar-QA' : 'en-US', {
    numberingSystem: locale === 'ar' ? 'arab' : 'latn',
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatStatisticDisplay(
  value: number,
  locale: string,
  prefix = '',
  suffix = '',
): string {
  return `${prefix}${formatStatisticNumber(value, locale)}${suffix}`;
}
