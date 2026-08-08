export type NurUser = {
  id: string;
  email: string;
};

export type NurSession = {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  user: NurUser;
};

export type NurProfile = {
  user_id: string;
  display_name: string;
  theme: 'dark' | 'light' | 'system';
  language: 'de';
  prayer_notifications: boolean;
  cloud_sync: boolean;
  created_at?: string;
  updated_at?: string;
};

export type NurNote = {
  id: string;
  user_id: string;
  title: string;
  body: string;
  created_at: string;
  updated_at: string;
};

type AuthUserPayload = {
  id?: string;
  email?: string;
};

type AuthPayload = {
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
  user?: AuthUserPayload | null;
  msg?: string;
  message?: string;
  error_description?: string;
};

const DEFAULT_SUPABASE_URL = 'https://jmswsgwnvmvsfayeodcd.supabase.co';
const DEFAULT_PUBLISHABLE_KEY = 'sb_publishable_xSJ2M5rIDQ3Y3acgH2IKmg_QYLOTI-R';
const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL).replace(/\/$/, '');
const PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || DEFAULT_PUBLISHABLE_KEY;
const SESSION_KEY = 'nur_auth_session_v1';
const AUTH_EVENT = 'nur:auth-changed';
const CLOUD_RESTORED_EVENT = 'nur:cloud-restored';
const STORAGE_SCHEMA_VERSION = 1;

const EXCLUDED_BACKUP_KEYS = new Set([
  SESSION_KEY,
  'nur_pending_display_name',
  'nur_local_notes_v1',
  'nur_prayer_times_latest',
  'nur_mosque_search_cache_v1',
]);

function safeJsonParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function normalizeSession(payload: AuthPayload): NurSession | null {
  const accessToken = payload.access_token;
  const refreshToken = payload.refresh_token;
  const userId = payload.user?.id;
  const email = payload.user?.email;
  if (!accessToken || !refreshToken || !userId || !email) return null;
  const expiresIn = Number.isFinite(payload.expires_in) ? Math.max(60, Number(payload.expires_in)) : 3600;
  return {
    accessToken,
    refreshToken,
    expiresAt: Date.now() + expiresIn * 1000,
    user: { id: userId, email },
  };
}

function persistSession(session: NurSession | null) {
  try {
    if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    else localStorage.removeItem(SESSION_KEY);
  } catch {
    // Auth remains usable for the current request if storage is unavailable.
  }
  window.dispatchEvent(new CustomEvent<NurSession | null>(AUTH_EVENT, { detail: session }));
}

export function getCachedSession() {
  const session = safeJsonParse<NurSession>(localStorage.getItem(SESSION_KEY));
  if (!session?.accessToken || !session.refreshToken || !session.user?.id || !session.user.email) return null;
  return session;
}

async function readError(response: Response) {
  const payload = await response.json().catch(() => ({})) as AuthPayload;
  return payload.error_description || payload.msg || payload.message || `Serverfehler (${response.status})`;
}

