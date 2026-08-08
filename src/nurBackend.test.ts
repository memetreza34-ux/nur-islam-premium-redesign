import { beforeEach, describe, expect, it, vi } from 'vitest';

const SESSION_KEY = 'nur_auth_session_v1';
const USER = { id: 'user-a', email: 'a@example.com' };

function storeSession(expiresInMs: number) {
  localStorage.setItem(SESSION_KEY, JSON.stringify({
    accessToken: 'access-old',
    refreshToken: 'refresh-old',
    expiresAt: Date.now() + expiresInMs,
    user: USER,
  }));
}

function tokenResponse(suffix: string) {
  return {
    ok: true,
    json: async () => ({
      access_token: `access-${suffix}`,
      refresh_token: `refresh-${suffix}`,
      expires_in: 3600,
      user: USER,
    }),
  } as unknown as Response;
}

function emptyResponse() {
  return { ok: true, json: async () => ({}) } as unknown as Response;
}

// The module keeps the in-flight refresh handle at module scope, so every test
// needs its own instance.
async function loadBackend() {
  vi.resetModules();
  return import('./nurBackend');
}

describe('getSession', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns the cached session without touching the network while it is still fresh', async () => {
    storeSession(10 * 60_000);
    const fetchMock = vi.fn(async () => tokenResponse('unexpected'));
    vi.stubGlobal('fetch', fetchMock);
    const { getSession } = await loadBackend();

    const session = await getSession();

    expect(session?.accessToken).toBe('access-old');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('refreshes only once when several callers race an expiring session', async () => {
    // Inside the ninety-second renewal margin, so every caller wants a refresh.
    storeSession(10_000);
    const fetchMock = vi.fn(async () => {
      await new Promise((resolve) => setTimeout(resolve, 10));
      return tokenResponse('new');
    });
    vi.stubGlobal('fetch', fetchMock);
    const { getSession } = await loadBackend();

    const sessions = await Promise.all([getSession(), getSession(), getSession(), getSession(), getSession()]);

    // Supabase rotates the refresh token, so a second call would spend an
    // already-consumed token and sign the user out.
    expect(fetchMock).toHaveBeenCalledTimes(1);
    for (const session of sessions) expect(session?.accessToken).toBe('access-new');
  });

  it('refreshes again after an earlier refresh finished', async () => {
    storeSession(10_000);
    const fetchMock = vi.fn(async () => tokenResponse('new'));
    vi.stubGlobal('fetch', fetchMock);
    const { getSession } = await loadBackend();

    await getSession();
    storeSession(10_000);
    await getSession();

    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('drops the session when the refresh is rejected', async () => {
    storeSession(10_000);
    vi.stubGlobal('fetch', vi.fn(async () => ({
      ok: false,
      status: 400,
      json: async () => ({ error_description: 'Invalid Refresh Token' }),
    } as unknown as Response)));
    const { getSession, getCachedSession } = await loadBackend();

    expect(await getSession()).toBeNull();
    expect(getCachedSession()).toBeNull();
  });

  it('does not resurrect the session when the user signs out mid-refresh', async () => {
    storeSession(10_000);
    let releaseRefresh = () => {};
    const refreshGate = new Promise<void>((resolve) => { releaseRefresh = resolve; });
    vi.stubGlobal('fetch', vi.fn(async (input: RequestInfo | URL) => {
      if (String(input).includes('grant_type=refresh_token')) {
        await refreshGate;
        return tokenResponse('new');
      }
      return emptyResponse();
    }));
    const { getSession, signOut, getCachedSession } = await loadBackend();

    const pending = getSession();
    await signOut();
    releaseRefresh();
    await pending;

    expect(getCachedSession()).toBeNull();
  });

  // Storage is the channel between tabs. This covers the case where the other
  // tab finished before this one starts; a rotation that lands while a request
  // is already in flight is not covered, because the token can only be spent
  // successfully once.
  it('uses a session another tab already refreshed instead of refreshing again', async () => {
    storeSession(10_000);
    const fetchMock = vi.fn(async () => tokenResponse('new'));
    vi.stubGlobal('fetch', fetchMock);
    const { getSession } = await loadBackend();

    localStorage.setItem(SESSION_KEY, JSON.stringify({
      accessToken: 'access-other-tab',
      refreshToken: 'refresh-other-tab',
      expiresAt: Date.now() + 10 * 60_000,
      user: USER,
    }));

    const session = await getSession();

    expect(session?.accessToken).toBe('access-other-tab');
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
