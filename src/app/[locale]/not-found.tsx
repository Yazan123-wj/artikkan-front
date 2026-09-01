import { getTranslations } from 'next-intl/server';
import { EditorialLink } from '@/components/shared/editorial-link';

export default async function LocaleNotFound() {
  const t = await getTranslations('notFound');

  return (
    <div className="locale-not-found">
      <div className="site-container">
        <div className="locale-not-found-inner">
          <h1 className="type-h1">{t('title')}</h1>
          <p className="type-body-lg">{t('body')}</p>
          <EditorialLink href="/" className="locale-not-found-actions" back>
            {t('home')}
          </EditorialLink>
        </div>
      </div>
    </div>
  );
}
