import type { FeaturedProduct } from '@/types/product';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? '';
const API_ORIGIN =
  process.env.NEXT_PUBLIC_API_ORIGIN ?? 'http://localhost:4000';

export type LiveProduct = {
  id: string;
  slug: string;
  name: { en?: string | null; ar?: string | null };
  category: string;
  subcategory: string | null;
  reference: string | null;
  image: { src: string; width: number; height: number };
  images?: { id?: string; src: string; width: number; height: number }[];
  description: { en?: string | null; ar?: string | null } | null;
  materials: { en?: string | null; ar?: string | null } | null;
  dimensions: { en?: string | null; ar?: string | null } | null;
  finishes: { en?: string | null; ar?: string | null } | null;
  published: boolean;
  featured: boolean;
};

export type LiveCategory = {
  slug: string;
  name: { en?: string | null; ar?: string | null };
  lede: { en?: string | null; ar?: string | null } | null;
  imageSrc: string | null;
  subcategories: { slug: string; name: { en?: string | null; ar?: string | null } }[];
};

export function liveMedia(src: string) {
  if (src.startsWith('/uploads/')) return `${API_ORIGIN}${src}`;
  return src;
}

export function liveName(
  value: { en?: string | null; ar?: string | null } | null | undefined,
  locale: string,
) {
  if (!value) return '';
  return (locale === 'ar' ? value.ar : value.en) || value.en || value.ar || '';
}

export function toFeaturedProduct(product: LiveProduct): FeaturedProduct {
  return {
    id: product.id,
    slug: product.slug,
    nameKey: product.slug,
    categoryKey: product.category as FeaturedProduct['categoryKey'],
    subKey: (product.subcategory as FeaturedProduct['subKey']) || undefined,
    reference: product.reference ?? undefined,
    image: {
      src: liveMedia(product.image.src),
      width: product.image.width,
      height: product.image.height,
      fit: 'contain',
      objectPosition: 'center center',
    },
    images: (product.images ?? []).map((image) => ({
      src: liveMedia(image.src),
      width: image.width,
      height: image.height,
      fit: 'contain' as const,
      objectPosition: 'center center',
    })),
  };
}

export async function fetchLiveProducts(): Promise<LiveProduct[] | null> {
  if (!API_URL) return null;
  try {
    const response = await fetch(`${API_URL}/catalog/products`, {
      next: { revalidate: 30 },
    });
    if (!response.ok) return null;
    const data = (await response.json()) as { products?: LiveProduct[] };
    return data.products ?? [];
  } catch {
    return null;
  }
}

export async function fetchLiveProduct(slug: string): Promise<LiveProduct | null> {
  if (!API_URL) return null;
  try {
    const response = await fetch(`${API_URL}/catalog/products/${slug}`, {
      next: { revalidate: 30 },
    });
    if (!response.ok) return null;
    const data = (await response.json()) as { product?: LiveProduct };
    return data.product ?? null;
  } catch {
    return null;
  }
}

export async function fetchLiveCategories(): Promise<LiveCategory[] | null> {
  if (!API_URL) return null;
  try {
    const response = await fetch(`${API_URL}/catalog/categories`, {
      next: { revalidate: 30 },
    });
    if (!response.ok) return null;
    const data = (await response.json()) as { categories?: LiveCategory[] };
    return data.categories ?? [];
  } catch {
    return null;
  }
}

export type LiveProjectPiece = {
  slug: string;
  name: string | null;
  product: LiveProduct | null;
};

export type LiveProject = {
  id: string;
  slug: string;
  title: { en?: string | null; ar?: string | null };
  overview: { en?: string | null; ar?: string | null };
  location: { en?: string | null; ar?: string | null };
  year: string;
  type: { en?: string | null; ar?: string | null };
  status: string;
  featured: boolean;
  placement: 'start' | 'end';
  imageSrc: string | null;
  products: LiveProjectPiece[];
};

export function liveAssetAvailable(src: string | null | undefined) {
  if (!src) return false;
  return (
    src.startsWith('/uploads/') ||
    src.startsWith('http://') ||
    src.startsWith('https://')
  );
}

export async function fetchLiveProjects(): Promise<LiveProject[] | null> {
  if (!API_URL) return null;
  try {
    const response = await fetch(`${API_URL}/catalog/projects`, {
      next: { revalidate: 30 },
    });
    if (!response.ok) return null;
    const data = (await response.json()) as { projects?: LiveProject[] };
    return data.projects ?? [];
  } catch {
    return null;
  }
}

export async function fetchLiveProject(slug: string): Promise<LiveProject | null> {
  if (!API_URL) return null;
  try {
    const response = await fetch(`${API_URL}/catalog/projects/${slug}`, {
      next: { revalidate: 30 },
    });
    if (!response.ok) return null;
    const data = (await response.json()) as { project?: LiveProject };
    return data.project ?? null;
  } catch {
    return null;
  }
}
