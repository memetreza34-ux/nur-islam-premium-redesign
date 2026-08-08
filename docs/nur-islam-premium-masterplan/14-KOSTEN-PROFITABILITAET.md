# 14 – Kosten, Unit Economics und Profitabilität

**Stand:** 8. August 2026  
**Ziel:** Nur Islam Premium soll nicht nur technisch funktionieren, sondern auch bei 100, 1.000, 10.000 und 100.000 aktiven Nutzern finanziell kontrollierbar bleiben.

## 1. Grundsatz

Keine Kostenplanung mit erfundenen Anbieterpreisen. Preise, Freikontingente, Storegebühren, Steuern und API-Konditionen ändern sich.

Deshalb immer:

```text
Anbieter
Tarif
Währung
Prüfdatum
Fixkosten
variable Einheit
Freikontingent
Overage
Preisänderungsrisiko
Kündigung/Exit
```

## 2. Kostenklassen

### Einmalig/selten

- Apple-/Google-/Unternehmenskonten soweit relevant;
- Domain/Marke;
- Design-/Assetlizenzen;
- juristische Prüfung;
- islamwissenschaftliches Fachreview;
- Storegrafiken/Video;
- Geräte für Tests;
- initiale Datenmigration;
- Audio-/Contentlizenzen.

### Monatlich fix

- Hosting;
- Datenbank/Backend-Basistarif;
- Monitoring;
- E-Mail/Support;
- Analytics;
- Domain-nahe Dienste;
- Projekt-/Supporttools;
- gegebenenfalls Revenue-/Subscription-Tools.

### Variabel

- Datenbank/Compute;
- Storage;
- CDN/Egress;
- Quran-/Prayer-/Maps-Dienste falls kostenpflichtig;
- KI-Tokens/Modelle;
- Embeddings/RAG;
- Audio-Streaming;
- Push/E-Mail;
- Paymentgebühren;
- Refunds/Chargebacks;
- Supportvolumen.

### Menschen

Nicht vergessen:

- Entwicklung;
- Design;
- Support;
- Fachreview;
- Contentpflege;
- Recht/Steuern;
- Moderation, falls später Community.

## 3. Szenariomatrix

Für jede geplante Architektur rechnen:

| Szenario | MAU | zahlende Nutzer | erwartete Kernflows/Monat | Audio GB | KI-Anfragen | Supportfälle |
|---|---:|---:|---:|---:|---:|---:|
| S1 | 100 | eintragen | eintragen | eintragen | eintragen | eintragen |
| S2 | 1.000 | eintragen | eintragen | eintragen | eintragen | eintragen |
| S3 | 10.000 | eintragen | eintragen | eintragen | eintragen | eintragen |
| S4 | 100.000 | eintragen | eintragen | eintragen | eintragen | eintragen |

Nicht nur Durchschnitt rechnen. Zusätzlich Peak-Faktor für Ramadan, Freitage, Eid, Push-Spitzen und virale Kampagnen.

## 4. Kostenmodell je Nutzer

Formel:

```text
Variable Kosten pro aktivem Nutzer =
(DB + Storage + Egress + APIs + KI + Messaging + Support variabel) / MAU
```

```text
Variable Kosten pro Premium-Nutzer =
zusätzliche Premiumkosten / zahlende Nutzer
```

KI separat ausweisen, weil sie überproportional wachsen kann.

## 5. Umsatzmodell

Für Abo:

```text
Bruttoumsatz = zahlende Nutzer × durchschnittlicher Bruttopreis
```

```text
Nettoumsatz vor internen Kosten =
Bruttoumsatz
- Plattform/Paymentgebühren
- Steuern/Umsatzsteuer soweit anwendbar
- Refunds/Chargebacks
```

```text
Deckungsbeitrag =
Nettoumsatz
- variable Produktkosten
- direkt zurechenbarer Support
```

Keine Steuer-/Gebührenquote pauschal festschreiben; nach Markt und Vertriebskanal aktuell prüfen.

## 6. Break-even

```text
Break-even zahlende Nutzer =
monatliche Fixkosten / Deckungsbeitrag pro zahlendem Nutzer
```

Zusätzlich drei Break-even-Sichten:

1. Infrastruktur-only;
2. Infrastruktur + Fachreview/Support;
3. Vollkosten inklusive Entwicklung/Unternehmenskosten.

## 7. Free/Premium-Finanzierung

Free-Nutzer verursachen ebenfalls Kosten.

Deshalb modellieren:

```text
Free MAU × Kosten/Free-MAU
+
Premium MAU × Kosten/Premium-MAU
```

Premium muss nicht nur „mehr Umsatz“ bringen, sondern den Free-Kern nachhaltig mitfinanzieren können.

## 8. KI-Kostenkontrolle

Wenn KI live geht:

- harte Nutzerlimits;
- Rate Limits;
- Modellrouting;
- kürzere Kontexte;
- Retrieval statt Vollkorpus im Prompt;
- Caching, wo fachlich sicher;
- günstigeres Modell für Klassifikation;
- stärkeres Modell nur wenn nötig;
- tägliches/monatliches Budget;
- Kill Switch.

Metriken:

```text
Kosten pro KI-Anfrage
Kosten pro aktivem KI-Nutzer
Kosten pro Premium-Nutzer
Fehlerrate
Retrieval-Trefferquote
Anteil unnötiger Wiederholungsanfragen
```

