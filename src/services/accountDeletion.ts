import { getSession, signOut } from './nurBackend';

const DEFAULT_SUPABASE_URL = 'https://jmswsgwnvmvsfayeodcd.supabase.co';
const DEFAULT_PUBLISHABLE_KEY = 'sb_publishable_xSJ2M5rIDQ3Y3acgH2IKmg_QYLOTI-R';

function supabaseUrl() {
  return (import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL).replace(/\/$/, '');
}

function publishableKey() {
  return import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || DEFAULT_PUBLISHABLE_KEY;
}

export function isFullAccountDeletionEnabled() {
  return import.meta.env.VITE_FULL_ACCOUNT_DELETION === 'true';
}

async function readFunctionError(response: Response) {
  const payload = await response.json().catch(() => ({})) as { error?: string; message?: string };
  if (payload.message) return payload.message;
  switch (payload.error) {
    case 'missing_user_session':
    case 'invalid_user_session':
      return 'Deine Sitzung ist nicht mehr gültig. Bitte melde dich erneut an.';
    case 'server_not_configured':
      return 'Die vollständige Kontolöschung ist serverseitig noch nicht konfiguriert.';
    case 'account_deletion_failed':
      return 'Das Konto konnte serverseitig nicht vollständig gelöscht werden.';
    default:
      return `Kontolöschung fehlgeschlagen (${response.status}).`;
  }
}

/**
 * Permanently deletes the authenticated Nur-Islam auth identity through the
 * server-only Edge Function. This must only be enabled for a backend dedicated
 * to Nur Islam; the current shared fallback intentionally leaves it disabled.
 */
export async function deleteFullAccount() {
  if (!isFullAccountDeletionEnabled()) {
    throw new Error('Die vollständige Kontolöschung ist für dieses Backend nicht aktiviert.');
  }

  const session = await getSession();
  if (!session) throw new Error('Bitte melde dich zuerst an.');

  const response = await fetch(`${supabaseUrl()}/functions/v1/delete-account`, {
    method: 'POST',
    headers: {
      apikey: publishableKey(),
      Authorization: `Bearer ${session.accessToken}`,
      'Content-Type': 'application/json',
    },
    body: '{}',
  });

  if (!response.ok) throw new Error(await readFunctionError(response));

  // The auth row is already gone. signOut still clears the local session even
  // if the remote logout endpoint can no longer invalidate that deleted user.
  await signOut();
}
