import { getLocale, getTranslations } from 'next-intl/server';
import { EditorialLink } from '@/components/shared/editorial-link';
import { InteriorReveal } from '@/components/shared/interior-reveal';
import { CatalogProductCard } from '@/components/catalog/catalog-product-card';
import { ProductDetailEnquire } from '@/components/catalog/product-detail-enquire';
import { ProductGallery } from '@/components/catalog/product-gallery';
import { productDetails } from '@/config/product-details';
import { getProductCardImage } from '@/config/product-card-images';
import { getEnquiryEmail } from '@/config/site';
import { publicAssetExists } from '@/lib/assets';
import { getProductImages, getRelatedProducts } from '@/lib/catalog';
import { productPieceKey } from '@/lib/product-messages';
import type { FeaturedProduct } from '@/types/product';

type ProductDetailContentProps = {
  product: FeaturedProduct;
};

export async function ProductDetailContent({
  product,
}: ProductDetailContentProps) {
  const locale = await getLocale();
  const t = await getTranslations('productsPage');
  const tProducts = await getTranslations('home.products');
  const tCategories = await getTranslations('home.categories');
  const enquiryEmail = getEnquiryEmail();
  const name = tProducts(productPieceKey(product.nameKey, 'name'));
  const category = tCategories(product.categoryKey);
  const imageAlt = tProducts(productPieceKey(product.nameKey, 'alt'));
  const details = productDetails[product.id];
  const description =
    details?.description[locale as 'en' | 'ar'] ??
    details?.description.en ??
    '';
  const materials =
    details?.materials[locale as 'en' | 'ar'] ??
    details?.materials.en ??
    '';
  const dimensions =
    details?.dimensions[locale as 'en' | 'ar'] ??
    details?.dimensions.en ??
    '';
  const finishes =
    details?.finishes[locale as 'en' | 'ar'] ??
    details?.finishes.en ??
    '';
  const related = getRelatedProducts(product);

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
              {related.map((item) => (
                <CatalogProductCard
                  key={item.id}
                  product={item}
                  name={tProducts(productPieceKey(item.nameKey, 'name'))}
                  category={tCategories(item.categoryKey)}
                  imageAlt={tProducts(productPieceKey(item.nameKey, 'alt'))}
                  viewDetailsLabel={t('viewDetails')}
                  imageAvailable={publicAssetExists(getProductCardImage(item).src)}
                />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </article>
  );
}
