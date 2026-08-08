# 15 – Accounts, Tools und operative Einrichtung

**Stand:** 8. August 2026  
**Ziel:** alle Konten, Dienste, Zugriffe und Umgebungen für Nur Islam Premium kontrolliert einrichten – ohne 30 unnötige SaaS-Abos vor dem ersten Release.

## 1. Grundsatz

Ein Tool wird nur eingerichtet, wenn eine konkrete Fähigkeit benötigt wird.

Jeder Dienst braucht:

```text
Zweck
Owner
Login-E-Mail
MFA
Environment
Datenarten
Secrets
Kosten/Tarif
DPA/Vertrag falls nötig
Export/Exit
Alarm
Prüfdatum
```

## 2. Prioritätsstufen

### P0 – vor ernsthaftem Releasepfad

- GitHub;
- Domain/DNS;
- Hosting/Preview;
- CI/CD;
- Error Monitoring;
- Apple Developer, wenn iOS v1;
- Google Play Console, wenn Android v1;
- Backend/Auth, wenn Accounts/Premium v1;
- Payment/IAP, wenn Premium v1;
- Supportkontakt;
- Datenschutzerklärung/Impressum-Seiten;
- Security-/Secret-Prozess.

### P1 – vor öffentlichem Wachstum

- Product Analytics;
- Uptime Monitoring;
- transactional E-Mail;
- Push-Infrastruktur;
- Feedbacksystem;
- Statusseite;
- Kostenalarme.

### P2 – erst bei Bedarf/Scale

- dediziertes Secret-Management SaaS;
- umfangreiches CRM;
- Data Warehouse;
- erweiterte BI;
- separate Search-Infrastruktur;
- Queue-/Workflow-SaaS;
- große Experimentplattform.

## 3. Empfohlene konkrete Auswahlmatrix

Das sind Startkandidaten, keine ewigen Pflichtanbieter.

| Fähigkeit | Startkandidat | Alternative | Wann wirklich nötig? |
|---|---|---|---|
| Repo | GitHub | GitLab | sofort |
| Coding Agent | Codex / Claude Code | andere | Entwicklung |
| CI | GitHub Actions | anderer Runner | sofort |
| Design | Figma | andere | laufend |
| Backend | Supabase | Firebase/eigen | Accounts/Sync |
| Hosting Web | Vercel/Cloudflare Pages | Netlify/Hostinger | Web/PWA |
| DNS/CDN | Cloudflare | Registrar/CDN | Domain |
| Errors | Sentry | Better Stack u. a. | vor Public |
| Analytics | PostHog | privacy-freundliche Alternative | bei echten Produktmetriken |
| Uptime | Better Stack | andere | vor Public |
| E-Mail | Resend | andere | Auth/Support/Transaktionen |
| Push | native APNs/FCM oder OneSignal | anderer | wenn echte Pushfälle |
| Web Payment | Stripe | anderer PSP | Web-Premium |
| Mobile Entitlements | RevenueCat oder eigener Store-Layer | direkt StoreKit/Play | Mobile-Premium |
| Support | Crisp / E-Mail | andere | Public |
| Feedback | Canny / GitHub/Linear | andere | nach Beta |
| Secrets | CI/Host Secrets → später Doppler/Vault | andere | nach Komplexität |

Vor Nutzung immer aktuelle Preise, Datenschutz, Limits, Vertragsbedingungen und Exportmöglichkeiten prüfen.

## 4. Account-Register

| Dienst | Login/Owner | MFA | Prod-Zugriff | Billing Owner | Recovery | Prüfdatum |
|---|---|---|---|---|---|---|
| GitHub | offen | Pflicht | minimal | offen | Backup Codes | Datum |
| Domain | offen | Pflicht | minimal | offen | Recovery | Datum |
| Apple | offen | Pflicht | Rollen | offen | Recovery | Datum |
| Google | offen | Pflicht | Rollen | offen | Recovery | Datum |
| Backend | offen | Pflicht | Rollen | offen | Recovery | Datum |
| Payment | offen | Pflicht | minimal | offen | Recovery | Datum |
| Monitoring | offen | Pflicht | Rollen | offen | Recovery | Datum |

Keine privaten Einmalzugänge in Repositorydateien eintragen. Nur Rollen/Verantwortung dokumentieren.

## 5. GitHub

Einrichten:

- Branch Protection;
- PR-Workflow;
- CODEOWNERS bei Teamwachstum;
- Dependabot/Dependency Update Strategie;
- Secret Scanning, soweit Plan verfügbar;
- Actions Secrets;
- Release Tags;
- Security Policy;
- Backup/Export-Plan.

Zugriffe:

- Admin nur wenige Personen;
- Agenten keine unnötigen Org-/Repo-Rechte;
- Deploy Keys/Tokens minimal scoped;
- alte Tokens entfernen.

## 6. Environments

Mindestens:

```text
Local
Development
Staging
Production
```

Trennen:

- URLs;
- Datenbanken;
- Auth-Konfiguration;
- API Keys;
- Webhooks;
- Paymentprodukte;
- Push-Keys;
- Analytics;
- Error Monitoring;
- E-Mail-Domains;
- Rate Limits.

Nie Payment- oder Production-Secrets in Preview-Branches.

## 7. Domain/DNS

Früh festlegen:

- Hauptdomain;
- `www` Redirect;
- `app` Subdomain, falls sinnvoll;
- `support`/Helpcenter;
- Privacy/Legal URLs;
- E-Mail-Domain;
- SPF/DKIM/DMARC;
- DNS Owner;
- Auto-Renewal;
- Registrar Lock;
- MFA.

