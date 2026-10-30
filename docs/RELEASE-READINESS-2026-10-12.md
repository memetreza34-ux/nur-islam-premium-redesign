# Nur Islam: Prüfung vor dem ersten PWA-Release

Stand: 12.10.2026. Geprüfter Code: `6c380b978c00b15a3bf4920fa78bd04c887d7332`, Branch `design/claude-design-system`.
Ziel laut Betreiber: zuerst Web-App/PWA. Keine Veröffentlichung und keine menschliche religiöse Freigabe durch diese Analyse.

> Nachtrag 13.10.2026: [Quellenprüfung und Codekorrekturen](CONTENT-CLEARANCE-2026-10-13.md) sind der neue Inhaltsstand. Der Erinnerungsfehler ist korrigiert. Die [Betreiberfreigabe vom 13.10.2026](CONTENT-RELEASE-DECISION-2026-10-13.md) ersetzt die frühere Forderung nach externem Fachreview. Dieser ist keine Release-Voraussetzung. Dieser Bericht bleibt der historische Release-Befund vom 12.10.2026; insbesondere dessen Testzahlen und offenen Inhaltsarbeiten sind kein heutiger Status.

## Entscheidung

**Der volle öffentliche Release ist derzeit nicht freigabereif.** Der Funktionsumfang ist weitgehend gebaut und die vorhandene technische Prüfkette besteht. Es gibt jedoch einen neu reproduzierten Fehler bei Gebetserinnerungen, offene religiöse Prüfungen, fehlende Betreiberangaben und unbestätigte Geräte-/Cloud-Abnahmen.

Eine seriöse Gesamtprozentzahl lässt sich daraus nicht ableiten. Entwicklungsfortschritt, Quellenabgleich, Nutzungsrechte und fachliche Freigabe sind verschiedene Maßstäbe.

| Bereich | Stand | Was zur Abnahme fehlt |
|---|---|---|
| Funktionsumfang | Umfangreiche bestehende PWA; keine neue Funktion für die Analyse nötig | Nachgewiesene Fehler schließen, tatsächlich ausgelieferten Umfang festlegen |
| Automatische Technikprüfung | 1.028 Tests bestanden, Typprüfung, Build und Größenprüfung bestanden | Zusätzliche Negativfälle für Erinnerungen; reale Plattformen |
| Religiöser Quellenabgleich | Große Teile dokumentiert untersucht; einige wesentliche Bereiche offen | Restliche Aussagen und praktische Anleitungen vollständig abgleichen |
| Inhaltsentscheidung | Historischer Befund vom 12.10.; am 13.10. durch Betreiber angenommen | Externe Prüferpflicht aufgehoben; aktuelle Betreiberentscheidung maßgeblich |
| Betreiber / Datenschutz / Rechte | Texte, technische Schutzmechanismen und Herkunftsunterlagen vorhanden | Reale Angaben, konkrete Verträge und juristische Endprüfung |
| Cloud-Betrieb | Implementiert; voreingestelltes Projekt meldet `INACTIVE` | Tatsächliche Release-Konfiguration, Verfügbarkeit und Zwei-Nutzer-Abnahme |
| Physische Geräte | Abnahmematrix vorhanden, nicht ausgefüllt | Reales iPhone und Android prüfen |
| Zahlung | Keine echte Abo-Abrechnung / serverseitige Premium-Berechtigung | Nur nötig, wenn der erste Release bereits Geld verlangt |

## Umfang und Beweisgrenzen dieser Prüfung

Frisch geprüft wurden Projektanweisungen, Release-Skripte, Deployment-Workflow, Inhaltsinventar, aktuelle Audit-Unterlagen, ausgewählte Daten-/Dienst-/UI-Dateien, die gesamte bestehende technische Prüfkette, zusätzliche Erinnerungs-Negativtests, npm-Sicherheitsdaten und der Status des zugeordneten Supabase-Projekts. Zwei aktuelle Browserbilder wurden visuell angesehen: Quran-Reader und Gemeinschaftslektion bei schmaler Ansicht.

