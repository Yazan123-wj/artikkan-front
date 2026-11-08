import Image from 'next/image';
import { LocalizedLink } from '@/components/shared/localized-link';
import { liveAssetAvailable, liveMedia } from '@/lib/live-catalog';
import { publicAssetExists } from '@/lib/assets';

type PromoBanner = {
  id: string;
  image: string;
  title: string;
  href: string;
};

export function HomePromoBanners({ banners }: { banners: PromoBanner[] }) {
  const visible = banners.filter((banner) => banner.image && banner.title);
  if (visible.length === 0) return null;

  return (
    <section className="home-promo-section" aria-label="Promotions">
      <div className="site-container home-promo-list">
        {visible.map((banner) => {
          const src = liveMedia(banner.image);
          const available = liveAssetAvailable(banner.image) || publicAssetExists(banner.image);
          const href = banner.href || '/products';
          const inner = (
            <>
              {available ? (
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="100vw"
                  className="home-promo-image"
                />
              ) : (
                <span className="home-promo-pending" />
              )}
              <span className="home-promo-title type-h3">{banner.title}</span>
            </>
          );
          return href.startsWith('/') ? (
            <LocalizedLink key={banner.id} href={href} className="home-promo-card">
              {inner}
            </LocalizedLink>
          ) : (
            <a key={banner.id} href={href} className="home-promo-card">
              {inner}
            </a>
          );
        })}
      </div>
    </section>
  );
}
