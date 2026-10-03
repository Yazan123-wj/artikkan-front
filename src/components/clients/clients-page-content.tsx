import { getTranslations } from 'next-intl/server';
import { CollaboratorsGrid } from '@/components/sections/home/collaborators/collaborators-grid';
import { EditorialLink } from '@/components/shared/editorial-link';
import {
  resolveCollaboratorLogo,
  uniqueCollaborators,
} from '@/config/collaborators';
import { publicAssetExists } from '@/lib/assets';

export async function ClientsPageContent() {
  const t = await getTranslations('clientsPage');
  const tHome = await getTranslations('home.collaborators');

  const items = uniqueCollaborators.map((item) => ({
    id: item.id,
    name: tHome(`names.${item.nameKey}`),
    kindLabel: tHome(`columns.${item.kind}`),
    logoSrc: resolveCollaboratorLogo(item, publicAssetExists),
  }));

  return (
    <div className="clients-page">
      <div className="site-container">
        <header className="interior-intro clients-intro">
          <p className="interior-eyebrow type-label">{t('eyebrow')}</p>
          <h1 className="interior-headline type-h1">{t('headline')}</h1>
          <p className="interior-lede type-body-lg">{t('intro')}</p>
        </header>

        <CollaboratorsGrid items={items} />

        <div className="clients-back">
          <EditorialLink href="/" back>
            {t('back')}
          </EditorialLink>
        </div>
      </div>
    </div>
  );
}
