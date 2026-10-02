-- Versioned proof of the user's explicit consent before Nur Islam stores
-- cloud content that can reveal religious practice (GDPR Art. 9).
alter table public.nur_islam_profiles
  add column if not exists sensitive_cloud_consent_version text,
  add column if not exists sensitive_cloud_consent_at timestamptz;

alter table public.nur_islam_profiles
  drop constraint if exists nur_islam_sensitive_cloud_consent_complete;

alter table public.nur_islam_profiles
  add constraint nur_islam_sensitive_cloud_consent_complete
  check (
    (sensitive_cloud_consent_version is null and sensitive_cloud_consent_at is null)
    or
    (sensitive_cloud_consent_version is not null and sensitive_cloud_consent_at is not null)
  );
