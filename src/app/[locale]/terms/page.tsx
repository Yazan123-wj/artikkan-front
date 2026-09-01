import { getTranslations } from 'next-intl/server';
import { createPageMetadata } from '@/lib/metadata';

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
  const sections = t.raw('termsSections') as readonly LegalSection[];

  return (
    <article className="legal-page">
      <div className="site-container legal-page-inner">
        <header className="interior-intro">
          <h1 className="interior-headline type-h1">{t('termsTitle')}</h1>
          <p className="interior-lede type-body-lg">{t('termsIntro')}</p>
        </header>
        <div className="legal-page-body">
          {sections.map((section) => (
            <section key={section.heading} className="legal-page-section">
              <h2 className="type-h3">{section.heading}</h2>
              <p className="type-body">{section.body}</p>
            </section>
          ))}
        </div>
      </div>
    </article>
  );
}
