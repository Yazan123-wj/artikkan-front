import { getLocale, getTranslations } from 'next-intl/server';
import { createPageMetadata } from '@/lib/metadata';
import { fetchLiveSite, liveCopy } from '@/lib/live-site';

type TermsPageProps = {
  params: Promise<{ locale: string }>;
};

type LegalSection = {
  heading: string;
  body: string;
};

export async function generateMetadata({ params }: TermsPageProps) {
  const { locale } = await params;
  return createPageMetadata({
    locale,
    pathname: '/terms',
    titleKey: 'terms',
  });
}

export default async function TermsPage() {
  const t = await getTranslations('legal');
  const locale = await getLocale();
  const site = await fetchLiveSite();
  const sections = t.raw('termsSections') as readonly LegalSection[];
  const liveBody = site ? liveCopy(site.legal.termsBody, locale) : '';

  return (
    <article className="legal-page">
      <div className="site-container legal-page-inner">
        <header className="interior-intro">
          <h1 className="interior-headline type-h1">
            {site ? liveCopy(site.legal.termsTitle, locale) : t('termsTitle')}
          </h1>
          {liveBody ? null : (
            <p className="interior-lede type-body-lg">{t('termsIntro')}</p>
          )}
        </header>
        <div className="legal-page-body">
          {liveBody ? (
            <section className="legal-page-section">
              <p className="type-body" style={{ whiteSpace: 'pre-wrap' }}>
                {liveBody}
              </p>
            </section>
          ) : (
            sections.map((section) => (
              <section key={section.heading} className="legal-page-section">
                <h2 className="type-h3">{section.heading}</h2>
                <p className="type-body">{section.body}</p>
              </section>
            ))
          )}
        </div>
      </div>
    </article>
  );
}
