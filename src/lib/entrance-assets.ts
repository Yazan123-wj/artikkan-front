export function waitForTimeout(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

export function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T | void> {
  return Promise.race([promise, waitForTimeout(ms)]);
}

export function decodeImage(src: string): Promise<void> {
  return new Promise((resolve) => {
    const image = new Image();
    const finish = () => resolve();

    image.onload = () => {
      if (typeof image.decode === 'function') {
        image.decode().then(finish).catch(finish);
        return;
      }
      finish();
    };
    image.onerror = finish;
    image.src = src;
  });
}

export function waitForVideoMetadata(src: string): Promise<void> {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.muted = true;
    video.playsInline = true;

    const finish = () => {
      video.removeAttribute('src');
      video.load();
      resolve();
    };

    video.addEventListener('loadedmetadata', finish, { once: true });
    video.addEventListener('error', finish, { once: true });
    video.src = src;
  });
}

export async function waitForFonts(): Promise<void> {
  if (!document.fonts) {
    return;
  }

  await document.fonts.ready;
}