async function authRequest(path: string, body: Record<string, unknown>, bearer?: string) {
  const response = await fetch(`${SUPABASE_URL}${path}`, {
    method: 'POST',
    headers: {
      apikey: PUBLISHABLE_KEY,
      'Content-Type': 'application/json',
      ...(bearer ? { Authorization: `Bearer ${bearer}` } : {}),
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error(await readError(response));
  return response.json().catch(() => ({})) as Promise<AuthPayload>;
}

export async function signInWithPassword(email: string, password: string) {
  const payload = await authRequest('/auth/v1/token?grant_type=password', { email: email.trim(), password });
  const session = normalizeSession(payload);
  if (!session) throw new Error('Anmeldung war erfolgreich, aber die Sitzung konnte nicht gelesen werden.');
  persistSession(session);
  return session;
}

export async function signUp(email: string, password: string) {
  const payload = await authRequest('/auth/v1/signup', { email: email.trim(), password });
  const session = normalizeSession(payload);
  if (session) persistSession(session);
  return { session, emailConfirmationRequired: !session };
}

export async function refreshSession(session = getCachedSession()) {
  if (!session) return null;
  const payload = await authRequest('/auth/v1/token?grant_type=refresh_token', { refresh_token: session.refreshToken });
  const refreshed = normalizeSession(payload);
  if (!refreshed) throw new Error('Die Cloud-Sitzung konnte nicht erneuert werden.');
  persistSession(refreshed);
  return refreshed;
}

export async function getSession() {
  const session = getCachedSession();
  if (!session) return null;
  if (session.expiresAt > Date.now() + 90_000) return session;
  try {
    return await refreshSession(session);
  } catch {
    persistSession(null);
    return null;
  }
}

export async function signOut() {
  const session = getCachedSession();
  if (session) {
    await fetch(`${SUPABASE_URL}/auth/v1/logout`, {
      method: 'POST',
      headers: {
        apikey: PUBLISHABLE_KEY,
        Authorization: `Bearer ${session.accessToken}`,
      },
    }).catch(() => undefined);
  }
  persistSession(null);
}

export function subscribeAuth(listener: (session: NurSession | null) => void) {
  const handler = (rawEvent: Event) => listener((rawEvent as CustomEvent<NurSession | null>).detail);
  window.addEventListener(AUTH_EVENT, handler);
  return () => window.removeEventListener(AUTH_EVENT, handler);
}

async function authenticatedFetch(path: string, init: RequestInit = {}) {
  const session = await getSession();
  if (!session) throw new Error('Bitte melde dich zuerst an.');
  const headers = new Headers(init.headers);
  headers.set('apikey', PUBLISHABLE_KEY);
  headers.set('Authorization', `Bearer ${session.accessToken}`);
  headers.set('Content-Type', 'application/json');
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, { ...init, headers });
  if (!response.ok) throw new Error(await readError(response));
  return response;
}

export async function loadProfile() {
  const session = await getSession();
  if (!session) return null;
  const response = await authenticatedFetch(`nur_islam_profiles?user_id=eq.${encodeURIComponent(session.user.id)}&select=*`);
  const rows = await response.json() as NurProfile[];
  return rows[0] ?? null;
}

export async function upsertProfile(input: Partial<Omit<NurProfile, 'user_id' | 'created_at' | 'updated_at'>>) {
  const session = await getSession();
  if (!session) throw new Error('Bitte melde dich zuerst an.');
  const current = await loadProfile();
  const row: NurProfile = {
    user_id: session.user.id,
    display_name: input.display_name ?? current?.display_name ?? 'Nur Nutzer',
    theme: input.theme ?? current?.theme ?? 'dark',
    language: 'de',
    prayer_notifications: input.prayer_notifications ?? current?.prayer_notifications ?? false,
    cloud_sync: input.cloud_sync ?? current?.cloud_sync ?? true,
    updated_at: new Date().toISOString(),
  };
  const response = await authenticatedFetch('nur_islam_profiles?on_conflict=user_id', {
    method: 'POST',
    headers: { Prefer: 'resolution=merge-duplicates,return=representation' },
    body: JSON.stringify(row),
  });
  const rows = await response.json() as NurProfile[];
  return rows[0] ?? row;
}

function shouldBackUpKey(key: string) {
  if (!(key.startsWith('nur_') || key.startsWith('premium_'))) return false;
  if (EXCLUDED_BACKUP_KEYS.has(key)) return false;
  if (key.startsWith('nur_prayer_reminders_fired_') || key.startsWith('nur_calendar_reminders_fired_')) return false;
  return true;
}

export function collectLocalState() {
  const state: Record<string, string> = {};
  try {
    for (let index = 0; index < localStorage.length; index += 1) {
      const key = localStorage.key(index);
      if (!key || !shouldBackUpKey(key)) continue;
      const value = localStorage.getItem(key);
      if (value !== null) state[key] = value;
    }
  } catch {
    // Restricted storage results in an empty backup rather than a crash.
  }
  return state;
}

export async function backupLocalState() {
  const session = await getSession();
  if (!session) throw new Error('Bitte melde dich zuerst an.');
  const now = new Date().toISOString();
  const response = await authenticatedFetch('nur_islam_user_state?on_conflict=user_id', {
    method: 'POST',
    headers: { Prefer: 'resolution=merge-duplicates,return=representation' },
    body: JSON.stringify({
      user_id: session.user.id,
      schema_version: STORAGE_SCHEMA_VERSION,
      payload: collectLocalState(),
      client_updated_at: now,
      updated_at: now,
    }),
  });
  const rows = await response.json() as Array<{ updated_at?: string }>;
  return rows[0]?.updated_at ?? now;
}

export async function restoreCloudState() {
  const session = await getSession();
  if (!session) throw new Error('Bitte melde dich zuerst an.');
  const response = await authenticatedFetch(`nur_islam_user_state?user_id=eq.${encodeURIComponent(session.user.id)}&select=schema_version,payload,updated_at`);
  const rows = await response.json() as Array<{ schema_version: number; payload: unknown; updated_at: string }>;
  const cloud = rows[0];
  if (!cloud || !cloud.payload || typeof cloud.payload !== 'object' || Array.isArray(cloud.payload)) return null;
  const payload = cloud.payload as Record<string, unknown>;
  Object.entries(payload).forEach(([key, value]) => {
    if (!shouldBackUpKey(key) || typeof value !== 'string') return;
    try { localStorage.setItem(key, value); } catch { /* optional */ }
  });
  window.dispatchEvent(new CustomEvent(CLOUD_RESTORED_EVENT, { detail: cloud.updated_at }));
  return cloud.updated_at;
}

export async function listNotes() {
  const response = await authenticatedFetch('nur_islam_notes?select=*&order=updated_at.desc');
  return response.json() as Promise<NurNote[]>;
}

export async function createNote(title: string, body: string) {
  const session = await getSession();
  if (!session) throw new Error('Bitte melde dich zuerst an.');
  const response = await authenticatedFetch('nur_islam_notes', {
    method: 'POST',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify({ user_id: session.user.id, title: title.trim(), body }),
  });
  const rows = await response.json() as NurNote[];
  return rows[0];
}

export async function updateNote(id: string, title: string, body: string) {
  const response = await authenticatedFetch(`nur_islam_notes?id=eq.${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify({ title: title.trim(), body, updated_at: new Date().toISOString() }),
  });
  const rows = await response.json() as NurNote[];
  return rows[0];
}

export async function deleteNote(id: string) {
  await authenticatedFetch(`nur_islam_notes?id=eq.${encodeURIComponent(id)}`, { method: 'DELETE' });
}
