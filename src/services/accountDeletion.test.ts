import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const backend = vi.hoisted(() => ({
  getSession: vi.fn(),
  signOut: vi.fn(),
}));

vi.mock('./nurBackend', () => backend);

import { deleteFullAccount, isFullAccountDeletionEnabled } from './accountDeletion';

describe('full account deletion', () => {
  beforeEach(() => {
    backend.getSession.mockReset();
    backend.signOut.mockReset();
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it('stays disabled by default and never touches the network', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    expect(isFullAccountDeletionEnabled()).toBe(false);
    await expect(deleteFullAccount()).rejects.toThrow('nicht aktiviert');
    expect(backend.getSession).not.toHaveBeenCalled();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('surfaces the independent server-side kill switch', async () => {
    vi.stubEnv('VITE_FULL_ACCOUNT_DELETION', 'true');
    backend.getSession.mockResolvedValue({
      accessToken: 'user-access-token',
      refreshToken: 'refresh-token',
      expiresAt: Date.now() + 60_000,
      user: { id: 'user-a', email: 'a@example.com' },
    });
    vi.stubGlobal('fetch', vi.fn(async () => ({
      ok: false,
      status: 503,
      json: async () => ({ error: 'account_deletion_disabled' }),
    } as Response)));

    await expect(deleteFullAccount()).rejects.toThrow('serverseitig nicht freigeschaltet');
    expect(backend.signOut).not.toHaveBeenCalled();
  });

  it('calls the authenticated Edge Function and clears the local session after success', async () => {
    vi.stubEnv('VITE_FULL_ACCOUNT_DELETION', 'true');
    backend.getSession.mockResolvedValue({
      accessToken: 'user-access-token',
      refreshToken: 'refresh-token',
      expiresAt: Date.now() + 60_000,
      user: { id: 'user-a', email: 'a@example.com' },
    });
    backend.signOut.mockResolvedValue(undefined);
    const fetchMock = vi.fn(async () => ({ ok: true, status: 200, json: async () => ({ deleted: true }) } as Response));
    vi.stubGlobal('fetch', fetchMock);

    await deleteFullAccount();

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(String(url)).toContain('/functions/v1/delete-account');
    expect(init?.method).toBe('POST');
    expect((init?.headers as Record<string, string>).Authorization).toBe('Bearer user-access-token');
    expect(backend.signOut).toHaveBeenCalledTimes(1);
  });
});
