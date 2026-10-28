import { getLocale, getTranslations } from 'next-intl/server';
import { EditorialLink } from '@/components/shared/editorial-link';
import { InteriorReveal } from '@/components/shared/interior-reveal';
import { CatalogProductCard } from '@/components/catalog/catalog-product-card';
import { ProductDetailEnquire } from '@/components/catalog/product-detail-enquire';
import { ProductGallery } from '@/components/catalog/product-gallery';
import { productDetails } from '@/config/product-details';
import { getProductCardImage } from '@/config/product-card-images';
import { featuredCategories } from '@/config/home-content';
import { getEnquiryEmail } from '@/config/site';
import { publicAssetExists } from '@/lib/assets';
import { getProductImages, getRelatedProducts } from '@/lib/catalog';
import {
  fetchLiveCategories,
  fetchLiveProduct,
  fetchLiveProducts,
  liveName,
  toFeaturedProduct,
} from '@/lib/live-catalog';
import { productPieceKey } from '@/lib/product-messages';
import type { FeaturedProduct } from '@/types/product';

type ProductDetailContentProps = {
  product: FeaturedProduct;
};

function isRemoteSrc(src: string) {
  return (
    src.startsWith('http://') ||
    src.startsWith('https://') ||
    src.startsWith('/uploads/')
  );
}

export async function ProductDetailContent({
  product,
}: ProductDetailContentProps) {
  const locale = await getLocale();
  const t = await getTranslations('productsPage');
  const tProducts = await getTranslations('home.products');
  const tCategories = await getTranslations('home.categories');
  const enquiryEmail = getEnquiryEmail();
  const live = await fetchLiveProduct(product.slug);
  const liveCategories = await fetchLiveCategories();
  const liveProducts = await fetchLiveProducts();
  const name = live
    ? liveName(live.name, locale)
    : tProducts(productPieceKey(product.nameKey, 'name'));
  const liveCategory = liveCategories?.find(
    (item) => item.slug === product.categoryKey,
  );
  const knownCategory = featuredCategories.some(
    (item) => item.id === product.categoryKey,
  );
  const category = liveCategory
    ? liveName(liveCategory.name, locale)
    : knownCategory
      ? tCategories(product.categoryKey)
      : product.categoryKey;
  const imageAlt = name;
  const details = productDetails[product.id];
  const description =
    (live ? liveName(live.description, locale) : '') ||
    details?.description[locale as 'en' | 'ar'] ||
    details?.description.en ||
    '';
  const materials =
    (live ? liveName(live.materials, locale) : '') ||
    details?.materials[locale as 'en' | 'ar'] ||
    details?.materials.en ||
    '';
  const dimensions =
    (live ? liveName(live.dimensions, locale) : '') ||
    details?.dimensions[locale as 'en' | 'ar'] ||
    details?.dimensions.en ||
    '';
  const finishes =
    (live ? liveName(live.finishes, locale) : '') ||
    details?.finishes[locale as 'en' | 'ar'] ||
    details?.finishes.en ||
    '';
  const related =
    liveProducts && liveProducts.length > 0
      ? liveProducts
          .filter(
            (item) =>
              item.slug !== product.slug && item.category === product.categoryKey,
          )
          .slice(0, 3)
          .map(toFeaturedProduct)
      : getRelatedProducts(product);

  return (
    <article className="product-detail-page">
      <div className="site-container">
        <EditorialLink href="/products" className="product-detail-back" back>
          {t('backToProducts')}
        </EditorialLink>

        <div className="product-detail-layout">
          <ProductGallery
            images={getProductImages(product)}
            alt={imageAlt}
            galleryLabel={t('galleryLabel')}
          />

          <InteriorReveal>
            <div className="product-detail-panel" data-interior-reveal>
              <p className="product-detail-category">{category}</p>
              <h1 className="product-detail-title type-h1">{name}</h1>
              {description ? (
                <p className="product-detail-body type-body">{description}</p>
              ) : null}

              <section aria-label={t('specsTitle')}>
                <dl className="product-detail-specs">
                  <div className="product-detail-spec">
                    <dt>{t('materials')}</dt>
                    <dd>{materials}</dd>
                  </div>
                  <div className="product-detail-spec">
                    <dt>{t('dimensions')}</dt>
                    <dd>{dimensions}</dd>
                  </div>
                  <div className="product-detail-spec">
                    <dt>{t('finishes')}</dt>
                    <dd>{finishes}</dd>
                  </div>
                </dl>
              </section>

              <ProductDetailEnquire
                name={name}
                category={category}
                slug={product.slug}
                reference={product.reference}
                imageSrc={product.image.src}
                imageAlt={imageAlt}
                enquireLabel={t('enquire')}
                enquiryEmail={enquiryEmail}
              />
            </div>
          </InteriorReveal>
        </div>

        {related.length > 0 ? (
          <section
            className="product-related"
            aria-labelledby="product-related-heading"
          >
            <h2 id="product-related-heading" className="type-h2">
              {t('relatedTitle')}
            </h2>
            <div className="catalog-grid">
              {related.map((item) => {
                const relatedLive = liveProducts?.find(
                  (entry) => entry.slug === item.slug,
                );
                const relatedName = relatedLive
                  ? liveName(relatedLive.name, locale)
                  : tProducts(productPieceKey(item.nameKey, 'name'));
                const relatedCat = liveCategories?.find(
                  (entry) => entry.slug === item.categoryKey,
                );
                const relatedCategory = relatedCat
                  ? liveName(relatedCat.name, locale)
                  : featuredCategories.some((entry) => entry.id === item.categoryKey)
                    ? tCategories(item.categoryKey)
                    : item.categoryKey;
                const cardSrc = getProductCardImage(item).src;
                return (
                  <CatalogProductCard
                    key={item.id}
                    product={item}
                    name={relatedName}
                    category={relatedCategory}
                    imageAlt={relatedName}
                    viewDetailsLabel={t('viewDetails')}
                    imageAvailable={
                      isRemoteSrc(cardSrc) || publicAssetExists(cardSrc)
                    }
                  />
                );
              })}
            </div>
          </section>
        ) : null}
      </div>
    </article>
  );
}
