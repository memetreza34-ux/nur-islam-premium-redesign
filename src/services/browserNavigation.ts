const NAVIGATION_STATE_KEY = '__nurIslamNavigation';
const NAVIGATION_STATE_VERSION = 1;

export type BrowserNavigationEntry<T> = {
  depth: number;
  snapshot: T;
};

type StoredNavigationEntry<T> = BrowserNavigationEntry<T> & {
  version: typeof NAVIGATION_STATE_VERSION;
};

function isObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

export function readBrowserNavigation<T>(state: unknown = window.history.state): BrowserNavigationEntry<T> | null {
  if (!isObject(state)) return null;
  const candidate = state[NAVIGATION_STATE_KEY];
  if (!isObject(candidate)) return null;
  if (candidate.version !== NAVIGATION_STATE_VERSION) return null;
  if (!Number.isInteger(candidate.depth) || Number(candidate.depth) < 0) return null;
  if (!('snapshot' in candidate)) return null;
  return {
    depth: Number(candidate.depth),
    snapshot: candidate.snapshot as T,
  };
}

function withNavigationState<T>(snapshot: T, depth: number) {
  const current = isObject(window.history.state) ? window.history.state : {};
  const navigation: StoredNavigationEntry<T> = {
    version: NAVIGATION_STATE_VERSION,
    depth: Math.max(0, Math.floor(depth)),
    snapshot,
  };
  return {
    ...current,
    [NAVIGATION_STATE_KEY]: navigation,
  };
}

export function replaceBrowserNavigation<T>(snapshot: T, depth = 0) {
  const safeDepth = Math.max(0, Math.floor(depth));
  window.history.replaceState(withNavigationState(snapshot, safeDepth), '', window.location.href);
  return safeDepth;
}

export function pushBrowserNavigation<T>(snapshot: T) {
  const nextDepth = (readBrowserNavigation<T>()?.depth ?? 0) + 1;
  window.history.pushState(withNavigationState(snapshot, nextDepth), '', window.location.href);
  return nextDepth;
}

export function browserNavigationDepth() {
  return readBrowserNavigation<unknown>()?.depth ?? 0;
}
