# 02 – Funktions- und Content-Matrix

Diese Matrix trennt **sichtbare Funktion**, **technische Reife** und **inhaltliche Freigabe**. Eine Funktion darf nur dann als „fertig“ gelten, wenn alle drei Ebenen passen.

## Statuslegende

- **Grün** – Kernfunktion vorhanden; Release-Härtung/Nachweis bleibt trotzdem nötig
- **Gelb** – teilweise/experimentell; produktive Quelle, Review oder Infrastruktur fehlt
- **Rot** – nicht produktiv oder nur UI/Platzhalter
- **Später** – nicht nötig für v1

## Kernmodule

| Modul | Repo-Stand | Content-/Datenstand | v1-Priorität | Nächster Schritt |
|---|---|---|---|---|
| Home | Grün | Gebets-/Tagesdaten teilweise live | P0 | echte Gerät-/Screenshot-Abnahme |
| Onboarding | Grün | Standort/Notifications erklärt | P0 | Permission-Flows real testen |
| Gebetszeiten | Gelb | AlAdhan live + Cache/Fallback | P0 | Methoden/Regionen/Datenschutz/Fachreview |
| Gebetstracker | Grün | lokal | P0 | Tageswechsel, Recovery, Sync-Entscheidung |
| Prayer Reminders | Gelb | nur zuverlässig bei aktiver Web/PWA | P0/P1 | native/push Strategie je Releasekanal |
| Qibla | Gelb/Grün | Berechnung + Gerätesensorpfad | P0 | reale Sensor-/Permission-/Kalibrierungstests |
| Quran-Katalog | Grün | 114 Metadaten | P0 | Quellen-/Lizenzregister |
| Quran-Reader | Gelb/Grün | 4 offline, Rest online/cache | P0 | vollständige Editions-/Offline-Entscheidung |
| Quran-Audio | Rot | keine produktive Quelle | P1 | geprüfte Rezitations-/Lizenzquelle |
| Dhikr | Grün | mehrere Quellen vorhanden | P0 | fachlicher Endreview |
| Duas | Grün technisch | 34 Einträge | P0 | Einzelquellen/Fachreview vervollständigen |
| 99 Namen | Grün technisch | 99 Einträge | P0 | stabile IDs + Bedeutungs-/Schreibweisenreview |
| Kalender | Grün | Hijri-Berechnung + lokale Termine | P0 | regionale Abweichungen/Ereignisquelle |
| Wudu | Grün technisch | Lerncontent | P0 | Fiqh-Varianten/Quelle prüfen |
| Salah lernen | Grün technisch | Lerncontent | P0 | Fachreview, Madhhab-Hinweise, UX-Gerätetest |
| Wissenskurse | Grün technisch | 6 Kurse/18 Lektionen laut PR | P1 | Quellenstatus pro Lektion |
| Hadith-Sammlung | Gelb | Legacy-Inhalte/Quellen | P1 | vollständige geprüfte Datenbasis |
| Propheten | Gelb | Lernstruktur | P1 | Quellen-/Redaktionsreview |
| Moschee-Finder | Gelb/Grün | OSM/Overpass live | P1 | Attribution, SLA, Datenschutz, Edgecases |
| Sammlungen | Grün technisch | lokale Favoriten | P1 | stabile IDs, Export, Cloud-Sync-Entscheidung |
| Profil/Einstellungen | Grün | lokal | P0 | Account/Privacy/Export/Löschung integrieren |
| KI-Assistent | Rot produktiv | UI-Demo | P2 bis Safety fertig | Backend + RAG + Quellen + Eval |

## Legacy-/Spezialmodule

| Modul | Empfehlung |
|---|---|
| Islam-Quiz | v1 nur wenn Fragen fachlich geprüft und Score-Bug ausgeschlossen |
| Hajj & Umrah | P1/P2; als Lernhilfe, nicht als verbindliche individuelle Rechtsanweisung |
| Sunnah im Alltag | P1; Quellen je Punkt |
| Fehler & Reue | P1; sensible Sprache, keine psychologische/therapeutische Behauptung |
| Fasten-Assistent | P1; lokale Berechnungen + Quellen-/Fiqh-Hinweise |
| Ummah-Weltkarte | Später, sofern keine echte Datenbasis |
| Islamische Orte | P1 als redaktioneller Lernbereich |
| Jumuah | P1; Quellen und regionale Praxis prüfen |
| Zakat | P2; keine individuelle Steuer-/Finanz-/Fatwa-Funktion ohne Fachsystem |
| Standby/Gebetsanzeige | P2; Wake Lock, Burn-in, Hintergrundverhalten testen |

## Content-Typen

Jeder Content-Eintrag braucht mindestens:

```text
content_id
content_type
arabic_original
translation_or_summary
translation_type
source_title
source_reference
source_url_or_bibliographic_reference
edition
language
review_status
reviewer_or_review_process
last_reviewed
notes_on_variants
```

## Content-Kategorien und Mindeststandard

### Quran

- arabischer Text aus definierter Edition;
- Übersetzung/Bedeutung klar benennen;
- Übersetzungsrechte dokumentieren;
- keine sinngemäße Eigenfassung als etablierte Übersetzung ausgeben;
- Ayah-/Suren-Zuordnung automatisiert prüfen;
- Änderungen versionieren.

### Hadith

- Sammlung/Werk;
- Nummer/Referenz;
- Authentizitäts-/Bewertungsinformation, soweit belastbar und relevant;
- Original/Übersetzung sauber trennen;
- Kontextwarnung bei verkürzten Aussagen;
- keine frei generierten Hadith-Zitate.

### Dua/Dhikr

- arabischer Text;
- Transliteration optional;
- deutsche Bedeutung;
- Quelle;
- Häufigkeit/Zahl nur behaupten, wenn Quelle sie trägt;
- Varianten sichtbar machen.

### Fiqh/Lernen

- Grundregel vs. Rechtsschulunterschied kennzeichnen;
- keine „einzig richtige“ Darstellung bei legitimen Unterschieden;
- strittige Detailfragen an Fachperson verweisen;
- Lernvereinfachung als solche kenntlich machen.

### 99 Namen Allahs

- stabile numerische ID;
- arabische Schreibweise;
- Transliteration;
- deutsche Bedeutung;
- Reihenfolge/Quelle/Redaktionsstandard dokumentieren;
- keine Favoriten-ID nur über möglicherweise doppelte lateinische Namen.

## Release-Regel pro Modul

Ein Modul ist releasebereit, wenn:

- Navigation funktioniert;
- Empty/Loading/Error/Offline vorhanden;
- Persistenz robust ist;
- Contentquelle dokumentiert ist;
- Fachreviewstatus erfüllt ist;
- Accessibility geprüft ist;
- Telemetrie nur nötige Daten enthält;
- Datenschutz-/Anbieterfluss dokumentiert ist;
- automatisierte und reale Tests existieren;
- keine Demo-Aktion echten Produktstatus vortäuscht.
