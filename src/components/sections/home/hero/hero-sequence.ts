import {
  getHeroSequenceVariant,
  HERO_SEQUENCE,
  heroFrameUrl,
  type HeroSequenceVariant,
} from '@/config/hero';

export type HeroFrame = ImageBitmap | HTMLImageElement;

type SequenceBucket = {
  frames: Array<HeroFrame | undefined>;
  inflight: Array<Promise<HeroFrame> | undefined>;
  restStarted: boolean;
  detectedCount: number;
  detectPromise: Promise<number> | null;
};

const buckets: Record<HeroSequenceVariant, SequenceBucket> = {
  desktop: {
    frames: [],
    inflight: [],
    restStarted: false,
    detectedCount: 0,
    detectPromise: null,
  },
  mobile: {
    frames: [],
    inflight: [],
    restStarted: false,
    detectedCount: 0,
    detectPromise: null,
  },
};

const MAX_PIXEL_RATIO = 1.5;
const MAX_PROBE = 512;

function bucketFor(variant: HeroSequenceVariant): SequenceBucket {
  return buckets[variant];
}

async function frameExists(variant: HeroSequenceVariant, index: number): Promise<boolean> {
  const url = heroFrameUrl(variant, index);

  try {
    const response = await fetch(url, { method: 'HEAD', cache: 'force-cache' });
    if (response.ok) {
      return true;
    }
    if (response.status !== 405 && response.status !== 501) {
      return false;
    }
  } catch {
    // Fall through to a cheap image probe.
  }

  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => resolve(true);
    image.onerror = () => resolve(false);
    image.src = url;
  });
}

export async function detectHeroFrameCount(
  variant: HeroSequenceVariant,
): Promise<number> {
  const bucket = bucketFor(variant);
  if (bucket.detectedCount > 0) {
    return bucket.detectedCount;
  }
  if (bucket.detectPromise) {
    return bucket.detectPromise;
  }

  const expected = HERO_SEQUENCE[variant].expectedFrameCount;

  bucket.detectPromise = (async () => {
    if (!(await frameExists(variant, 1))) {
      bucket.detectedCount = 0;
      return 0;
    }

    let low = 1;
    let high = Math.min(MAX_PROBE, expected + 48);

    if (await frameExists(variant, expected)) {
      low = expected;
      while (low < high && (await frameExists(variant, low + 1))) {
        low += 1;
      }
      bucket.detectedCount = low;
      return low;
    }

    high = expected;
    while (low < high) {
      const mid = Math.ceil((low + high + 1) / 2);
      if (await frameExists(variant, mid)) {
        low = mid;
      } else {
        high = mid - 1;
      }
    }

    bucket.detectedCount = low;
    return low;
  })();

  try {
    return await bucket.detectPromise;
  } finally {
    bucket.detectPromise = null;
  }
}

export function getHeroFrameCount(
  variant: HeroSequenceVariant,
): number {
  const detected = bucketFor(variant).detectedCount;
  if (detected > 0) {
    return detected;
  }
  return HERO_SEQUENCE[variant].expectedFrameCount;
}

async function decodeFrame(src: string): Promise<HeroFrame> {
  const image = new Image();
  image.decoding = 'async';
  image.src = src;

  if (typeof image.decode === 'function') {
    await image.decode();
  } else {
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error(`Failed to load ${src}`));
    });
  }

  if (typeof createImageBitmap === 'function') {
    try {
      return await createImageBitmap(image);
    } catch {
      return image;
    }
  }

  return image;
}

export function loadHeroFrame(
  variant: HeroSequenceVariant,
  index: number,
): Promise<HeroFrame> {
  const bucket = bucketFor(variant);
  const cached = bucket.frames[index];
  if (cached) {
    return Promise.resolve(cached);
  }

  const pending = bucket.inflight[index];
  if (pending) {
    return pending;
  }

  const request = decodeFrame(heroFrameUrl(variant, index))
    .then((frame) => {
      bucket.frames[index] = frame;
      bucket.inflight[index] = undefined;
      return frame;
    })
    .catch((error: unknown) => {
      bucket.inflight[index] = undefined;
      throw error;
    });

  bucket.inflight[index] = request;
  return request;
}

export async function preloadHeroSequenceStart(isMobile: boolean): Promise<void> {
  const variant = getHeroSequenceVariant(isMobile);
  const detected = await detectHeroFrameCount(variant);
  const preload = Math.min(
    HERO_SEQUENCE[variant].initialPreload,
    Math.max(1, detected),
  );

  await loadHeroFrame(variant, 1);

  const extras: Promise<HeroFrame>[] = [];
  for (let index = 2; index <= preload; index += 1) {
    extras.push(loadHeroFrame(variant, index));
  }

  await Promise.allSettled(extras);
}

function isOccupied(bucket: SequenceBucket, index: number): boolean {
  return Boolean(bucket.frames[index] || bucket.inflight[index]);
}

