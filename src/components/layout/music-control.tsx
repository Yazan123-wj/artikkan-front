'use client';

import { useSyncExternalStore } from 'react';
import { useTranslations } from 'next-intl';
import {
  isSiteMusicPlaying,
  playSiteMusic,
  stopSiteMusic,
  subscribeSiteMusic,
} from '@/lib/entrance-audio';

function getServerSnapshot(): boolean {
  return false;
}

export function MusicControl() {
  const t = useTranslations('a11y');
  const playing = useSyncExternalStore(
    subscribeSiteMusic,
    isSiteMusicPlaying,
    getServerSnapshot,
  );

  return (
    <button
      type="button"
      className="music-control"
      aria-pressed={playing}
      aria-label={playing ? t('stopMusic') : t('playMusic')}
      onClick={playing ? stopSiteMusic : playSiteMusic}
    >
      <span className="music-control-icons" aria-hidden="true" data-playing={playing}>
        <svg className="music-control-play" viewBox="0 0 24 24" fill="currentColor">
          <path d="M9 6.8v10.4L18.2 12 9 6.8Z" />
        </svg>
        <svg className="music-control-stop" viewBox="0 0 24 24" fill="currentColor">
          <rect x="7.4" y="7.4" width="9.2" height="9.2" />
        </svg>
      </span>
    </button>
  );
}