## 9. Audio-/Media-Kosten

Audio kann stärker als Text kosten.

Rechnen:

```text
GB gespeichert
× Speicherpreis
+
GB ausgeliefert
× Egress/CDN
```

Szenarien:

- nur Streaming;
- Download;
- Offlinepakete;
- mehrere Rezitatoren;
- mehrere Qualitätsstufen.

Downloads lokal wieder löschbar machen und Cachelimits berücksichtigen.

## 10. Backendkosten

Bei Supabase/eigenem Backend getrennt verfolgen:

- DB Compute;
- DB Storage;
- Auth MAU;
- File Storage;
- Egress;
- Edge Functions;
- Realtime;
- Backups;
- Logs;
- Staging + Production getrennt.

Keine Productionkosten aus nur einem Development-Projekt ableiten.

## 11. Anbieter-Lock-in als finanzielle Größe

Nicht nur Monatsrechnung betrachten.

Für jeden zentralen Anbieter:

```text
Datenexport möglich?
Migrationsarbeit
Downtime
Doppelbetrieb
neuer Anbieter
Vertragsende
Datenlöschung
```

Ein billiger Anbieter kann langfristig teuer sein, wenn Exit praktisch unmöglich wird.

## 12. Store-/Payment-Szenarien

Getrennt modellieren:

- iOS In-App Purchase;
- Google Play Billing;
- Web Payment;
- Gift/Promo, falls erlaubt;
- Refund/Chargeback;
- Trial;
- Monatsabo;
- Jahresabo.

Web- und Mobilepreise dürfen nicht blind aus Nettobeträgen verglichen werden; Plattformregeln/Steuern/Checkoutkosten berücksichtigen.

## 13. Supportkosten

Supportfälle nach Ursache:

- Account;
- Payment;
- Prayer;
- Quran/Content;
- Qibla;
- technische Fehler;
- Datenschutz;
- Premium;
- KI.

Messen:

```text
Tickets pro 1.000 MAU
Minuten pro Ticket
Kosten pro Ticket
Top-Ursachen
Self-Service-Quote
```

Religiöse Contenttickets können Fachreview benötigen und sind nicht mit technischem Standard-Support gleichzusetzen.

## 14. Kostenalarme

Für produktive Dienste Schwellen definieren:

```text
50 % Monatsbudget → Info
75 % → Warnung + Ursache
90 % → Owner-Entscheidung
100 % → Kill Switch/Limit je nach Dienst
```

Keine automatische Abschaltung kritischer Prayer-/Quran-Funktionen ohne sicheren Fallback.

## 15. Budgetregister

| Bereich | Anbieter | Budget/Monat | Alarm | Owner | Prüfdatum |
|---|---|---:|---:|---|---|
| Hosting | offen | € | € | offen | Datum |
| Backend | offen | € | € | offen | Datum |
| Monitoring | offen | € | € | offen | Datum |
| E-Mail/Push | offen | € | € | offen | Datum |
| KI | offen | € | € | offen | Datum |
| Audio/CDN | offen | € | € | offen | Datum |
| Support | offen | € | € | offen | Datum |
| Fachreview | offen | € | € | offen | Datum |

## 16. Preisfindung

Preis nicht nur aus Konkurrenz übernehmen.

Input:

- Zahlungsbereitschaft;
- Premium-Wert;
- Kostenstruktur;
- Store-/Paymentkosten;
- Churn;
- Support;
- Fachreview;
- gewünschte Marge;
- Jahresabo-Rabatt;
- regionale Preisstrategie.

Testen:

- Monats-/Jahrespräferenz;
- Trial vs. kein Trial;
- Premiumumfang;
- Preisverständlichkeit;
- Refundgründe.

## 17. LTV/CAC

Später mit echten Daten:

```text
ARPU
Gross Margin
Monthly Churn
LTV
CAC
Payback Period
```

Keine Fantasie-LTV aus zwei Wochen Beta ableiten.

Akquisekanal erst skalieren, wenn:

- Retention ausreichend;
- Tracking rechtlich/technisch sauber;
- CAC grob stabil;
- Payback akzeptabel;
- Support/Infra Wachstum aushalten.

## 18. Monatsreview

Jeden Monat:

1. MAU/Premium-MAU;
2. Umsatz netto;
3. Refunds;
4. Infra;
5. KI;
6. Audio/CDN;
7. Support;
8. Fachreview/Content;
9. Kostenalarme;
10. Forecast drei Monate;
11. auffällige Anbieterpreisänderungen;
12. Entscheidungen.

## 19. Gate

Kosten-/Profitabilitätsplanung gilt als ausreichend, wenn:

- alle fixen/variablen Kostenklassen erfasst sind;
- Szenarien 100/1k/10k/100k gerechnet werden können;
- Free- und Premiumkosten getrennt sind;
- KI/Audio eigene Budgets besitzen;
- Break-even-Formel mit echten Annahmen gefüllt ist;
- Store/Webkanäle getrennt gerechnet werden;
- Kostenalarme und Owner vorhanden sind;
- keine zeitabhängige Anbieterzahl ohne Prüfdatum im Modell steht;
- Anbieterexit als wirtschaftliches Risiko berücksichtigt ist.
