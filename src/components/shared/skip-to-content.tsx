import { useTranslations } from 'next-intl';
import { MAIN_CONTENT_ID } from '@/lib/constants';

export function SkipToContent() {
  const t = useTranslations('a11y');

  return (
    <a href={`#${MAIN_CONTENT_ID}`} className="skip-link">
      {t('skipToContent')}
    </a>
  );
}
