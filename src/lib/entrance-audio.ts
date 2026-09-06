import { ENTRANCE_AUDIO } from '@/config/hero';

let audio: HTMLAudioElement | null = null;
let userStopped = false;
const listeners = new Set<() => void>();

function emit(): void {
  listeners.forEach((listener) => listener());
}

function bindEvents(instance: HTMLAudioElement): void {
  instance.addEventListener('play', emit);
  instance.addEventListener('pause', emit);
  instance.addEventListener('ended', emit);
}

function getAudio(): HTMLAudioElement | null {
  if (typeof window === 'undefined') {
    return null;
  }

  if (!audio) {
    audio = new Audio(ENTRANCE_AUDIO);
    audio.preload = 'auto';
    audio.loop = true;
    audio.volume = 0.8;
    bindEvents(audio);
  }

  return audio;
}

function startPlayback(instance: HTMLAudioElement): void {
  void instance.play().then(emit).catch(() => {
    emit();
  });
}

export function subscribeSiteMusic(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function isSiteMusicPlaying(): boolean {
  return Boolean(audio && !audio.paused && !audio.ended);
}

export function preloadEntranceAudio(): void {
  getAudio();
}

export function playSiteMusic(): void {
  userStopped = false;
  const instance = getAudio();
  if (!instance) {
    return;
  }

  startPlayback(instance);
}

export function stopSiteMusic(): void {
  userStopped = true;
  const instance = getAudio();
  if (!instance) {
    emit();
    return;
  }

  instance.pause();
  instance.currentTime = 0;
  emit();
}

export function playEntranceAudio(): void {
  if (userStopped) {
    return;
  }

  playSiteMusic();
}
