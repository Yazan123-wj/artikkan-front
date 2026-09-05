import { getTranslations } from 'next-intl/server';
import { ContactForm } from '@/components/sections/home/contact/contact-form';
import { ContactHashScroll } from '@/components/sections/home/contact/contact-hash-scroll';
import { ContactMap } from '@/components/sections/home/contact/contact-map';
import { ContactReveal } from '@/components/sections/home/contact/contact-reveal';
import { getMapEmbedSrc, getVerifiedContact } from '@/config/contact';

type HomeContactSectionProps = {
  locale: string;
  enquiryEmail: string | null;
};

export async function HomeContactSection({
  locale,
  enquiryEmail,
}: HomeContactSectionProps) {
  const t = await getTranslations('home.contact');
  const contact = getVerifiedContact();
  const address = contact.address
    ? locale === 'ar'
      ? contact.address.ar
      : contact.address.en
    : null;

  return (
    <section
      id="contact"
      className="home-contact-section"
      aria-labelledby="home-contact-heading"
    >
      <ContactHashScroll />
      <div className="site-container">
        <ContactReveal>
          <div className="home-contact-split">
            <div className="home-contact-intro" data-contact-reveal>
              <p className="home-contact-eyebrow type-label">{t('label')}</p>
              <h2 id="home-contact-heading" className="home-contact-headline type-h2">
                {t('headline')}
              </h2>
              <p className="home-contact-lede type-body">{t('intro')}</p>
            </div>

            <div data-contact-reveal>
              <ContactForm enquiryEmail={enquiryEmail} />
            </div>
          </div>

          <ContactMap
            embedSrc={getMapEmbedSrc(locale)}
            directionsUrl={contact.map.directionsUrl}
            title={t('mapTitle')}
            address={address}
          />
        </ContactReveal>
      </div>
    </section>
  );
}
