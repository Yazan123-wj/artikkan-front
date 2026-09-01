type SequenceSegment = {
  inStart: number;
  inEnd: number;
  outStart: number;
  outEnd: number;
};

/**
 * Non-linear mapping for the post-dock sequence.
 * Product close-ups occupy more scroll; room travel covers more frames faster.
 */
const SEQUENCE_SEGMENTS: readonly SequenceSegment[] = [
  { inStart: 0, inEnd: 0.18, outStart: 0, outEnd: 0.075 },
  { inStart: 0.18, inEnd: 0.255, outStart: 0.075, outEnd: 0.275 },
  { inStart: 0.255, inEnd: 0.435, outStart: 0.275, outEnd: 0.355 },
  { inStart: 0.435, inEnd: 0.51, outStart: 0.355, outEnd: 0.555 },
  { inStart: 0.51, inEnd: 0.69, outStart: 0.555, outEnd: 0.635 },
  { inStart: 0.69, inEnd: 0.765, outStart: 0.635, outEnd: 0.835 },
  { inStart: 0.765, inEnd: 1, outStart: 0.835, outEnd: 1 },
];

function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

export function clamp01(value: number): number {
  if (value <= 0) {
    return 0;
  }
  if (value >= 1) {
    return 1;
  }
  return value;
}

export function mapHeroScrollToSequence(progress: number): number {
  const t = clamp01(progress);

  for (const segment of SEQUENCE_SEGMENTS) {
    if (t <= segment.inEnd || segment.inEnd === 1) {
      const span = segment.inEnd - segment.inStart || 1;
      const local = clamp01((t - segment.inStart) / span);
      return lerp(segment.outStart, segment.outEnd, local);
    }
  }

  return 1;
}

/** 1-based frame index from post-dock sequence progress (0–1). */
export function frameIndexFromProgress(
  progress: number,
  frameCount: number,
): number {
  const count = Math.max(1, frameCount);
  const mapped = mapHeroScrollToSequence(progress);
  return Math.round(1 + mapped * (count - 1));
}