## 8. Apple Developer

Benötigt, wenn iOS veröffentlicht wird.

Dokumentieren:

- Account Holder;
- Admin/App Manager;
- Bundle IDs;
- Signierung;
- App Store Connect Rollen;
- Banking/Tax falls Verkäufe;
- Subscription Group;
- TestFlight;
- Reviewkontakt;
- Zertifikats-/Key-Recovery.

Keine gemeinsame private Apple-ID im Team teilen.

## 9. Google Play Console

Dokumentieren:

- Owner/Admin;
- App Record;
- Application ID;
- App Signing;
- Internal/Closed/Production Tracks;
- Payments Profile;
- Data Safety;
- Service Accounts/API-Zugriff;
- Review-/Supportkontakt.

## 10. Supabase – falls Zielstack bestätigt

Pro Umgebung:

- Project ID;
- Region;
- DB Owner;
- Auth URLs;
- E-Mail Provider;
- Storage Buckets;
- RLS Status;
- Edge Functions;
- Backups;
- API Keys;
- Secret Rotation;
- Cost Alert;
- Restore-Test.

Service Role niemals in Clientcode.

## 11. Monitoring

### Sentry/Fehlertracking

Definieren:

- Environment;
- Release-Version;
- Source Maps;
- PII Scrubbing;
- Sampling;
- Alert Owner;
- Critical Alert Channel.

### Uptime/API

Prüfen:

- Web App;
- Backend;
- Auth;
- kritische APIs;
- Statuspage.

Externe kostenlose APIs nicht mit eigenem SLA verwechseln.

## 12. Analytics

Vor Toolinstallation Eventplan erstellen.

Nur Events, die Entscheidungen beantworten.

Keine „track everything“-Strategie.

Pflichtfragen:

- brauchen wir Login-Verknüpfung?
- IP/Standort?
- Cookie/SDK-Consent?
- Retention?
- Datenregion?
- Löschung/Export?

## 13. E-Mail

Trennen:

### Transaktional

- Verifikation;
- Passwort/Recovery;
- Kauf;
- Security;
- Accountlöschung.

### Marketing

- Newsletter;
- Produktupdates;
- Kampagnen.

Jeweils eigene Consent-/Unsubscribe-/Retention-Logik.

## 14. Push

Use Cases definieren vor Anbieterwahl:

- Prayer Reminder;
- Content Update;
- Account Security;
- Premium;
- Marketing.

Prayer Reminder bevorzugt local/native planen, wenn zuverlässig möglich. Marketingpush gesondert opt-in.

## 15. Payment/Entitlements

### Web

PSP, z. B. Stripe, wenn Webverkauf vorgesehen und rechtlich/storeseitig passend.

### Mobile

Apple/Google Store-Käufe nach aktuellen Regeln.

### Entitlement Layer

```text
source
product_id
user_id
status
starts_at
expires_at
store_transaction_id
last_verified_at
```

Nicht in Client/localStorage als Wahrheit.

## 16. Support/Feedback

Start klein:

- Support-E-Mail;
- strukturierte Kategorien;
- Issue/Linear-Workflow;
- religiöse Contentfehler separater Kanal.

Erst bei Volumen:

- Crisp/Helpdesk;
- Knowledge Base;
- Canny/Feedbackportal;
- SLA/Automationen.

## 17. Secret-Inventar

Nicht Werte speichern, nur Metadaten:

```text
Secret-Name
Dienst
Environment
Owner
Scope
erstellt
rotiert
Ablauf
wo gespeichert
Notfallrotation
```

Beispiele:

- Supabase service role;
- Apple keys;
- Google service account;
- Stripe/RevenueCat secrets;
- AI provider key;
- Resend key;
- Sentry auth token.

## 18. Rollenmodell

Minimal:

- Product Owner;
- Engineering Owner;
- Billing Owner;
- Security Owner;
- Content/Religious Review Owner;
- Support Owner.

Bei Solo-Projekt können Rollen dieselbe Person sein, müssen aber als Verantwortlichkeiten getrennt bleiben.

## 19. Offboarding

Wenn Person/Agent/Partner nicht mehr benötigt wird:

1. GitHub entfernen;
2. Hosting/Backend entfernen;
3. Apple/Google Rollen entfernen;
4. Payment/Support entfernen;
5. Tokens/Secrets rotieren;
6. Sessions widerrufen;
7. Geräte/Recovery prüfen;
8. Audit dokumentieren.

## 20. Setup-Reihenfolge

```text
GitHub + Branch/CI
→ Domain/DNS
→ Hosting/Preview
→ Monitoring
→ Backend/Auth falls v1
→ E-Mail
→ Apple/Google
→ Payments/Entitlements
→ Push
→ Analytics
→ Support/Feedback
→ Scale-Tools erst bei Bedarf
```

## 21. Gate

Tool-/Account-Setup gilt als kontrolliert, wenn:

- jeder produktive Dienst Owner + MFA hat;
- Dev/Staging/Prod getrennt sind;
- Secrets nicht im Repo/Client liegen;
- Billing/Recovery geregelt ist;
- Daten/Datenschutz je Anbieter dokumentiert sind;
- Kostenalarm existiert;
- Export/Exit geklärt ist;
- unnötige Tools nicht vorsorglich bezahlt werden;
- Zugriffe regelmäßig überprüft werden.
