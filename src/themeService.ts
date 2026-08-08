export type NurTheme = 'dark' | 'light' | 'system';

const THEME_STORAGE_KEY = 'nur_theme';
const LEGACY_KEY = 'premium_theme';
const SYSTEM_QUERY = '(prefers-color-scheme: light)';

function normalizeTheme(value: string | null): NurTheme | null {
  if (value === 'dark' || value === 'Dunkel') return 'dark';
  if (value === 'light' || value === 'Hell') return 'light';
  if (value === 'system' || value === 'System') return 'system';
  return null;
}

export function getTheme(): NurTheme {
  try {
    const current = normalizeTheme(localStorage.getItem(THEME_STORAGE_KEY));
    if (current) return current;
    const legacyRaw = localStorage.getItem(LEGACY_KEY);
    const legacy = normalizeTheme(legacyRaw ? JSON.parse(legacyRaw) as string : null);
    if (legacy) {
      localStorage.setItem(THEME_STORAGE_KEY, legacy);
      return legacy;
    }
  } catch {
    // Fall back to the premium dark theme.
  }
  return 'dark';
}

function resolvedTheme(theme: NurTheme) {
  if (theme !== 'system') return theme;
  return window.matchMedia(SYSTEM_QUERY).matches ? 'light' : 'dark';
}

export function applyTheme(theme: NurTheme) {
  const resolved = resolvedTheme(theme);
  document.documentElement.dataset.theme = resolved;
  document.documentElement.dataset.themePreference = theme;
  document.documentElement.style.colorScheme = resolved;
  const themeMeta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (themeMeta) themeMeta.content = resolved === 'light' ? '#f2eadc' : '#001b16';
}

export function setTheme(theme: NurTheme) {
  try { localStorage.setItem(THEME_STORAGE_KEY, theme); } catch { /* optional */ }
  applyTheme(theme);
  window.dispatchEvent(new CustomEvent<NurTheme>('nur:theme-changed', { detail: theme }));
}

function applyResolvedTheme() {
  applyTheme(getTheme());
}

export function initializeTheme() {
  applyResolvedTheme();
  const media = window.matchMedia(SYSTEM_QUERY);
  const handleSystemChange = () => {
    if (getTheme() === 'system') applyResolvedTheme();
  };
  // A cloud restore rewrites the stored preference behind the app's back, so
  // re-read it instead of leaving the previous theme on screen.
  const handleCloudRestore = () => applyResolvedTheme();
  // Another tab shares this storage; a null key means it was cleared entirely.
  const handleStorage = (event: StorageEvent) => {
    if (event.key === null || event.key === THEME_STORAGE_KEY) applyResolvedTheme();
  };

  media.addEventListener?.('change', handleSystemChange);
  window.addEventListener('nur:cloud-restored', handleCloudRestore);
  window.addEventListener('storage', handleStorage);

  return () => {
    media.removeEventListener?.('change', handleSystemChange);
    window.removeEventListener('nur:cloud-restored', handleCloudRestore);
    window.removeEventListener('storage', handleStorage);
  };
}
