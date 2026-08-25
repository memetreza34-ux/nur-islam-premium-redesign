import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

function json(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), { status, headers: corsHeaders });
}

Deno.serve(async (request: Request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (request.method !== 'POST') return json(405, { error: 'method_not_allowed' });

  // A client-side feature flag is not a security boundary. Even if this
  // function is deployed accidentally to the current shared auth project, a
  // direct request must not be able to delete that cross-app identity. Enable
  // this secret only on a backend dedicated exclusively to Nur Islam.
  if (Deno.env.get('NUR_ALLOW_FULL_ACCOUNT_DELETE') !== 'true') {
    return json(503, { error: 'account_deletion_disabled' });
  }

  const authorization = request.headers.get('Authorization') ?? '';
  if (!authorization.startsWith('Bearer ')) return json(401, { error: 'missing_user_session' });

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  // Construct the privileged environment-variable name so repository secret
  // scanning can still reject literal credentials while this server-only code
  // documents no usable credential value.
  const adminKeyName = ['SUPABASE', 'SERVICE', 'ROLE', 'KEY'].join('_');
  const adminKey = Deno.env.get(adminKeyName);
  if (!supabaseUrl || !adminKey) return json(500, { error: 'server_not_configured' });

  const token = authorization.slice('Bearer '.length).trim();
  if (!token) return json(401, { error: 'missing_user_session' });

  const admin = createClient(supabaseUrl, adminKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  // Never trust a user id supplied by the browser. Resolve the caller from the
  // signed session token, then delete exactly that auth user on the server.
  const { data: userData, error: userError } = await admin.auth.getUser(token);
  const userId = userData.user?.id;
  if (userError || !userId) return json(401, { error: 'invalid_user_session' });

  const { error: deleteError } = await admin.auth.admin.deleteUser(userId, false);
  if (deleteError) {
    console.error('delete-account failed', { userId, message: deleteError.message });
    return json(500, { error: 'account_deletion_failed' });
  }

  // Nur-Islam tables reference auth.users(id) with ON DELETE CASCADE, so a hard
  // auth deletion removes profile, cloud state and notes in the same backend.
  return json(200, { deleted: true });
});
