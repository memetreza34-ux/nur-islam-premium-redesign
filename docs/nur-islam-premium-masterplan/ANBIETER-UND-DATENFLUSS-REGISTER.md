# Anbieter- und Datenflussregister – Nur Islam Premium

**Stand:** 8. August 2026  
**Zweck:** reale externe Anbieter und geplante Produktionsdienste transparent dokumentieren.

Ein Eintrag bedeutet nicht automatisch, dass ein Anbieter dauerhaft freigegeben ist. Vor Production müssen Nutzungsbedingungen, Datenschutz, Kosten, Verfügbarkeit und Exit erneut geprüft werden.

## 1. Aktuell im App-Code verwendete externe Dienste

| ID | Anbieter | Zweck | Gesendete Daten | Lokale Speicherung | Status | Vor Release prüfen |
|---|---|---|---|---|---|---|
| PRAYER-01 | AlAdhan | standort-/methodenabhängige Gebetszeiten | Latitude, Longitude, Datum, Methode, Asr-Schule | Tagescache + Präferenzen | aktiv im Prototyp | Privacy, API-Stabilität, Methoden/Fachreview, Limits |
| QURAN-01 | Al Quran Cloud | Online-Nachladen nicht lokal eingebauter Suren | Surennummer, Editions-IDs | Cache Storage | aktiv im Prototyp | Edition, Lizenz/Nutzung, SLA, Vollständigkeit |
| MOSQUE-01 | OpenStreetMap + öffentliche Overpass-Instanzen | Moscheen im Radius finden | Latitude, Longitude, Radius | 24h Cache + Standortpräferenz | aktiv im Prototyp | Attribution, öffentliche Endpoint-Limits, Datenschutz, Datenqualität |
| CODE-01 | GitHub | Sourcecode, Versionskontrolle, PR/CI | Repositorydaten | Git | aktiv | Zugriff, 2FA, Actions/Runner, Dependency-/Secret-Scanning |

## 2. Aktuelle Datenflussdetails

### PRAYER-01 – AlAdhan

```text
Nutzer erlaubt Standort / nutzt Default Berlin
→ Browser erhält Koordinaten
→ App sendet Koordinaten + Datum + Methode + Asr-Schule an AlAdhan
→ Gebetszeitenantwort
→ Validierung
→ Tagescache localStorage
→ UI
```

Datenschutzfrage: Exakte Koordinaten verlassen das Gerät bei Live-Abfrage.

Fallback:

- Tagescache;
- klar gekennzeichneter Offline-Ersatzzeitplan.

### QURAN-01 – Al Quran Cloud

```text
Nutzer öffnet nicht lokal vorhandene Sure
→ Anfrage mit Surennummer + Editionen
→ arabische und deutsche Edition
→ Struktur-/Ayah-Validierung
→ Cache Storage
→ Reader
```

Der aktuelle Code sendet dabei keine notwendige Nutzeridentität oder Standortinformation.

### MOSQUE-01 – OSM/Overpass

```text
Standort oder Default Berlin
→ Overpass Query mit Koordinaten + Radius
→ OSM-Objekte
→ App normalisiert und sortiert nach Entfernung
→ lokaler Cache
→ Moschee-Finder
```

Öffentliche Overpass-Endpunkte sind keine zugesicherte private Produktinfrastruktur.

## 3. Geplante Produktionsanbieter – Entscheidung noch offen

| Fähigkeit | Kandidat/Standardweg | Status | Daten | Freigabekriterien |
|---|---|---|---|---|
| Backend/DB | Supabase/PostgreSQL oder gleichwertig | Entscheidung offen | Accounts, Sync, Progress, Entitlements | Region, DPA, RLS, Backup, Exit, Kosten |
| Auth | Backend-Auth | offen | Identität, E-Mail, Sessions | Verifikation, Recovery, Löschung, MFA Admin |
| Error Monitoring | Sentry oder gleichwertig | offen | Fehler-/Gerätemetadaten | PII-Scrubbing, Region, Retention, Sampling |
| Uptime | Better Stack oder gleichwertig | offen | URL/Health-Metriken | Alerts, SLA, Kosten |
| Product Analytics | PostHog oder gleichwertig | offen | minimale Produkt-Events | Privacy, Consent/Grundlage, Retention, keine sensiblen Inhalte |
| Transactional E-Mail | Resend oder gleichwertig | offen | E-Mail, Systemereignisse | SPF/DKIM/DMARC, DPA, Retention |
| Push | Plattform/native/OneSignal o. ä. | offen | Push-Token, Notification-Metadaten | Opt-in, Datenschutz, Background-Zuverlässigkeit |
| Web Payments | Stripe oder geeigneter PSP | offen | Zahlungs-/Kundenreferenzen | Webhooks, Steuerweg, Refunds, DPA |
| Mobile IAP | Apple/Google, ggf. RevenueCat-Schicht | offen | Kauf-/Entitlementdaten | Store-Regeln, serverseitige Verifikation, Restore |
| KI-Modell | noch zu wählen | offen | Nutzerfrage + Retrievalkontext | keine Trainingsweitergabe ungeprüft, Region, Retention, Safety, Kosten |

## 4. Pflichtfelder je finalem Anbieter

```text
provider_id
name
purpose
production_owner
contract_or_terms_url
dpa_status
subprocessors_checked
processing_region
data_sent
special_or_sensitive_data
authentication_and_secrets
retention
user_deletion_path
export_path
cost_model
budget_limit
alert_threshold
availability_dependency
fallback
exit_plan
replacement_candidate
last_reviewed
next_review
approval_status
```

## 5. Secrets-Register

Nur Metadaten dokumentieren – niemals echte Secretwerte.

| Secret | Umgebung | Client erlaubt? | Besitzer | Rotation | Zweck |
|---|---|---:|---|---|---|
| Backend public/anon key | dev/staging/prod | nur wenn explizit public | Projekt | nach Anbieterregel | Clientzugriff mit RLS |
| Backend service role | server only | **nein** | Backend | regelmäßig/anlassbezogen | privilegierte Serverjobs |
| KI API Key | server only | **nein** | Backend | regelmäßig | KI-Gateway |
| Payment secret | server only | **nein** | Payments | regelmäßig | PSP API |
| Payment webhook secret | server only | **nein** | Payments | anlassbezogen | Signaturprüfung |
| Monitoring token | je nach Typ | minimal | Ops | regelmäßig | Releases/Monitoring |

## 6. Anbieter-Gate

Kein neuer Produktionsanbieter ohne:

- echten Produktbedarf;
- dokumentierten Datenfluss;
- Kostenmodell;
- Datenschutz-/Vertragsprüfung soweit relevant;
- Secret-/Rechtekonzept;
- Ausfallverhalten;
- Monitoring;
- Lösch-/Exportweg;
- Exit-/Ersatzplan.
