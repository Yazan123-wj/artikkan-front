import Image from 'next/image';
import { getLocale, getTranslations } from 'next-intl/server';
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
import { liveAssetAvailable, liveMedia } from '@/lib/live-catalog';
import { fetchLiveSite, liveCopy } from '@/lib/live-site';

const QUOTE_IMAGE = '/media/hero/artikkan-hero-poster.jpg';

export async function AboutPageContent() {
  const t = await getTranslations('aboutPage');
  const locale = await getLocale();
  const site = await fetchLiveSite();
  const leadSrc = site?.about.leadImage
    ? liveMedia(site.about.leadImage)
    : ABOUT_IMAGE.src;
  const quoteSrc = site?.about.quoteImage
    ? liveMedia(site.about.quoteImage)
    : QUOTE_IMAGE;
  const leadAvailable =
    liveAssetAvailable(site?.about.leadImage) || publicAssetExists(leadSrc);
  const quoteAvailable =
    liveAssetAvailable(site?.about.quoteImage) || publicAssetExists(quoteSrc);
  const craftStill = homeGalleryItems[2];
  const craftAvailable = publicAssetExists(craftStill.image);
  const headlineLines = site
    ? liveCopy(site.about.headline, locale).split('\n').filter(Boolean)
    : (t.raw('headlineLines') as readonly string[]);

  const valueItems = (site?.about.values.length
    ? site.about.values
    : [
        { id: 'design', title: { en: t('values.design'), ar: t('values.design') }, note: { en: '', ar: '' }, image: homeGalleryItems[0].image },
        { id: 'materials', title: { en: t('values.materials'), ar: t('values.materials') }, note: { en: '', ar: '' }, image: homeGalleryItems[3].image },
        { id: 'craft', title: { en: t('values.craft'), ar: t('values.craft') }, note: { en: '', ar: '' }, image: homeGalleryItems[2].image },
      ]
  ).map((item, index) => ({
    id: item.id,
    index: String(index + 1).padStart(2, '0'),
    title: site ? liveCopy(item.title, locale) : item.title.en,
    image: liveMedia(item.image),
    alt: site ? liveCopy(item.title, locale) : item.title.en,
    available: liveAssetAvailable(item.image) || publicAssetExists(item.image),
  }));

  const founders = (site?.about.founders.length
    ? site.about.founders.map((member) => ({
        id: member.id,
        image: liveMedia(member.image),
        name: liveCopy(member.name, locale),
        role: liveCopy(member.role, locale),
        words: liveCopy(member.words, locale),
        available: liveAssetAvailable(member.image) || publicAssetExists(member.image),
      }))
    : ABOUT_FOUNDERS.map((member) => ({
        ...member,
        name: t(`founders.${member.id}.name`),
        role: t(`founders.${member.id}.role`),
        words: t(`founders.${member.id}.words`),
        available: publicAssetExists(member.image),
      })));
  const liveStats = site?.stats.map((stat) => ({
    id: stat.id,
    value: stat.value,
    prefix: stat.prefix,
    suffix: stat.suffix,
    label: liveCopy(stat.label, locale),
  }));
  const journeySteps = site?.about.journey.length
    ? site.about.journey.map((step, index) => ({
        id: step.id,
        index: String(index + 1).padStart(2, '0'),
        title: liveCopy(step.title, locale),
        body: liveCopy(step.body, locale),
      }))
    : [
        { id: 'specify', index: '01', title: t('journey.specify.title'), body: t('journey.specify.body') },
        { id: 'produce', index: '02', title: t('journey.produce.title'), body: t('journey.produce.body') },
        { id: 'finish', index: '03', title: t('journey.finish.title'), body: t('journey.finish.body') },
        { id: 'deliver', index: '04', title: t('journey.deliver.title'), body: t('journey.deliver.body') },
      ];

  return (
    <article className="about-page">
      <AboutPageHero
        eyebrow={site ? liveCopy(site.about.eyebrow, locale) : t('eyebrow')}
        headlineLines={headlineLines}
        intro={site ? liveCopy(site.about.intro, locale) : t('intro')}
        leadAlt={t('leadAlt')}
        imageAvailable={leadAvailable}
        imageSrc={leadSrc}
      />

      <AboutPullquoteBand
        quote={site ? liveCopy(site.about.quote, locale) : t('pullQuote')}
        label={t('pullQuoteLabel')}
        imageSrc={quoteSrc}
        imageAvailable={quoteAvailable}
      />

      <AboutValuesShowcase
        eyebrow={t('valuesEyebrow')}
        title={t('valuesTitle')}
        items={valueItems}
      />

      <div className="about-page-stats" aria-label={t('statsNotice')}>
        <StatisticsSection stats={liveStats} />
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
              {site ? liveCopy(site.about.differentTitle, locale) : t('differenceTitle')}
            </h2>
            <p className="about-page-section-lede type-body-lg">
              {site ? liveCopy(site.about.differentLead, locale) : t('differenceLead')}
            </p>
          </div>
          <div className="about-page-editorial-media">
            <ImageCurtain aspectRatio="4 / 3" parallax>
              {leadAvailable ? (
                <Image
                  src={leadSrc}
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
        steps={journeySteps}
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