function pickPriorityIndex(
  bucket: SequenceBucket,
  target: number,
  frameCount: number,
): number | null {
  const playhead = Math.min(frameCount, Math.max(1, Math.round(target)));

  for (let distance = 0; distance <= 32; distance += 1) {
    const ahead = playhead + distance;
    if (ahead >= 1 && ahead <= frameCount && !isOccupied(bucket, ahead)) {
      return ahead;
    }
    const behind = playhead - distance;
    if (behind >= 1 && behind <= frameCount && !isOccupied(bucket, behind)) {
      return behind;
    }
  }

  for (let index = 1; index <= frameCount; index += 1) {
    if (!isOccupied(bucket, index)) {
      return index;
    }
  }

  return null;
}

export function startHeroSequenceBackground(
  isMobile: boolean,
  getTargetFrame: () => number,
  onFrame?: (index: number) => void,
): () => void {
  const variant = getHeroSequenceVariant(isMobile);
  const bucket = bucketFor(variant);

  if (bucket.restStarted) {
    return () => undefined;
  }

  bucket.restStarted = true;
  let cancelled = false;
  const concurrency = isMobile ? 3 : 4;
  const batchSize = isMobile ? 8 : 12;

  const worker = async () => {
    let loadedInBatch = 0;

    while (!cancelled) {
      const frameCount = getHeroFrameCount(variant);
      if (frameCount <= 0) {
        const detected = await detectHeroFrameCount(variant).catch(() => 0);
        if (detected <= 0 || cancelled) {
          return;
        }
        continue;
      }

      const index = pickPriorityIndex(
        bucket,
        getTargetFrame(),
        frameCount,
      );

      if (index == null) {
        return;
      }

      try {
        await loadHeroFrame(variant, index);
        if (!cancelled) {
          onFrame?.(index);
        }
      } catch {
        // Skip a missing frame and keep filling the buffer.
      }

      loadedInBatch += 1;
      if (loadedInBatch >= batchSize) {
        loadedInBatch = 0;
        await new Promise<void>((resolve) => {
          window.setTimeout(resolve, 0);
        });
      }
    }
  };

  void detectHeroFrameCount(variant).then(() => {
    if (!cancelled) {
      void Promise.all(Array.from({ length: concurrency }, () => worker()));
    }
  });

  return () => {
    cancelled = true;
    bucket.restStarted = false;
  };
}

export function getLoadedHeroFrame(
  variant: HeroSequenceVariant,
  index: number,
): { frame: HeroFrame; index: number } | undefined {
  const { frames } = bucketFor(variant);
  const exact = frames[index];
  if (exact) {
    return { frame: exact, index };
  }

  for (let cursor = index - 1; cursor >= 1; cursor -= 1) {
    const previous = frames[cursor];
    if (previous) {
      return { frame: previous, index: cursor };
    }
  }

  const frameCount = getHeroFrameCount(variant);
  for (let cursor = index + 1; cursor <= frameCount; cursor += 1) {
    const next = frames[cursor];
    if (next) {
      return { frame: next, index: cursor };
    }
  }

  const first = frames[1];
  if (first) {
    return { frame: first, index: 1 };
  }

  return undefined;
}

export function canvasIsSupported(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('2d'));
  } catch {
    return false;
  }
}

export type CanvasView = {
  cssWidth: number;
  cssHeight: number;
  dpr: number;
  changed: boolean;
};

export function resizeHeroCanvas(canvas: HTMLCanvasElement): CanvasView {
  const dpr = Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO);
  const cssWidth = Math.max(1, canvas.clientWidth);
  const cssHeight = Math.max(1, canvas.clientHeight);
  const pixelWidth = Math.max(1, Math.round(cssWidth * dpr));
  const pixelHeight = Math.max(1, Math.round(cssHeight * dpr));
  const changed = canvas.width !== pixelWidth || canvas.height !== pixelHeight;

  if (changed) {
    canvas.width = pixelWidth;
    canvas.height = pixelHeight;
  }

  return { cssWidth, cssHeight, dpr, changed };
}

function frameSize(frame: HeroFrame): { width: number; height: number } {
  if (frame instanceof HTMLImageElement) {
    return {
      width: frame.naturalWidth || frame.width,
      height: frame.naturalHeight || frame.height,
    };
  }

  return { width: frame.width, height: frame.height };
}

export function drawHeroFrame(
  ctx: CanvasRenderingContext2D,
  frame: HeroFrame,
  view: CanvasView,
): void {
  const { width: imageWidth, height: imageHeight } = frameSize(frame);
  if (!imageWidth || !imageHeight) {
    return;
  }

  ctx.setTransform(view.dpr, 0, 0, view.dpr, 0, 0);

  const scale = Math.max(
    view.cssWidth / imageWidth,
    view.cssHeight / imageHeight,
  );
  const drawWidth = imageWidth * scale;
  const drawHeight = imageHeight * scale;
  const dx = (view.cssWidth - drawWidth) / 2;
  const dy = (view.cssHeight - drawHeight) / 2;

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'medium';
  ctx.drawImage(frame, dx, dy, drawWidth, drawHeight);
}
