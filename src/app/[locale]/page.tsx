import { preload } from 'react-dom';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { AboutSection } from '@/components/sections/home/about';
import { FeaturedCategories } from '@/components/sections/home/categories';
import { HomeGallerySection } from '@/components/sections/home/gallery';
import { Hero } from '@/components/sections/home/hero';
import { FeaturedProducts } from '@/components/sections/home/products';
import { FeaturedProjects } from '@/components/sections/home/projects';
import { HomeCollaboratorsSection } from '@/components/sections/home/collaborators';
import { HomeContactSection } from '@/components/sections/home/contact';
import { HomePromoBanners } from '@/components/sections/home/promo/home-promo-banners';
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
import { routing, type AppLocale } from '@/i18n/routing';
import { publicAssetExists } from '@/lib/assets';
import {
  fetchLiveCategories,
  fetchLiveCollaborators,
  fetchLiveFeaturedProducts,
  fetchLiveProjects,
  liveAssetAvailable,
  liveMedia,
  liveName,
  toFeaturedProduct,
} from '@/lib/live-catalog';
import { fetchLiveSite, liveCopy } from '@/lib/live-site';
import { createPageMetadata } from '@/lib/metadata';
import {
  homeProjectRowsFromLive,
  homeProjectRowsFromStatic,
} from '@/lib/project-display';

type HomePageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ product?: string | string[] }>;
};

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: HomePageProps) {
  const { locale } = await params;
  return createPageMetadata({ locale, pathname: '/', titleKey: 'home' });
}

export default async function HomePage({ params, searchParams }: HomePageProps) {
  const { locale } = await params;
  const resolvedLocale: AppLocale = hasLocale(routing.locales, locale)
    ? locale
    : routing.defaultLocale;
  setRequestLocale(resolvedLocale);
  const productParam = await searchParams;
  const productValue = Array.isArray(productParam.product)
    ? productParam.product[0]
    : productParam.product;
  const initialProduct = productValue?.trim() || null;
  const site = await fetchLiveSite();
  const heroPoster = site?.hero.poster
    ? liveMedia(site.hero.poster)
    : HERO_MEDIA.poster;
  preload(heroPoster, { as: 'image' });
  const aboutImageSrc = site?.homeAbout.image
    ? liveMedia(site.homeAbout.image)
    : ABOUT_IMAGE.src;
  const aboutImageAvailable =
    liveAssetAvailable(site?.homeAbout.image) || publicAssetExists(aboutImageSrc);
  const tHomeCategories = await getTranslations({
    locale: resolvedLocale,
    namespace: 'home.categories',
  });
  const liveCategories = await fetchLiveCategories();
  const homeCategoryItems =
    liveCategories && liveCategories.length > 0
      ? liveCategories.map((category) => {
          const raw = category.imageSrc || '';
          const image = raw ? liveMedia(raw) : '';
          const name = liveName(category.name, resolvedLocale);
          return {
            image,
            label: name,
            alt: name,
            link: `/products?category=${category.slug}`,
            imageAvailable: liveAssetAvailable(raw) || publicAssetExists(raw),
          };
        })
      : featuredCategories.map((category) => ({
          image: category.image,
          label: tHomeCategories(category.labelKey),
          alt: tHomeCategories(category.altKey),
          link: category.href,
          imageAvailable: publicAssetExists(category.image),
        }));
  const selectedViews = (site?.selectedViews ?? []).filter((item) => item.image);
  const galleryImageAvailability = Object.fromEntries(
    (selectedViews.length
      ? selectedViews.map((item) => [item.id, liveAssetAvailable(item.image) || publicAssetExists(item.image)])
      : homeGalleryItems.map((item) => [item.id, publicAssetExists(item.image)])
    ) as [string, boolean][],
  );
  const liveFeatured = await fetchLiveFeaturedProducts();
  const liveFeaturedItems =
    liveFeatured === null
      ? undefined
      : liveFeatured.map((product) => ({
          product: toFeaturedProduct(product),
          name: liveName(product.name, resolvedLocale),
          category: liveName(
            liveCategories?.find((item) => item.slug === product.category)?.name,
            resolvedLocale,
          ) || product.category,
        }));
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
  const liveCollaborators = await fetchLiveCollaborators();
  const homepageIds = site?.homepageCollaboratorIds ?? [];
  const homeLiveCollaborators = (liveCollaborators ?? [])
    .filter((item) =>
      homepageIds.length > 0 ? homepageIds.includes(item.id) : item.featured,
    )
    .map((item) => ({
      id: item.id,
      name: item.name,
      kindLabel: item.kind,
      logoSrc: item.logoSrc ? liveMedia(item.logoSrc) : null,
    }));
  const collaboratorLogos = Object.fromEntries(
    homeCollaborators.map((item) => [
      item.id,
      resolveCollaboratorLogo(item, publicAssetExists),
    ]),
  );
  const liveStats = site?.stats.map((stat) => ({
    id: stat.id,
    value: stat.value,
    prefix: stat.prefix,
    suffix: stat.suffix,
    label: liveCopy(stat.label, resolvedLocale),
  }));
  const promoBanners = (site?.promoBanners ?? [])
    .filter((banner) => banner.enabled)
    .map((banner) => ({
      id: banner.id,
      image: banner.image,
      title: liveCopy(banner.title, resolvedLocale),
      href: banner.href,
    }));
  const enquiryEmail = getEnquiryEmail();
  const tProjects = await getTranslations({
    locale: resolvedLocale,
    namespace: 'home.projects',
  });
  const tProducts = await getTranslations({
    locale: resolvedLocale,
    namespace: 'home.products',
  });
  const liveProjects = await fetchLiveProjects();
  const projectRows =
    liveProjects === null
      ? homeProjectRowsFromStatic(
          (key) => tProjects(key as never),
          (key) => tProducts(key as never),
          productImageAvailability,
          projectImageAvailability,
          tProjects('pendingProduct'),
          tProjects('pendingPhotography'),
        )
      : homeProjectRowsFromLive(
          liveProjects,
          resolvedLocale,
          tProjects('pendingProduct'),
          tProjects('pendingPhotography'),
        );

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
      <Hero
        media={
          site
            ? {
                poster: heroPoster,
                videoDesktop: site.hero.videoDesktop
                  ? liveMedia(site.hero.videoDesktop)
                  : '',
                videoMobile: site.hero.videoMobile
                  ? liveMedia(site.hero.videoMobile)
                  : '',
              }
            : undefined
        }
      />
      <AboutSection
        imageAvailable={aboutImageAvailable}
        imageSrc={aboutImageSrc}
        title={site ? liveCopy(site.homeAbout.title, resolvedLocale) : undefined}
        body={site ? liveCopy(site.homeAbout.body, resolvedLocale) : undefined}
      />
      <StatisticsSection stats={liveStats} />
      <FeaturedCategories items={homeCategoryItems} />
      <HomePromoBanners banners={promoBanners} />
      <HomeGallerySection
        imageAvailability={galleryImageAvailability}
        views={selectedViews.map((item) => ({
          id: item.id,
          image: liveMedia(item.image),
        }))}
      />
      <FeaturedProducts
        imageAvailability={productImageAvailability}
        enquiryEmail={enquiryEmail}
        liveItems={liveFeaturedItems}
      />
      <FeaturedProjects rows={projectRows} />
      <HomeCollaboratorsSection
        logos={collaboratorLogos}
        liveItems={liveCollaborators === null ? undefined : homeLiveCollaborators}
      />
      <HomeContactSection
        locale={resolvedLocale}
        enquiryEmail={enquiryEmail}
        initialProduct={initialProduct}
      />
    </>
  );
}