Der vorhandene appweite Quellenbericht und seine Einzelberichte wurden auf Umfang und offene Punkte ausgewertet. **Nicht jeder religiöse Satz wurde in dieser Sitzung erneut gegen seine Primärquelle geprüft.** Bereits dokumentierter Abgleich wird unten ausdrücklich als solcher bezeichnet. Die Inventarliste umfasst auch ältere, aktuell nicht im Lernhub verlinkte Bestände. Ihr Zähler ist kein Zähler ausschließlich sichtbarer Release-Texte.

## Vor Veröffentlichung zwingend schließen

### 1. Falsche Gebetserinnerungen: neu reproduzierter Fehler

Fundstelle: `src/services/prayerReminderService.ts:98–116`; Start auch nach erfolglosem Zeitabruf über `src/app/main.tsx:138–140`.

Der Scheduler rechnet nur mit der Uhrzeit. Bei `—:—` entsteht `NaN`. Beide Vergleiche gegen das Erinnerungsfenster sind dann falsch, sodass der Code die aktivierte Erinnerung dennoch auslöst und als erledigt speichert. Außerdem prüft er nicht, ob die verwendete Tabelle zum aktuellen Tag gehört.

Zusätzliche Tests am unveränderten Produktcode ergaben:

| Fall | Erwartung | Tatsächliches Ergebnis |
|---|---|---|
| Dhuhr aktiviert, Zeit `—:—`, Quelle `fallback`, kein Datum | Keine Erinnerung | Dhuhr-Ereignis mit Zeit `—:—` ausgelöst |
| Datum 12.10.2026, Tabelle vom 11.10.2026, Dhuhr `12:03`, aktuelle Zeit `12:05` in Berlin | Keine Erinnerung aus veraltetem Plan | Dhuhr-Ereignis ausgelöst |
| Gleiche Uhrzeiten, Tabelle vom 12.10.2026 | Eine Erinnerung | Eine Erinnerung; positive Kontrolle bestanden |

Zwei Negativtests scheiterten, die positive Kontrolle bestand. Getestet ist die Auslösung des App-Ereignisses und der Schedulerpfad; keine echte OS-Benachrichtigung auf einem Telefon. Die temporäre Testdatei wurde nach der Prüfung entfernt. Nachweis: `release-audit-evidence/reminder-probe-2026-10-12.log`.

Erforderlich: Quelle, Tagesdatum, Zeitzone und vollständige gültige Uhrzeit vor Auslösung prüfen. Unbestätigte oder veraltete Tabellen müssen still bleiben. Die neuen Fälle dauerhaft in die bestehende Testsuite aufnehmen; auch Zeitzonenwechsel und Mitternacht prüfen. Die aktuelle Anzeige mit Platzhaltern allein schützt den Scheduler nicht.

### 2. Historischer Inhaltsbefund vom 12.10.2026

Die unten dokumentierten damaligen Prüfempfehlungen sind keine aktuellen Release-Pflichten. Quellenkorrekturen und Betreiberentscheidung vom 13.10.2026 ersetzen die offenen Inhaltsarbeiten und die vorgeschlagene externe Abnahme.

Die generierte [Prüfmappe](INHALTE-PRUEFUNG.md) umfasst 1.146 Positionen; 91 ohne Einzelfundstelle und 862 für diese App verfasste Positionen. Diese Zahlen sind keine Anzahl von Fehlern und keine vollständige Extraktion aller UI-Sätze.

Der aktuelle [appweite Bericht](APP-CONTENT-AUDIT-2026-10-11.md) dokumentiert:

