const SCROLL_KEY = 'artikkan:scroll';

type SavedScroll = {
  path: string;
  y: number;
};

export function isReloadNavigation() {
  try {
    const entry = performance.getEntriesByType(
      'navigation',
    )[0] as PerformanceNavigationTiming | undefined;
    return entry?.type === 'reload' || entry?.type === 'back_forward';
  } catch {
    return false;
  }
}

export function persistScrollPosition() {
  try {
    const payload: SavedScroll = {
      path: window.location.pathname,
      y: Math.max(0, Math.round(window.scrollY)),
    };
    sessionStorage.setItem(SCROLL_KEY, JSON.stringify(payload));
  } catch {
    // private mode
  }
}

export function readSavedScrollPosition() {
  try {
    const raw = sessionStorage.getItem(SCROLL_KEY);
    if (!raw) return null;
    const saved = JSON.parse(raw) as SavedScroll;
    if (saved.path !== window.location.pathname) return null;
    if (!Number.isFinite(saved.y) || saved.y < 1) return null;
    return saved.y;
  } catch {
    return null;
  }
}
