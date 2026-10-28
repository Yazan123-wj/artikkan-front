import { getFeaturedProductById } from '@/config/products';
import { featuredProjects } from '@/config/projects';
import { getProductCardImage } from '@/config/product-card-images';
import { publicAssetExists } from '@/lib/assets';
import {
  liveAssetAvailable,
  liveMedia,
  liveName,
  toFeaturedProduct,
  type LiveProject,
} from '@/lib/live-catalog';
import { productPieceKey } from '@/lib/product-messages';
import type { FeaturedProjectRowData } from '@/components/sections/home/projects/featured-projects';
import type { FeaturedProduct } from '@/types/product';
import type { FeaturedProject, FeaturedProjectImage } from '@/types/project';

type Translate = (key: string) => string; // next-intl translators are compatible

const emptyPiece = {
  record: undefined,
  name: '',
  imageAlt: '',
  imageAvailable: false,
};

export function projectImageAvailable(src: string | null | undefined) {
  if (!src) return false;
  return liveAssetAvailable(src) || publicAssetExists(src);
}

function liveLeadImage(project: LiveProject): FeaturedProjectImage | undefined {
  if (!project.imageSrc) return undefined;
  return {
    src: liveMedia(project.imageSrc),
    width: 1536,
    height: 1024,
    objectPosition: 'center 52%',
  };
}

export function liveToFeaturedProject(project: LiveProject): FeaturedProject {
  return {
    id: project.id,
    slug: project.slug,
    placement: project.placement === 'end' ? 'end' : 'start',
    productIds: project.products.map((item) => item.product?.id ?? item.slug),
    image: liveLeadImage(project),
  };
}

function livePiece(
  project: LiveProject,
  index: 0 | 1,
  locale: string,
  pendingProduct: string,
  pendingPhoto: string,
) {
  const item = project.products[index];
  const record = item?.product ? toFeaturedProduct(item.product) : undefined;
  const name = record
    ? liveName(item.product?.name, locale) || item.name || pendingProduct
    : pendingProduct;
  return {
    record,
    name,
    imageAlt: name,
    imageAvailable: Boolean(
      record && projectImageAvailable(getProductCardImage(record).src),
    ),
  };
}

export function homeProjectRowsFromLive(
  projects: LiveProject[],
  locale: string,
  pendingProduct: string,
  pendingPhoto: string,
): FeaturedProjectRowData[] {
  return projects
    .filter((project) => project.featured && project.status !== 'draft')
    .map((project) => {
      const featured = liveToFeaturedProject(project);
      const name = liveName(project.title, locale);
      return {
        project: featured,
        name,
        subtitle: liveName(project.overview, locale) || liveName(project.type, locale),
        imageAlt: name,
        imageAvailable: projectImageAvailable(featured.image?.src),
        products: [
          livePiece(project, 0, locale, pendingProduct, pendingPhoto),
          livePiece(project, 1, locale, pendingProduct, pendingPhoto),
        ] as const,
      };
    });
}

export function homeProjectRowsFromStatic(
  tProjects: Translate,
  tProducts: Translate,
  productImageAvailability: Record<string, boolean>,
  projectImageAvailability: Record<string, boolean>,
  pendingProduct: string,
  pendingPhoto: string,
): FeaturedProjectRowData[] {
  return featuredProjects.map((project) => {
    const copyKey = project.copyKey ?? 'one';
    const pieces = [0, 1].map((index) => {
      const productId = project.productIds[index];
      const record = productId ? getFeaturedProductById(productId) : undefined;
      const nameKey = record?.nameKey;
      return {
        record,
        name: nameKey ? tProducts(productPieceKey(nameKey, 'name')) : pendingProduct,
        imageAlt: nameKey
          ? tProducts(productPieceKey(nameKey, 'alt'))
          : pendingPhoto,
        imageAvailable: Boolean(record && productImageAvailability[record.id]),
      };
    });
    return {
      project,
      name: tProjects(`entries.${copyKey}.name`),
      subtitle: tProjects(`entries.${copyKey}.subtitle`),
      imageAlt: tProjects(`entries.${copyKey}.alt`),
      imageAvailable: Boolean(
        project.image && projectImageAvailability[project.id],
      ),
      products: [pieces[0] ?? emptyPiece, pieces[1] ?? emptyPiece] as const,
    };
  });
}

export function liveProjectProducts(
  project: LiveProject,
  locale: string,
): { product: FeaturedProduct; name: string }[] {
  return project.products.slice(0, 2)
    .map((item) => {
      if (!item.product) return null;
      const product = toFeaturedProduct(item.product);
      return {
        product,
        name: liveName(item.product.name, locale) || item.name || product.slug,
      };
    })
    .filter((item): item is { product: FeaturedProduct; name: string } =>
      Boolean(item),
    );
}
