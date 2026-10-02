import { act, createElement } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { usePrayerTimes } from './usePrayerTimes';
import * as service from '../services/prayerTimesService';
import type { PrayerTimesSnapshot } from '../services/prayerTimesService';

vi.mock('../services/prayerTimesService', async importOriginal => {
  const actual = await importOriginal<typeof import('../services/prayerTimesService')>();
  return {
    ...actual,
    fetchPrayerTimes: vi.fn(),
    loadCachedPrayerTimes: vi.fn(() => null),
    applyPrayerSnapshotToSharedSchedule: vi.fn(),
    loadFollowingPrayerDay: vi.fn(async () => undefined),
  };
});

let root: Root | null;
let host: HTMLDivElement;
let current: ReturnType<typeof usePrayerTimes>;
let requests: Array<{ resolve: (value: PrayerTimesSnapshot) => void; reject: (error: Error) => void }>;

function Probe() {
  current = usePrayerTimes();
  return null;
}

function live(method: 3 | 13 = 13): PrayerTimesSnapshot {
  const value = service.createFallbackPrayerSnapshot(undefined, { method, school: 0 });
  return { ...value, source: 'live', schedule: value.schedule.map(p => ({ ...p, time: '12:00' })) };
}

beforeEach(() => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);
  localStorage.clear();
  vi.clearAllMocks();
  requests = [];
  vi.mocked(service.fetchPrayerTimes).mockImplementation(() => new Promise((resolve, reject) => requests.push({ resolve, reject })));
  host = document.createElement('div');
  document.body.append(host);
  root = createRoot(host);
});

afterEach(async () => {
  if (root) await act(async () => root!.unmount());
  host.remove();
  localStorage.clear();
});

describe('Prayer settings shared with Start', () => {
  it('clears old times immediately when the calculation method changes', async () => {
    await act(async () => root!.render(createElement(Probe)));
    await act(async () => requests[0].resolve(live()));
    expect(current.source).toBe('live');
    await act(async () => { void current.updatePreferences({ method: 3, school: 0 }); });
    expect(current.preferences.method).toBe(3);
    expect(current.status).toBe('loading');
    expect(current.schedule.every(p => p.time === '—:—')).toBe(true);
    expect(service.applyPrayerSnapshotToSharedSchedule).toHaveBeenLastCalledWith(expect.objectContaining({ source: 'fallback', preferences: { method: 3, school: 0 } }));
    await act(async () => requests[1].resolve(live(3)));
    expect(current.preferences.method).toBe(3);
    expect(current.status).toBe('live');
  });

  it('ignores an older request that finishes after a newer calculation', async () => {
    await act(async () => root!.render(createElement(Probe)));
    await act(async () => { void current.updatePreferences({ method: 3, school: 0 }); });
    await act(async () => requests[1].resolve(live(3)));
    const writes = vi.mocked(service.applyPrayerSnapshotToSharedSchedule).mock.calls.length;
    await act(async () => requests[0].resolve(live(13)));
    expect(current.preferences.method).toBe(3);
    expect(service.applyPrayerSnapshotToSharedSchedule).toHaveBeenCalledTimes(writes);
  });

  it('keeps unavailable times honest after a failed refresh', async () => {
    await act(async () => root!.render(createElement(Probe)));
    await act(async () => requests[0].reject(new Error('Offline')));
    expect(current.status).toBe('fallback');
    expect(current.error).toBe('Offline');
    expect(current.refreshing).toBe(false);
    expect(current.schedule.every(p => p.time === '—:—')).toBe(true);
  });

  it('does not publish an obsolete response after leaving the prayer screen', async () => {
    await act(async () => root!.render(createElement(Probe)));
    await act(async () => root!.unmount());
    root = null;
    const writes = vi.mocked(service.applyPrayerSnapshotToSharedSchedule).mock.calls.length;
    await act(async () => requests[0].resolve(live()));
    expect(service.applyPrayerSnapshotToSharedSchedule).toHaveBeenCalledTimes(writes);
    expect(service.loadFollowingPrayerDay).not.toHaveBeenCalled();
  });
});
