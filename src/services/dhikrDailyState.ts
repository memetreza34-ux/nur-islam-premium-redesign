import { DHIKR_ROUTINES } from '../data/dhikrData';

const targetByKey = new Map<string, number>(
  DHIKR_ROUTINES.flatMap((routine) => routine.items.map((item) => [`${routine.id}:${item.id}`, item.target] as const)),
);

export function readDhikrDailyState(date = new Date()) {
  const day = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  const fallback = { date: day, counts: {} as Record<string, number> };
  try {
    const parsed = JSON.parse(localStorage.getItem('nur_dhikr_daily_v2') || '{}') as { date?: unknown; counts?: unknown };
    if (parsed.date !== day || !parsed.counts || typeof parsed.counts !== 'object' || Array.isArray(parsed.counts)) return fallback;
    const counts = Object.fromEntries(Object.entries(parsed.counts as Record<string, unknown>)
      .filter(([key, value]) => targetByKey.has(key) && typeof value === 'number' && Number.isFinite(value) && value >= 0)
      .map(([key, value]) => [key, Math.min(targetByKey.get(key) ?? 0, Math.floor(value as number))]));
    return { date: day, counts };
  } catch {
    return fallback;
  }
}

export function readDhikrTotalToday(date = new Date()) {
  return Object.values(readDhikrDailyState(date).counts).reduce((sum, value) => sum + value, 0);
}
