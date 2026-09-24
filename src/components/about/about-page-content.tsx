import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { AboutPageHero } from '@/components/about/about-page-hero';
import { AboutPullquoteBand } from '@/components/about/about-pullquote-band';
import { AboutValuesShowcase } from '@/components/about/about-values-showcase';
import { AboutJourneySection } from '@/components/about/about-journey-section';
import { AboutFoundersSection } from '@/components/about/about-founders-section';
import { ImageCurtain } from '@/components/motion/image-curtain';
import { StatisticsSection } from '@/components/sections/home/statistics';
import { ABOUT_FOUNDERS } from '@/config/about-founders';
import { ABOUT_IMAGE, homeGalleryItems } from '@/config/home-content';
import { publicAssetExists } from '@/lib/assets';

const QUOTE_IMAGE = '/media/hero/artikkan-hero-poster.jpg';

export async function AboutPageContent() {
  const t = await getTranslations('aboutPage');
  const leadAvailable = publicAssetExists(ABOUT_IMAGE.src);
  const quoteAvailable = publicAssetExists(QUOTE_IMAGE);
  const craftStill = homeGalleryItems[2];
  const craftAvailable = publicAssetExists(craftStill.image);
  const headlineLines = t.raw('headlineLines') as readonly string[];

  const valueItems = [
    {
      id: 'design',
      index: '01',
      title: t('values.design'),
      image: homeGalleryItems[0].image,
      alt: t('stills.lounge'),
      available: publicAssetExists(homeGalleryItems[0].image),
    },
    {
      id: 'materials',
      index: '02',
      title: t('values.materials'),
      image: homeGalleryItems[3].image,
      alt: t('stills.dining'),
      available: publicAssetExists(homeGalleryItems[3].image),
    },
    {
      id: 'craft',
      index: '03',
      title: t('values.craft'),
      image: homeGalleryItems[2].image,
      alt: t('stills.living'),
      available: publicAssetExists(homeGalleryItems[2].image),
    },
  ] as const;

  const founders = ABOUT_FOUNDERS.map((member) => ({
    ...member,
    name: t(`founders.${member.id}.name`),
    role: t(`founders.${member.id}.role`),
    words: t(`founders.${member.id}.words`),
    available: publicAssetExists(member.image),
  }));

  return (
    <article className="about-page">
      <AboutPageHero
        eyebrow={t('eyebrow')}
        headlineLines={headlineLines}
        intro={t('intro')}
        leadAlt={t('leadAlt')}
        imageAvailable={leadAvailable}
      />

      <AboutPullquoteBand
        quote={t('pullQuote')}
        label={t('pullQuoteLabel')}
        imageSrc={QUOTE_IMAGE}
        imageAvailable={quoteAvailable}
      />

      <AboutValuesShowcase
        eyebrow={t('valuesEyebrow')}
        title={t('valuesTitle')}
        items={valueItems}
      />

      <div className="about-page-stats" aria-label={t('statsNotice')}>
        <StatisticsSection />
      </div>

      <section
        className="about-page-editorial"
        aria-labelledby="about-difference-heading"
      >
        <div className="about-page-editorial-grid site-container">
          <div className="about-page-editorial-copy">
            <p className="about-page-section-eyebrow type-label">
              {t('differenceEyebrow')}
            </p>
            <h2 id="about-difference-heading" className="about-page-section-title type-h2">
              {t('differenceTitle')}
            </h2>
            <p className="about-page-section-lede type-body-lg">{t('differenceLead')}</p>
          </div>
          <div className="about-page-editorial-media">
            <ImageCurtain aspectRatio="4 / 3" parallax>
              {leadAvailable ? (
                <Image
                  src={ABOUT_IMAGE.src}
                  alt={t('leadAlt')}
                  fill
                  quality={88}
                  sizes="(min-width: 1024px) 44vw, calc(100vw - 2.5rem)"
                  className="about-page-media-img"
                  style={{ objectPosition: 'center 36%' }}
                />
              ) : (
                <span className="about-page-media-pending" />
              )}
            </ImageCurtain>
          </div>
        </div>
      </section>

      <section className="about-page-editorial is-reversed" aria-labelledby="about-craft-heading">
        <div className="about-page-editorial-grid site-container">
          <div className="about-page-editorial-copy">
            <p className="about-page-section-eyebrow type-label">{t('craftEyebrow')}</p>
            <h2 id="about-craft-heading" className="about-page-section-title type-h2">
              {t('craftTitle')}
            </h2>
            <p className="about-page-section-lede type-body-lg">{t('craftLead')}</p>
          </div>
          <div className="about-page-editorial-media">
            <ImageCurtain aspectRatio="4 / 3" parallax>
              {craftAvailable ? (
                <Image
                  src={craftStill.image}
                  alt={t('craftAlt')}
                  fill
                  quality={88}
                  sizes="(min-width: 1024px) 44vw, calc(100vw - 2.5rem)"
                  className="about-page-media-img"
                />
              ) : (
                <span className="about-page-media-pending" />
              )}
            </ImageCurtain>
          </div>
        </div>
      </section>

      <AboutJourneySection
        eyebrow={t('journeyEyebrow')}
        title={t('journeyTitle')}
        intro={t('journeyIntro')}
        steps={[
          {
            id: 'specify',
            index: '01',
            title: t('journey.specify.title'),
            body: t('journey.specify.body'),
          },
          {
            id: 'produce',
            index: '02',
            title: t('journey.produce.title'),
            body: t('journey.produce.body'),
          },
          {
            id: 'finish',
            index: '03',
            title: t('journey.finish.title'),
            body: t('journey.finish.body'),
          },
          {
            id: 'deliver',
            index: '04',
            title: t('journey.deliver.title'),
            body: t('journey.deliver.body'),
          },
        ]}
      />

      <AboutFoundersSection
        eyebrow={t('foundersEyebrow')}
        title={t('foundersTitle')}
        intro={t('foundersIntro')}
        contactCta={t('contactCta')}
        wordsLabel={t('foundersWordsLabel')}
        members={founders}
      />
    </article>
  );
}
