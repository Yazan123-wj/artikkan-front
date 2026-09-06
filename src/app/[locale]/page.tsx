import { preload } from 'react-dom';
import { AboutSection } from '@/components/sections/home/about';
import { FeaturedCategories } from '@/components/sections/home/categories';
import { HomeGallerySection } from '@/components/sections/home/gallery';
import { Hero } from '@/components/sections/home/hero';
import { FeaturedProducts } from '@/components/sections/home/products';
import { FeaturedProjects } from '@/components/sections/home/projects';
import { HomeCollaboratorsSection } from '@/components/sections/home/collaborators';
import { HomeContactSection } from '@/components/sections/home/contact';
import { StatisticsSection } from '@/components/sections/home/statistics';
import { HERO_MEDIA, heroFrameUrl } from '@/config/hero';
import {
  ABOUT_IMAGE,
  featuredCategories,
  homeGalleryItems,
} from '@/config/home-content';
import {
  homeCollaborators,
  resolveCollaboratorLogo,
} from '@/config/collaborators';
import { getProductCardImage } from '@/config/product-card-images';
import { featuredProducts } from '@/config/products';
import { featuredProjects } from '@/config/projects';
import { getEnquiryEmail } from '@/config/site';
import { publicAssetExists } from '@/lib/assets';
import { createPageMetadata } from '@/lib/metadata';

type HomePageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ product?: string | string[] }>;
};

export async function generateMetadata({ params }: HomePageProps) {
  const { locale } = await params;
  return createPageMetadata({ locale, pathname: '/', titleKey: 'home' });
}

export default async function HomePage({ params, searchParams }: HomePageProps) {
  const { locale } = await params;
  const productParam = await searchParams;
  const productValue = Array.isArray(productParam.product)
    ? productParam.product[0]
    : productParam.product;
  const initialProduct = productValue?.trim() || null;
  preload(HERO_MEDIA.poster, { as: 'image' });
  const aboutImageAvailable = publicAssetExists(ABOUT_IMAGE.src);
  const categoryImageAvailability = Object.fromEntries(
    featuredCategories.map((category) => [
      category.id,
      publicAssetExists(category.image),
    ]),
  );
  const galleryImageAvailability = Object.fromEntries(
    homeGalleryItems.map((item) => [item.id, publicAssetExists(item.image)]),
  );
  const productImageAvailability = Object.fromEntries(
    featuredProducts.map((product) => [
      product.id,
      publicAssetExists(getProductCardImage(product).src),
    ]),
  );
  const projectImageAvailability = Object.fromEntries(
    featuredProjects.map((project) => [
      project.id,
      Boolean(project.image && publicAssetExists(project.image.src)),
    ]),
  );
  const collaboratorLogos = Object.fromEntries(
    homeCollaborators.map((item) => [
      item.id,
      resolveCollaboratorLogo(item, publicAssetExists),
    ]),
  );
  const enquiryEmail = getEnquiryEmail();

  return (
    <>
      <link
        rel="preload"
        as="image"
        href={heroFrameUrl('desktop', 1)}
        media="(min-width: 769px)"
      />
      <link
        rel="preload"
        as="image"
        href={heroFrameUrl('mobile', 1)}
        media="(max-width: 768px)"
      />
      <Hero />
      <AboutSection imageAvailable={aboutImageAvailable} />
      <StatisticsSection />
      <FeaturedCategories imageAvailability={categoryImageAvailability} />
      <HomeGallerySection imageAvailability={galleryImageAvailability} />
      <FeaturedProducts
        imageAvailability={productImageAvailability}
        enquiryEmail={enquiryEmail}
      />
      <FeaturedProjects
        projectImageAvailability={projectImageAvailability}
        productImageAvailability={productImageAvailability}
      />
      <HomeCollaboratorsSection logos={collaboratorLogos} />
      <HomeContactSection
        locale={locale}
        enquiryEmail={enquiryEmail}
        initialProduct={initialProduct}
      />
    </>
  );
}
