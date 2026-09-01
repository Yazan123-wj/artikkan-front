import { getTranslations } from 'next-intl/server';
import { createPageMetadata } from '@/lib/metadata';

type PrivacyPolicyPageProps = {
  params: Promise<{ locale: string }>;
};

type LegalSection = {
  heading: string;
  body: string;
};

export async function generateMetadata({ params }: PrivacyPolicyPageProps) {
  const { locale } = await params;
  return createPageMetadata({
    locale,
    pathname: '/privacy-policy',
    titleKey: 'privacyPolicy',
  });
}

export default async function PrivacyPolicyPage() {
  const t = await getTranslations('legal');
  const sections = t.raw('privacySections') as readonly LegalSection[];

  return (
    <article className="legal-page">
      <div className="site-container legal-page-inner">
        <header className="interior-intro">
          <h1 className="interior-headline type-h1">{t('privacyTitle')}</h1>
          <p className="interior-lede type-body-lg">{t('privacyIntro')}</p>
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
