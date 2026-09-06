import type { FeaturedProduct, FeaturedProductImage } from '@/types/product';

/**
 * Higher-res studio stills for every product card.
 * Matching SKUs use their own photo; everything else cycles this set.
 */
export const PRODUCT_CARD_STILL_IDS = [
  'artk-sof-01',
  'artk-sof-02',
  'artk-sof-03',
  'artk-sof-04',
  'artk-sof-05',
  'artk-ch-01-wp',
  'artk-ch-01-wv',
  'artk-ch-02',
  'artk-ch-03',
  'artk-ch-04-wv',
  'artk-ben-01',
  'artk-ben-02',
  'artk-ben-03',
  'artk-ben-04',
  'artk-ben-05',
] as const;

const CARD_IMAGE: FeaturedProductImage = {
  src: '',
  width: 822,
  height: 1024,
  fit: 'contain',
  objectPosition: 'center center',
};

function idHash(value: string): number {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) | 0;
  }
  return Math.abs(hash);
}

export function getApprovedStillId(productId: string): string {
  if (
    PRODUCT_CARD_STILL_IDS.includes(
      productId as (typeof PRODUCT_CARD_STILL_IDS)[number],
    )
  ) {
    return productId;
  }

  return PRODUCT_CARD_STILL_IDS[idHash(productId) % PRODUCT_CARD_STILL_IDS.length];
}

export function getProductCardImage(
  product: FeaturedProduct,
): FeaturedProductImage {
  const id = getApprovedStillId(product.id);

  return {
    ...CARD_IMAGE,
    src: `/images/catalog/products/${id}.jpg`,
  };
}

export function withApprovedProductImage(
  product: FeaturedProduct,
): FeaturedProduct {
  return {
    ...product,
    image: getProductCardImage(product),
    images: undefined,
    hoverImage: undefined,
  };
}
