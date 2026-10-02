const THEME_STORAGE_KEY = 'nur_theme';
const LEGACY_KEY = 'premium_theme';

function applyFixedTheme() {
  document.documentElement.dataset.theme = 'dark';
  document.documentElement.dataset.themePreference = 'dark';
  document.documentElement.style.colorScheme = 'dark';
  const themeMeta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (themeMeta) themeMeta.content = '#001b16';
  try {
    localStorage.removeItem(THEME_STORAGE_KEY);
    localStorage.removeItem(LEGACY_KEY);
  } catch {
    // The fixed palette also works when browser storage is unavailable.
  }
}

export function initializeTheme() {
  applyFixedTheme();
  const handleCloudRestore = () => applyFixedTheme();
  const handleStorage = (event: StorageEvent) => {
    if (event.key === null || event.key === THEME_STORAGE_KEY || event.key === LEGACY_KEY) applyFixedTheme();
  };

  window.addEventListener('nur:cloud-restored', handleCloudRestore);
  window.addEventListener('storage', handleStorage);

  return () => {
    window.removeEventListener('nur:cloud-restored', handleCloudRestore);
    window.removeEventListener('storage', handleStorage);
  };
}
