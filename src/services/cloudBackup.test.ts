import { beforeEach, describe, expect, it, vi } from 'vitest';
import { backupLocalState, collectLocalState, restoreCloudState } from './nurBackend';

// Backup and restore move a user's real progress. Two failures matter here:
// uploading device-bound or private data that was never meant to leave the
// phone, and restoring something that corrupts local state. Both are silent.

const SESSION_KEY = 'nur_auth_session_v1';

function signIn() {
  localStorage.setItem(SESSION_KEY, JSON.stringify({
    accessToken: 'access', refreshToken: 'refresh',
    expiresAt: Date.now() + 3_600_000,
    user: { id: 'user-a', email: 'a@example.com' },
  }));
}

const PROGRESS = {
  nur_dhikr_daily_v2: '{"date":"2026-08-08","counts":{"morning:tasbih":33}}',
  nur_dua_favorites: '["dua-1","dua-2"]',
  nur_name_favorites: '["1","48"]',
  nur_quran_bookmarks_2: '[255]',
  nur_quran_last_read: '{"surahNumber":2,"ayahNumber":255}',
  premium_learning_progress: '{"wudu":3}',
};

// Everything here is tied to this device or this session and must stay put.
const DEVICE_ONLY = {
  nur_auth_session_v1: 'session-token',
  nur_prayer_location: '{"latitude":52.52,"longitude":13.405}',
  nur_mosque_location_v1: '{"latitude":52.52,"longitude":13.405}',
  nur_mosque_search_cache_v1: '{"results":[]}',
  nur_prayer_times_latest: '{"dateKey":"2026-08-08"}',
  nur_local_notes_v1: '["private note"]',
  nur_onboarding_complete: 'true',
  nur_install_prompt_dismissed: 'true',
  nur_pending_display_name: 'Arman',
  'nur_prayer_reminders_fired_2026-08-08': '["dhuhr"]',
  'nur_calendar_reminders_fired_2026-08-08': '["1"]',
};

function seedBoth() {
  for (const [key, value] of Object.entries({ ...PROGRESS, ...DEVICE_ONLY })) {
    localStorage.setItem(key, value);
  }
}

describe('collectLocalState', () => {
  beforeEach(() => localStorage.clear());

  it('collects the progress a user expects to carry between devices', () => {
    seedBoth();
    expect(collectLocalState()).toEqual(PROGRESS);
  });

  it.each(Object.keys(DEVICE_ONLY))('never uploads %s', (key) => {
    seedBoth();
    expect(collectLocalState()).not.toHaveProperty(key);
  });

  it('ignores keys belonging to other apps on the same origin', () => {
    localStorage.setItem('runempire_stats', '{"km":10}');
    localStorage.setItem('speechcoach_profile', '{"name":"x"}');
    expect(collectLocalState()).toEqual({});
  });
});