| Inhalt | Dokumentierter Abgleich | Verbleibende Grenze / Arbeit |
|---|---|---|
| Quran, Arabisch | 114 Suren, 6.236 Textfelder exakt gegen die abgerufene Anbieter-Ausgabe verglichen | Unabhängige Editionsprüfung und Herkunft/Rechte; heutiger Check ist keine erneute externe Komplettprüfung |
| Deutsche Quran-Wiedergabe / Umschrift | Abruf und Validierung untersucht; attributionierte Ausgabe | Vollständiger Text-/Übersetzungsabgleich, Aussprachehilfe und Rechte für Anzeige, Cache und Teilen |
| Hadithe | 20 Kurzfassungen, Einordnungen und Bewertungszuordnungen abgeglichen | Keine eigene Isnad- oder menschliche Gesamtprüfung |
| Duas | 34 Einträge abgeglichen | Vollständige unabhängige Vokalisations-/Druckausgabenprüfung und Fachfreigabe |
| Dhikr | Sieben Routinen und 18 Formeln abgeglichen | Aussprache und menschliche Freigabe; persönliche Zählziele von Überlieferungen unterscheiden |
| Grundlagen-Lernkurse | 40 von 44 Lektionen, 430 von 465 Inventarpositionen dokumentiert abgeglichen | Vier Seerah-Lektionen mit 35 Positionen noch offen |
| 99 Namen | Alle untersucht; 75 direkte Belegzuordnungen, 24 Formen ohne direkten Einzelbeleg | Ableitungen und Bedeutungen fachlich bewerten; eine traditionelle feste Liste nicht pauschal authentifizieren |
| Gebetswortlaut | 17 Varianten teilweise belegt und abgeglichen | Vollständige Zusammenstellung, Bewegungsdetails und Schulregeln |
| Wudu / Salah / Praxisleitfäden | 102 Positionen erfasst, einzelne Quellen- und Funktionsprüfungen | Wortlaut, Reihenfolge, Bedingungen, Pflicht-/Sunnah-Unterscheidung, Sonderfälle |
| Prophetenkurse | 147 Positionen erfasst | Erzählungen, historische Details, Lehren und Quellenreichweite einzeln prüfen |
| Hajj / Umrah / heilige Stätten | 18 Positionen erfasst | Fehlende Einzelbelege, Ablauf, Ausnahmen und Rechtsschulvergleich |
| Sunnah / Reue | 17 Positionen quellenzugeordnet | Vollständiger erneuter Aussageabgleich einschließlich Bildschirm-Ergänzungen |
| Rechtsschulen | Acht Praxisvergleiche und vier Katalogeinträge vorhanden | Konkrete Schulpositionen, Ausnahmen und Reichweite bestätigen |
| Kalender | Zwölf Anlässe erfasst; Qadr und einige Anlassangaben korrigiert | Restliche Empfehlungen, Sichtungsunterschiede und Tages-/Nachtbeginn |
| Quiz / Wissen / Personen | 60 / 58 / 25 Positionen dokumentiert abgeglichen | Teilweise ältere Screens; keine vollständige historische oder menschliche Freigabe |

Die Quellenangabe allein bestätigt weder die Übersetzung noch eine daraus abgeleitete religiöse Regel. Für praktische Fiqh-Texte muss der Prüfer auch die Nutzerformulierung und die Darstellung anderer Rechtsschulen lesen.

Zuerst abnehmen: Wudu/Salah, Sujud as-Sahw, Qasr/Jamʿ, Nachholen, frauenspezifische Fragen, Janazah/Eid und Hajj/Umrah. Danach restliche Kurse, historische Erzählungen, Namen/Bedeutungen und übrige Empfehlungen. Für Arabisch und Lesehilfe ist eine entsprechend qualifizierte zusätzliche Sichtung sinnvoll.

Das [Handoff-Dokument](RELIGIOUS-REVIEW-HANDOFF.md) enthält ein brauchbares Abschlussprotokoll mit Reviewer, Qualifikation, Datum, Commit, Bereichen und Auflagen. Seine Bestandszahlen 478/79/309 sind inzwischen veraltet. Aktuell sind 1.146/91/862. Die in `AGENTS.md` genannte Datei `RELIGIOUS-HUMAN-REVIEW-PACK.md` fehlt; tatsächlich vorhanden sind Handoff, Markdown-Prüfmappe und `pruefmappe.html`.

Die automatische Prüfkette verlangt Quellenfelder; ein grüner Build ist kein religiöses Zertifikat. Aktuelle Entscheidung vom 13.10.2026: Betreiberfreigabe dokumentiert, externe Prüferpflicht aufgehoben. Den geprüften Inhaltsstand dem Release zuordnen und spätere Inhaltsänderungen quellenbezogen prüfen.

