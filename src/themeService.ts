export type NurTheme = 'dark' | 'light' | 'system';

const THEME_KEY = 'nur_theme';
const LEGACY_KEY = 'premium_theme';

function normalizeTheme(value: string | null): NurTheme | null {
  if (value === 'dark' || value === 'Dunkel') return 'dark';
  if (value === 'light' || value === 'Hell') return 'light';
  if (value === 'system' || value === 'System') return 'system';
  return null;
}

export function getTheme(): NurTheme {
  try {
    const current = normalizeTheme(localStorage.getItem(THEME_KEY));
    if (current) return current;
    const legacyRaw = localStorage.getItem(LEGACY_KEY);
    const legacy = normalizeTheme(legacyRaw ? JSON.parse(legacyRaw) as string : null);
    if (legacy) {
      localStorage.setItem(THEME_KEY, legacy);
      return legacy;
    }
  } catch {
    // Fall back to the premium dark theme.
  }
  return 'dark';
}

function resolvedTheme(theme: NurTheme) {
  if (theme !== 'system') return theme;
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

export function applyTheme(theme: NurTheme) {
  const resolved = resolvedTheme(theme);
  document.documentElement.dataset.theme = resolved;
  document.documentElement.dataset.themePreference = theme;
  document.documentElement.style.colorScheme = resolved;
  const themeMeta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (themeMeta) themeMeta.content = resolved === 'light' ? '#f2eadc' : '#071b15';
}

export function setTheme(theme: NurTheme) {
  try { localStorage.setItem(THEME_KEY, theme); } catch { /* optional */ }
  applyTheme(theme);
  window.dispatchEvent(new CustomEvent<NurTheme>('nur:theme-changed', { detail: theme }));
}

export function initializeTheme() {
  const applyCurrent = () => applyTheme(getTheme());
  applyCurrent();
  const media = window.matchMedia('(prefers-color-scheme: light)');
  const handleSystemChange = () => {
    if (getTheme() === 'system') applyCurrent();
  };
  media.addEventListener?.('change', handleSystemChange);
  return () => media.removeEventListener?.('change', handleSystemChange);
}
