import Image from 'next/image';
import { getLocale, getTranslations } from 'next-intl/server';
import { ImageCurtain } from '@/components/motion/image-curtain';
import { ProjectGallery } from '@/components/projects/project-gallery';
import { ProductCard } from '@/components/sections/home/products/product-card';
import { EditorialLink } from '@/components/shared/editorial-link';
import { publicAssetExists } from '@/lib/assets';
import { getEnquiryEmail } from '@/config/site';
import {
  getProjectFeatureStill,
  getProjectGallery,
  getProjectProducts,
} from '@/lib/projects';
import { productPieceKey } from '@/lib/product-messages';
import type { FeaturedProject } from '@/types/project';

type ProjectDetailContentProps = {
  project: FeaturedProject;
};

export async function ProjectDetailContent({
  project,
}: ProjectDetailContentProps) {
  const locale = await getLocale();
  const t = await getTranslations('projectsPage');
  const tHome = await getTranslations('home.projects');
  const tGallery = await getTranslations('home.gallery');
  const tProducts = await getTranslations('home.products');
  const tCategories = await getTranslations('home.categories');
  const enquiryEmail = getEnquiryEmail();
  const name = tHome(`entries.${project.copyKey}.name`);
  const subtitle = tHome(`entries.${project.copyKey}.subtitle`);
  const products = getProjectProducts(project);
  const galleryItems = getProjectGallery(project)
    .filter((image) => publicAssetExists(image.src))
    .map((image) => ({ image: image.src, text: '' }));
  const feature = getProjectFeatureStill(project);
  const featureAvailable = publicAssetExists(feature.src);
  const featurePosition =
    locale === 'ar'
      ? (feature.objectPositionRtl ?? feature.objectPosition)
      : feature.objectPosition;

  return (
    <article className="project-detail-page">
      <div className="project-detail-hero">
        <div className="site-container">
          <EditorialLink href="/projects" className="project-detail-back" back>
            {t('backToProjects')}
          </EditorialLink>

          <header className="project-detail-masthead">
            <ul className="project-detail-meta">
              <li>
                {t('locationLabel')}: {t(`locations.${project.copyKey}`)}
              </li>
              <li>
                {t('yearLabel')}: {t(`years.${project.copyKey}`)}
              </li>
              <li>
                {t('typeLabel')}: {t(`types.${project.copyKey}`)}
              </li>
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
          <p className="type-body">{t('rolePending')}</p>
        </section>

        {products.length > 0 ? (
          <section
            className="project-detail-pieces"
            aria-labelledby="project-pieces-heading"
          >
            <h2 id="project-pieces-heading" className="type-h2">
              {t('piecesTitle')}
            </h2>
            <div className="featured-products-grid">
              {products.map((product) => (
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
