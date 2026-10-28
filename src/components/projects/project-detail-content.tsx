import Image from 'next/image';
import { getLocale, getTranslations } from 'next-intl/server';
import { ImageCurtain } from '@/components/motion/image-curtain';
import { ProjectGallery } from '@/components/projects/project-gallery';
import { ProductCard } from '@/components/sections/home/products/product-card';
import { EditorialLink } from '@/components/shared/editorial-link';
import { getEnquiryEmail } from '@/config/site';
import { getProductCardImage } from '@/config/product-card-images';
import {
  getProjectFeatureStill,
  getProjectGallery,
  getProjectProducts,
} from '@/lib/projects';
import { liveName, type LiveProject } from '@/lib/live-catalog';
import {
  liveProjectProducts,
  liveToFeaturedProject,
  projectImageAvailable,
} from '@/lib/project-display';
import { productPieceKey } from '@/lib/product-messages';
import type { FeaturedProject } from '@/types/project';

type ProjectDetailContentProps = {
  project?: FeaturedProject;
  live?: LiveProject;
};

export async function ProjectDetailContent({
  project,
  live,
}: ProjectDetailContentProps) {
  const locale = await getLocale();
  const t = await getTranslations('projectsPage');
  const tHome = await getTranslations('home.projects');
  const tGallery = await getTranslations('home.gallery');
  const tProducts = await getTranslations('home.products');
  const tCategories = await getTranslations('home.categories');
  const enquiryEmail = getEnquiryEmail();
  const featured = live ? liveToFeaturedProject(live) : project;
  if (!featured) return null;

  const copyKey = featured.copyKey ?? 'one';
  const name = live
    ? liveName(live.title, locale)
    : tHome(`entries.${copyKey}.name`);
  const subtitle = live
    ? liveName(live.overview, locale) || liveName(live.type, locale)
    : tHome(`entries.${copyKey}.subtitle`);
  const location = live
    ? liveName(live.location, locale)
    : copyKey
      ? t(`locations.${copyKey}`)
      : '';
  const year = live ? live.year : copyKey ? t(`years.${copyKey}`) : '';
  const type = live
    ? liveName(live.type, locale)
    : copyKey
      ? t(`types.${copyKey}`)
      : '';
  const overview = live
    ? liveName(live.overview, locale)
    : t('rolePending');
  const livePieces = live ? liveProjectProducts(live, locale) : [];
  const staticProducts = live ? [] : getProjectProducts(featured);
  const feature = live?.imageSrc
    ? featured.image ?? getProjectFeatureStill(featured)
    : getProjectFeatureStill(featured);
  const featureAvailable = projectImageAvailable(feature.src);
  const featurePosition =
    locale === 'ar'
      ? (feature.objectPositionRtl ?? feature.objectPosition)
      : feature.objectPosition;
  const galleryItems = (
    live
      ? [
          ...(featured.image ? [featured.image] : []),
          ...livePieces.map((item) => getProductCardImage(item.product)),
        ]
      : getProjectGallery(featured)
  )
    .filter((image) => projectImageAvailable(image.src))
    .map((image) => ({ image: image.src, text: '' }));

  return (
    <article className="project-detail-page">
      <div className="project-detail-hero">
        <div className="site-container">
          <EditorialLink href="/projects" className="project-detail-back" back>
            {t('backToProjects')}
          </EditorialLink>

          <header className="project-detail-masthead">
            <ul className="project-detail-meta">
              {location ? (
                <li>
                  {t('locationLabel')}: {location}
                </li>
              ) : null}
              {year ? (
                <li>
                  {t('yearLabel')}: {year}
                </li>
              ) : null}
              {type ? (
                <li>
                  {t('typeLabel')}: {type}
                </li>
              ) : null}
            </ul>
            <h1 className="type-h1">{name}</h1>
            <p className="type-body-lg">{subtitle}</p>
          </header>
        </div>
      </div>

      {featureAvailable ? (
        <div className="site-container">
          <ImageCurtain
            className="project-detail-feature"
            aspectRatio="16 / 9"
            parallax
          >
            <Image
              src={feature.src}
              alt={t('leadAlt')}
              fill
              quality={90}
              sizes="(min-width: 1440px) 1440px, 100vw"
              className="about-page-lead-img"
              style={
                featurePosition ? { objectPosition: featurePosition } : undefined
              }
            />
          </ImageCurtain>
        </div>
      ) : null}

      {galleryItems.length >= 2 ? (
        <section
          className="project-detail-gallery-section"
          aria-labelledby="project-gallery-heading"
        >
          <div className="site-container">
            <h2 id="project-gallery-heading" className="type-h2">
              {t('galleryTitle')}
            </h2>
          </div>
          <ProjectGallery
            items={galleryItems}
            ariaLabel={tGallery('regionLabel')}
          />
        </section>
      ) : null}

      <div className="site-container">
        <section className="project-detail-overview" aria-labelledby="project-role-heading">
          <h2 id="project-role-heading" className="type-h2">
            {t('roleTitle')}
          </h2>
          <p className="type-body">{overview}</p>
        </section>

        {livePieces.length > 0 ? (
          <section
            className="project-detail-pieces"
            aria-labelledby="project-pieces-heading"
          >
            <h2 id="project-pieces-heading" className="type-h2">
              {t('piecesTitle')}
            </h2>
            <div className="featured-products-grid">
              {livePieces.map((item) => (
                <ProductCard
                  key={item.product.id}
                  product={item.product}
                  name={item.name}
                  category={item.product.categoryKey}
                  imageAlt={item.name}
                  enquireLabel={tProducts('enquire')}
                  enquiryEmail={enquiryEmail}
                />
              ))}
            </div>
          </section>
        ) : null}

        {!live && staticProducts.length > 0 ? (
          <section
            className="project-detail-pieces"
            aria-labelledby="project-pieces-heading"
          >
            <h2 id="project-pieces-heading" className="type-h2">
              {t('piecesTitle')}
            </h2>
            <div className="featured-products-grid">
              {staticProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  name={tProducts(productPieceKey(product.nameKey, 'name'))}
                  category={tCategories(product.categoryKey)}
                  imageAlt={tProducts(productPieceKey(product.nameKey, 'alt'))}
                  enquireLabel={tProducts('enquire')}
                  enquiryEmail={enquiryEmail}
                />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </article>
  );
}
