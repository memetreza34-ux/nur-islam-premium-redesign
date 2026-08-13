export type PendingNavigationIntent = 'prayer' | 'calendar';

const STORAGE_KEY = 'nur_pending_navigation_v1';

export function queuePendingNavigation(intent: PendingNavigationIntent) {
  try {
    sessionStorage.setItem(STORAGE_KEY, intent);
  } catch {
    // The live event still works when session storage is unavailable.
  }
}

export function consumePendingNavigation(): PendingNavigationIntent | null {
  try {
    const value = sessionStorage.getItem(STORAGE_KEY);
    sessionStorage.removeItem(STORAGE_KEY);
    return value === 'prayer' || value === 'calendar' ? value : null;
  } catch {
    return null;
  }
}