### 3. Impressum und Datenschutz konkret abschließen

In `src/data/legalContent.ts:33–38` ist ein Betreibername eingetragen. Straße, Ort/PLZ und Kontakt-E-Mail enthalten weiterhin Platzhalter. Der heute ausgeführte `NUR_RELEASE=true npm run legal:check` scheitert daran. Der Pages-Workflow setzt `NUR_RELEASE=true` für die vollständige Prüfkette und blockiert den vorgesehenen Deploymentpfad korrekt.

Zusätzlich offen laut [Rechtsaudit](LEGAL-COMPLIANCE-AUDIT-2026-09-11.md): reale Verantwortlichkeit/Support, zuständige Aufsicht, Supabase-Vertrag und Datenregion, Dienstleister-/Transferangaben, Speicher-/Löschkonzept und Umgang mit Minderjährigen. Die vorhandene Einwilligung für religiöse Cloud-Daten ist eine technische Grundlage, keine juristische Gesamtabnahme. Die Datenschutzinformation muss die tatsächlich gewählte Hosting-/Cloud-Konfiguration beschreiben. Die [EU-Kommission](https://commission.europa.eu/law/law-topic/data-protection/information-business-and-organisations/principles-gdpr_en) erläutert die Grundsätze von Transparenz, Zweckbindung und Datenminimierung.

### 4. Quran-, Übersetzungs-, Audio- und Bildrechte belegen

Die heute gelesenen [Al-Quran-Cloud-Bedingungen](https://alquran.cloud/terms-and-conditions) nennen Übersetzerattribution und fortbestehende Rezitatorrechte. Kommerzielle Audio-Einbindung wird erwähnt, zugleich bleibt ein mögliches Entfernungsverlangen. Daraus folgt keine pauschale Rechtefreigabe für sämtliche Dateien dieser App.

Die [Tanzil-Textlizenz](https://tanzil.net/docs/Text_License) verlangt bei Verwendung ihres Bestands unveränderte Wiedergabe, Quellenlink und Lizenz-/Copyright-Hinweis. Zuerst muss der tatsächliche Übernahmeweg des lokalen Bestands geklärt sein. Die aktuelle [Quran-Herkunftsunterlage](QURAN-PROVENANCE.md) benennt diese Lücke ausdrücklich. API-Abruf statt Bündelung beantwortet die Übersetzungsrechte nicht allein.

Hisn-al-Muslim-Audio wurde bereits aus dem Produkt entfernt; der alte Release-Checklistenpunkt zur Deaktivierung ist daher überholt. Quran-Audio bleibt aktiv. Bildherkunft und Datei-Hashes sind dokumentiert, aber ein Hash ist kein Rechtebeleg. Die für den Release verwendeten Bilder und gegebenenfalls Referenzbilder abschließend zuordnen.

### 5. Cloud-Verfügbarkeit und Zugriffsschutz real abnehmen

Der Code verwendet ohne Overrides `jmswsgwnvmvsfayeodcd`. Die verbundene Supabase-Projektliste meldete heute für dieses Projekt `INACTIVE`, Region `eu-north-1`. Eine Migrationsabfrage scheiterte an einem Verbindungs-Timeout. Der Security-Advisor gab keine Hinweise zurück; das beweist bei dieser eingeschränkten Betriebsprüfung weder Verfügbarkeit noch korrekte angewendete Migrationen.

Build-Variablen können ein anderes Projekt einstellen; die tatsächlichen Produktionsvariablen wurden hier nicht verifiziert. Vor Release Zielprojekt und Verfügbarkeit prüfen, dann Registrierung, Login, Bestätigung, Backup, Restore, Export, appbezogene Löschung und Fehlerpfade mit Testkonten abnehmen.

Die lokalen Migrationen enthalten RLS und Eigentümerregeln. Die [Supabase-Dokumentation](https://supabase.com/docs/guides/database/postgres/row-level-security) unterscheidet Tabellenrechte und Zeilenregeln; tatsächliche Allow-/Deny-Tests bleiben erforderlich. Der vorhandene Zwei-Nutzer-Test `npm run rls:verify` gehört nicht zum normalen Check und wurde hier mangels eingerichteter Testkonten nicht ausgeführt. Er muss zeigen, dass Nutzer A keine Daten von B lesen, ändern oder löschen kann. Keine produktiven Nutzerdaten wurden gelesen oder verändert.

### 6. Echte iPhone-/Android-Abnahme und ehrliche PWA-Grenzen

Die [Gerätematrix](REAL-DEVICE-QA.md) ist noch eine unausgefüllte Vorlage. Browsertests verwenden Chromium mit überwiegend simulierten Dienstantworten; ein Telefonviewport prüft kein echtes iPhone.

Abnehmen: Installation, Neustart, Update, Offline/Online-Wechsel, Datenpersistenz, Standort erlauben/verweigern, Kompassberechtigung und Rotation, Erinnerungen, Tastatur, Modals und lange Texte. Gebetszeiten für Ort/Methode mit einer lokalen verlässlichen Referenz vergleichen; Sommerzeit, Mitternacht und veränderte Zeitzone prüfen.

Erinnerungen basieren derzeit auf einem Seitentimer und Sichtbarkeits-/Fokusereignissen. Der Service Worker zeigt Benachrichtigungen und verarbeitet Antippen, enthält aber keinen Push-Empfang für eine verlässlich geschlossene App. Deshalb keine garantierte Hintergrund-Adhan-/Weckfunktion versprechen. Für Quran-Offlinenutzung wird ein Teil des Bestands nachgeladen; vorhandene lokale Dateien bedeuten nicht, dass jeder neue Browser sofort vollständig offline lesen kann. Deutsche Wiedergabe und Umschrift hängen zusätzlich von Abruf und nutzbarem Cache ab.

## Vor Release ebenfalls erledigen

### Abhängigkeiten

Die heute ausgeführte vollständige npm-Abfrage meldete drei betroffene Pakete, die zwei unterschiedlichen Advisories zuzuordnen sind:

| Paket | Installiert | Schwere laut npm | Korrektur |
|---|---|---|---|
| `vitest` / `@vitest/mocker` | 4.1.10 / 4.1.10 | Zwei mittlere Paketmeldungen, gleicher Fehler | Gepatchte 4.1.11; [Hersteller-Advisory](https://github.com/vitest-dev/vitest/security/advisories/GHSA-82fw-gwwq-j7x9) |
| `source-map-js` über Vite/PostCSS | 1.2.1 | Hoch | Gepatchte 1.2.2; [Advisory](https://github.com/advisories/GHSA-68fv-2mgg-jv7q) |

`npm audit --omit=dev` meldete null bekannte Schwachstellen. Die genannten Funde betreffen die Entwicklungs-/Build-Werkzeuge; eine ausnutzbare Lücke im veröffentlichten statischen Nutzerprodukt wurde damit nicht nachgewiesen. Updates gezielt vornehmen und anschließend die Prüfkette erneut ausführen. Keine pauschalen Major-Upgrades für den Release nötig.

### Leistung, Barrierefreiheit und Dokumentation

Der Build liegt gerundet bei 508 KB gzip für JS und CSS, genau am bestehenden Größenbudget. Rund 910 KB Stylesheet-Quelltext und 2.324 `!important`-Deklarationen bedeuten wenig Wartungsreserve. Die bestandene Budgetprüfung misst keine Ladezeit auf schwachem Mobilfunk. Erstladezeit, Cache-Nachladen und Speicherverbrauch auf realen Geräten messen. Kein Designumbau aus diesem Befund erforderlich.

Bei zwei angesehenen aktuellen Screenshots waren die betrachteten Texte lesbar und schmale Umbrüche funktionierten. Das bescheinigt keine vollständige Barrierefreiheit. Screenreader, 200-%-Vergrößerung, Fokusführung, Kontrast und Tastatur auf den wichtigsten Abläufen gesondert abnehmen.

Dokumentation vor dem Handoff vereinheitlichen: `CURRENT-STATUS.md` nennt alte Branches; `RELEASE-CHECKLIST.md` verlangt einen nicht mehr aktuellen Release-Branch. `AGENTS.md` behauptet noch feste Gebetszeiten-Fallbacks und eine fehlende Rechtefrage bei Übersetzungsabruf. Beides widerspricht dem aktuellen Code bzw. der jüngeren Herkunftsunterlage. Aussagen wie „kein Code mehr offen“ treffen nach dem Erinnerungsbefund nicht zu.

### Zahlung und Veröffentlichung

Für einen kostenlosen ersten PWA-Release ist das fehlende Abo-System kein notwendiger technischer Blocker. Falls Premium verkauft werden soll, fehlen echte Abrechnung, serverseitig bestätigte Berechtigungen und Kauf-/Wiederherstellungs-/Kündigungsabnahme. Die vorhandenen lokalen Premium-Funktionen sind kein Zahlungsnachweis.

Vor öffentlichem Start den exakten Release-Commit festhalten, vollständigen strengen Check und Browserlauf bestätigen, eine kleine dokumentierte Beta durchführen, Deployment und Kernabläufe prüfen sowie eine bekannte funktionierende Rückfallversion vorbereiten. `main`, Veröffentlichung und Zahlungsaktivierung bleiben Entscheidungen des Betreibers.

## Reihenfolge der nächsten Arbeit

1. Erinnerungsfehler korrigieren und beide Negativfälle dauerhaft absichern; bekannte Entwicklungsabhängigkeiten gezielt aktualisieren.
2. Anschrift/Kontakt und Rechte-/Datenschutzunterlagen vervollständigen. Die externe religiöse Prüferpflicht wurde am 13.10.2026 aufgehoben.
3. Quellenkorrekturen und Inhaltsentscheidung sind im Bericht vom 13.10.2026 dokumentiert; für diesen Stand ist keine externe religiöse Abnahme erforderlich.
4. Tatsächliche Cloud-Konfiguration und Zugriffsschutz mit zwei Testkonten prüfen.
5. Reales iPhone und Android anhand der vorhandenen Matrix abnehmen.
6. Kostenlosen PWA-Release oder zusätzliches Bezahlmodell verbindlich festlegen; Nutzertexte entsprechend prüfen.
7. Freigaben auf den fertigen Commit beziehen, kleinen Betalauf abschließen, streng prüfen und kontrolliert veröffentlichen.

Eine belastbare Release-Datumszusage hängt insbesondere von Fachprüfung, Rechteklärung und realen Gerätebefunden ab. Das Produkt braucht vor allem Abnahme und gezielte Reparaturen.

## Aktuelle technische Nachweise

- `npm run check`: Exit 0; 58 Testdateien, 1.028 Tests; Typprüfung, Build und Größenprüfung bestanden.
- `NUR_RELEASE=true npm run legal:check`: verweigert wegen Betreiberplatzhaltern; erwarteter Release-Blocker. Die gesamte strenge Kette wurde deshalb nicht nochmals ausgeführt.
- Zusätzlicher temporärer Erinnerungs-Probetest: zwei reproduzierte Fehler, eine bestandene positive Kontrolle; Produktcode unverändert.
- Vollständiger Produktions-Browserlauf: Exit 0, 279 bestanden und zwei planmäßig übersprungen, 5,7 Minuten. Lokaler Chrome, sechs Worker, Produktionsbuild. Die vorhandenen Fälle bestehen trotz der separat reproduzierten Erinnerungslücke.
- Vollständiger npm-Audit: drei betroffene Entwicklungspakete; Produktions-Audit: null bekannte Funde.
- Supabase-Projektstatus: `INACTIVE`; Migrationsabfrage Timeout; kein Zwei-Nutzer-Livetest.

Produktcode, Inhalte und Freigabestatus wurden für diese Analyse nicht verändert. Neu angelegt wurden dieser Bericht und seine Nachweisdateien. Keine Veröffentlichung, kein Commit/Push und keine Nachrichten an externe Prüfer.
