'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';

type ContactMapProps = {
  embedSrc: string;
  directionsUrl: string;
  title: string;
  address?: string | null;
};

export function ContactMap({
  embedSrc,
  directionsUrl,
  title,
  address,
}: ContactMapProps) {
  const t = useTranslations('home.contact');
  const rootRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!active) {
      return;
    }

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (target instanceof Node && rootRef.current?.contains(target)) {
        return;
      }
      setActive(false);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActive(false);
      }
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [active]);

  return (
    <div ref={rootRef} className="home-contact-map" data-contact-reveal>
      <div
        className={
          active
            ? 'home-contact-map-frame-wrap is-active'
            : 'home-contact-map-frame-wrap'
        }
      >
        <iframe
          className="home-contact-map-frame"
          src={embedSrc}
          title={title}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
        {active ? null : (
          <button
            type="button"
            className="home-contact-map-enable"
            onClick={() => setActive(true)}
          >
            <span className="home-contact-map-enable-label type-label">
              {t('mapEnable')}
            </span>
          </button>
        )}
      </div>
      <div className="home-contact-map-caption">
        {address ? <p>{address}</p> : null}
        <a href={directionsUrl} rel="noopener noreferrer" target="_blank">
          {t('directions')}
        </a>
      </div>
    </div>
  );
}