describe('backup and restore round trip', () => {
  beforeEach(() => localStorage.clear());

  it('restores exactly the progress that was backed up', async () => {
    seedBoth();
    signIn(); // after seeding, so a real session is present and still excluded

    let uploaded: Record<string, string> = {};
    vi.stubGlobal('fetch', vi.fn(async (_input: RequestInfo | URL, init?: RequestInit) => {
      if (init?.method === 'POST') {
        uploaded = JSON.parse(String(init.body)).payload;
        return { ok: true, json: async () => [{ updated_at: '2026-08-08T10:00:00Z' }] } as unknown as Response;
      }
      return { ok: true, json: async () => [{ schema_version: 1, payload: uploaded, updated_at: '2026-08-08T10:00:00Z' }] } as unknown as Response;
    }));

    await backupLocalState();
    // The device is wiped and the same account restores onto it.
    localStorage.clear();
    signIn();
    const restoredAt = await restoreCloudState();

    expect(restoredAt).toBe('2026-08-08T10:00:00Z');
    for (const [key, value] of Object.entries(PROGRESS)) {
      expect(localStorage.getItem(key)).toBe(value);
    }
  });

  it('reports no backup rather than clearing local progress', async () => {
    signIn();
    localStorage.setItem('nur_dua_favorites', '["dua-1"]');
    vi.stubGlobal('fetch', vi.fn(async () => ({ ok: true, json: async () => [] } as unknown as Response)));

    expect(await restoreCloudState()).toBeNull();
    expect(localStorage.getItem('nur_dua_favorites')).toBe('["dua-1"]');
  });

  it('announces a restore so open screens can reread their state', async () => {
    signIn();
    const seen: string[] = [];
    window.addEventListener('nur:cloud-restored', (event) => seen.push(String((event as CustomEvent).detail)));
    vi.stubGlobal('fetch', vi.fn(async () => ({
      ok: true,
      json: async () => [{ schema_version: 1, payload: { nur_theme: 'light' }, updated_at: '2026-08-08T11:00:00Z' }],
    } as unknown as Response)));

    await restoreCloudState();

    expect(seen).toEqual(['2026-08-08T11:00:00Z']);
  });

  it('refuses payload entries that must never come back from the cloud', async () => {
    signIn();
    localStorage.setItem('nur_prayer_location', '{"latitude":52.52,"longitude":13.405}');
    vi.stubGlobal('fetch', vi.fn(async () => ({
      ok: true,
      json: async () => [{
        schema_version: 1,
        updated_at: '2026-08-08T12:00:00Z',
        payload: {
          // A tampered or stale backup must not move another device's location
          // onto this one, hand over a session, or inject a foreign key.
          nur_prayer_location: '{"latitude":-33.9,"longitude":18.4}',
          nur_auth_session_v1: 'stolen-session',
          runempire_stats: '{"km":999}',
          nur_dua_favorites: '["dua-9"]',
        },
      }],
    } as unknown as Response)));

    await restoreCloudState();

    expect(localStorage.getItem('nur_prayer_location')).toBe('{"latitude":52.52,"longitude":13.405}');
    expect(localStorage.getItem('nur_auth_session_v1')).not.toBe('stolen-session');
    expect(localStorage.getItem('runempire_stats')).toBeNull();
    expect(localStorage.getItem('nur_dua_favorites')).toBe('["dua-9"]');
  });

  it('rejects an incompatible schema before changing any local progress', async () => {
    signIn();
    localStorage.setItem('nur_dua_favorites', '["local"]');
    const seen: string[] = [];
    window.addEventListener('nur:cloud-restored', (event) => seen.push(String((event as CustomEvent).detail)));
    vi.stubGlobal('fetch', vi.fn(async () => ({
      ok: true,
      json: async () => [{
        schema_version: 2,
        updated_at: '2026-08-08T12:30:00Z',
        payload: {
          nur_dua_favorites: '["future-format"]',
          nur_name_favorites: '["99"]',
        },
      }],
    } as unknown as Response)));

    await expect(restoreCloudState()).rejects.toThrow('nicht unterstützte Datenversion 2');
    expect(localStorage.getItem('nur_dua_favorites')).toBe('["local"]');
    expect(localStorage.getItem('nur_name_favorites')).toBeNull();
    expect(seen).toEqual([]);
  });

  it('skips non-string payload values instead of writing "[object Object]"', async () => {
    signIn();
    vi.stubGlobal('fetch', vi.fn(async () => ({
      ok: true,
      json: async () => [{
        schema_version: 1,
        updated_at: '2026-08-08T13:00:00Z',
        payload: { nur_dua_favorites: { not: 'a string' }, nur_name_favorites: '["1"]' },
      }],
    } as unknown as Response)));

    await restoreCloudState();

    expect(localStorage.getItem('nur_dua_favorites')).toBeNull();
    expect(localStorage.getItem('nur_name_favorites')).toBe('["1"]');
  });

  it('tolerates a payload that is not an object at all', async () => {
    signIn();
    localStorage.setItem('nur_dua_favorites', '["dua-1"]');
    vi.stubGlobal('fetch', vi.fn(async () => ({
      ok: true,
      json: async () => [{ schema_version: 1, payload: 'nonsense', updated_at: '2026-08-08T14:00:00Z' }],
    } as unknown as Response)));

    expect(await restoreCloudState()).toBeNull();
    expect(localStorage.getItem('nur_dua_favorites')).toBe('["dua-1"]');
  });

  it('requires a session before touching the cloud', async () => {
    const mock = vi.fn();
    vi.stubGlobal('fetch', mock);
    await expect(backupLocalState()).rejects.toThrow();
    await expect(restoreCloudState()).rejects.toThrow();
    expect(mock).not.toHaveBeenCalled();
  });
});
