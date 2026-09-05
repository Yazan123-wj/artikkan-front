import { ENTRANCE_AUDIO } from '@/config/hero';

let audio: HTMLAudioElement | null = null;
let started = false;
let unlockBound = false;

function getAudio(): HTMLAudioElement | null {
  if (typeof window === 'undefined') {
    return null;
  }

  if (!audio) {
    audio = new Audio(ENTRANCE_AUDIO);
    audio.preload = 'auto';
    audio.loop = false;
    audio.volume = 0.8;
  }

  return audio;
}

function bindUnlock(instance: HTMLAudioElement): void {
  if (unlockBound) {
    return;
  }

  unlockBound = true;

  const unlock = () => {
    void instance.play().then(() => {
      started = true;
    });
    window.removeEventListener('pointerdown', unlock);
    window.removeEventListener('keydown', unlock);
    window.removeEventListener('touchstart', unlock);
  };

  window.addEventListener('pointerdown', unlock);
  window.addEventListener('keydown', unlock);
  window.addEventListener('touchstart', unlock, { passive: true });
}

export function preloadEntranceAudio(): void {
  getAudio();
}

export function playEntranceAudio(): void {
  if (started) {
    return;
  }

  const instance = getAudio();
  if (!instance) {
    return;
  }

  void instance.play().then(() => {
    started = true;
  }).catch(() => {
    bindUnlock(instance);
  });
}
