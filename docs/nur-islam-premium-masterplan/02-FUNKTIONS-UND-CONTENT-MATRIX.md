# 02 – Funktions- und Content-Matrix

Diese Matrix trennt **sichtbare Funktion**, **technische Reife** und **inhaltliche Freigabe**. Eine Funktion darf nur dann als „fertig“ gelten, wenn alle drei Ebenen passen.

## Statuslegende

- **Grün** – Kernfunktion vorhanden; Release-Härtung/Nachweis bleibt trotzdem nötig
- **Gelb** – teilweise/experimentell; produktive Quelle, Review oder Infrastruktur fehlt
- **Rot** – nicht produktiv oder nur UI/Platzhalter
- **Später** – nicht nötig für v1

## v1-Produktregel

Für den ersten öffentlichen Release gilt: **Anfängerführung und geprüfte Grundlagen haben Vorrang vor zusätzlicher Featurezahl.**

Ein Modul mit vielen Funktionen ist nicht releasebereit, wenn ein kompletter Anfänger nicht versteht, was es bedeutet, wann er es braucht oder welche Aussage fachlich geprüft wurde.

## Kernmodule

| Modul | Repo-Stand | Content-/Datenstand | v1-Priorität | Nächster Schritt |
|---|---|---|---|---|
| Home | Grün | Gebets-/Tagesdaten teilweise live | P0 | klare nächste Aktion + Anfängerstatus integrieren, echte Gerät-/Screenshot-Abnahme |
| Onboarding | Grün | Standort/Notifications erklärt | P0 | Kenntnisstand „neu / Grundlagen / erfahren“ ergänzen und Permission-Flows real testen |
| Neu-im-Islam-Pfad | Rot/neu | Grundlagen teilweise über andere Module verteilt | P0 | geführte Journey mit Reihenfolge, Fortschritt und geprüften Quellen bauen |
| Was ist Islam? | Rot/neu | einzelne Aussagen verteilt | P0 | eigenständige Anfängerlektion mit Quelle/Review |
| Shahada-Grundlage | Rot/neu | kein klarer Anfänger-Kernflow | P0 | Wortlaut, Bedeutung, Einordnung, Quelle und sensible Anfängerhinweise ergänzen |
| Fünf Säulen | Teilweise | Wissen verteilt | P0 | zentrale Grundlagenlektion erstellen und mit bestehenden Modulen verknüpfen |
| Sechs Glaubensgrundlagen | Grün/teilweise | Aqidah-Lektion vorhanden | P0 | als Anfänger-Grundlage im geführten Pfad sichtbar machen |
| Prophet Muhammad ﷺ – Einführung | Teilweise | Seerah/Propheten vorhanden | P0 | kurze geprüfte Einführungslektion vor tiefer Seerah anbieten |
| Islam-Lexikon / Begriffe | Rot/neu | Begriffe nur im Fließtext | P0 | zentrale Begriffe kontextuell und über Suche erklärbar machen |
| Anfänger-FAQ | Rot/neu | Inhalte verteilt | P0 | häufige Einstiegsfragen mit Quellen-/Unsicherheitssystem erstellen |
| Gebetszeiten | Gelb | AlAdhan live + Cache/Fallback | P0 | Methoden/Regionen/Datenschutz/Fachreview |
| Gebetstracker | Grün | lokal | P0 | Tageswechsel, Recovery, Sync-Entscheidung |
| Prayer Reminders | Gelb | nur zuverlässig bei aktiver Web/PWA | P0/P1 | native/push Strategie je Releasekanal |
| Qibla | Gelb/Grün | Berechnung + Gerätesensorpfad | P0 | reale Sensor-/Permission-/Kalibrierungstests |
| Quran-Katalog | Grün | 114 Metadaten | P0 | Quellen-/Lizenzregister |
| Quran-Reader | Gelb/Grün | 4 offline, Rest online/cache | P0 | vollständige Editions-/Offline-Entscheidung |
| Quran für Anfänger | Rot/neu | Reader vorhanden, Einführung fehlt | P0 | Sure/Ayah/Juz/Übersetzung/Tafsir erklären und Startempfehlungen verknüpfen |
| Quran-Audio | Rot | keine produktive Quelle | P1 | geprüfte Rezitations-/Lizenzquelle |
| Gebets-Aussprache-Audio | Rot/neu | Text/Transliteration vorhanden | P1 | lizenzierte/geprüfte Quelle für Al-Fatiha und zentrale Formulierungen definieren |
| Dhikr | Grün | mehrere Quellen vorhanden | P0 | fachlicher Endreview |
| Duas | Grün technisch | 34 Einträge | P0 | Einzelquellen/Fachreview vervollständigen |
| 99 Namen | Grün technisch | 99 Einträge | P0 | stabile IDs + Bedeutungs-/Schreibweisenreview |
| Kalender | Grün | Hijri-Berechnung + lokale Termine | P0 | regionale Abweichungen/Ereignisquelle |
| Wudu | Grün technisch | Lerncontent | P0 | Fiqh-Varianten/Quelle prüfen |
| Ghusl-Grundlagen | Rot/neu | kein klarer Anfängerpfad | P0 | geprüfte Grundlagenerklärung, Varianten/Sonderfälle sauber begrenzen |
| Tayammum-Grundlagen | Teilweise/neu | in Fiqh erwähnt | P0 | eigenständige kurze Anfängerlektion + Quelle/Review |
| Salah lernen | Grün technisch | Lerncontent | P0 | Fachreview, Madhhab-Hinweise, UX-Gerätetest |
| Gebetsbegriffe & Voraussetzungen | Teilweise | über Gebetskurs verteilt | P0 | Rakʿah, Fard, Sunnah, Qibla, Zeit, Reinheit und Gebetsplatz direkt erklären |
| Wissenskurse | Grün technisch | 6 Kurse/18 Lektionen laut PR | P1 | Quellenstatus pro Lektion und Anfängerreihenfolge |
| Alltagssituationen-Hub | Rot/neu | Inhalte in Dua/Sunnah/Fasten verteilt | P1 | Situationen statt Kategorien bündeln: Schlaf, Reise, Moschee, Fasten, Fehler/Reue usw. |
| Hadith-Sammlung | Gelb | Legacy-Inhalte/Quellen | P1 | vollständige geprüfte Datenbasis |
| Propheten | Gelb | Lernstruktur | P1 | Quellen-/Redaktionsreview |
| Seerah-Timeline | Rot/neu | Seerah-Lektionen vorhanden | P1 | chronologische Grundtimeline mit geprüften Kerndaten |
| 7-/30-Tage-Grundlagenplan | Rot/neu | Lernfortschritt vorhanden | P1 | Tagesplan auf bestehende Anfängerlektionen abbilden |
| Moschee-Finder | Gelb/Grün | OSM/Overpass live | P1 | Attribution, SLA, Datenschutz, Edgecases |
| Sammlungen | Grün technisch | lokale Favoriten | P1 | stabile IDs, Export, Cloud-Sync-Entscheidung |
| Profil/Einstellungen | Grün | lokal | P0 | Kenntnisstand, Account/Privacy/Export/Löschung integrieren |
| Quellen-/Reviewanzeige | Teilweise | Prüfdokument vorhanden, UI nicht überall konsistent | P0 | Status, Edition, Referenz und Varianten bei P0-Content sichtbar machen |
| KI-Assistent | Rot produktiv | UI-Demo | P2 bis Safety fertig | Backend + RAG + Quellen + Eval |

## Legacy-/Spezialmodule

| Modul | Empfehlung |
|---|---|
| Islam-Quiz | v1 nur wenn Fragen fachlich geprüft und Score-Bug ausgeschlossen; nicht vor Anfängergrundlagen priorisieren |
| Hajj & Umrah | P1/P2; als Lernhilfe, nicht als verbindliche individuelle Rechtsanweisung |
| Sunnah im Alltag | P1; Quellen je Punkt, später in Alltagssituationen-Hub integrieren |
| Fehler & Reue | P1; sensible Sprache, keine psychologische/therapeutische Behauptung |
| Fasten-Assistent | P1; lokale Berechnungen + Quellen-/Fiqh-Hinweise |
| Ummah-Weltkarte | Später, sofern keine echte Datenbasis |
| Islamische Orte | P1 als redaktioneller Lernbereich |
| Jumuah | P1; Quellen und regionale Praxis prüfen |
| Zakat | P2; keine individuelle Steuer-/Finanz-/Fatwa-Funktion ohne Fachsystem |
| Standby/Gebetsanzeige | P2; Wake Lock, Burn-in, Hintergrundverhalten testen |
| Community/Social | Später; kein v1-Blocker |

## Anfängerpfad – verpflichtender v1-Mindestumfang

Folgende Inhalte müssen vor Release fachlich geprüft, verständlich und in einer festen Reihenfolge erreichbar sein:

1. Was ist Islam?
2. Wer ist Allah?
3. Shahada – Wortlaut und Bedeutung.
4. Wer war Prophet Muhammad ﷺ?
5. Was ist der Quran?
6. Quran, Sunnah und Hadith grundlegend einordnen.
7. Die fünf Säulen.
8. Die sechs Glaubensgrundlagen.
9. Wudu.
10. Ghusl-Grundlagen.
11. Tayammum-Grundlagen.
12. Warum Muslime beten.
13. Die fünf Pflichtgebete.
14. Gebetszeit und Qibla.
15. Was ist eine Rakʿah?
16. Al-Fatiha und zentrale Gebetsformulierungen mit Bedeutung.
17. Quran als Anfänger benutzen.
18. Wichtige Alltags-Duas/Dhikr.
19. Zentrale Begriffe: halal, haram, fard, sunnah, dua, dhikr, fiqh, aqidah, tafsir, seerah.
20. Wie mit legitimen Meinungsunterschieden und individuellen Sonderfällen umgegangen wird.

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

Für P0-Anfängerinhalte zusätzlich:

```text
beginner_level
prerequisites
next_recommended_content_id
glossary_terms
safety_or_variant_note
```

## Content-Kategorien und Mindeststandard

### Quran

- arabischer Text aus definierter Edition;
- Übersetzung/Bedeutung klar benennen;
- Übersetzungsrechte dokumentieren;
- keine sinngemäße Eigenfassung als etablierte Übersetzung ausgeben;
- Ayah-/Suren-Zuordnung automatisiert prüfen;
- Änderungen versionieren;
- Anfänger müssen verstehen, was Sure, Ayah, Juz, Übersetzung/Bedeutung und Tafsir sind.

### Hadith

- Sammlung/Werk;
- Nummer/Referenz;
- Authentizitäts-/Bewertungsinformation, soweit belastbar und relevant;
- Original/Übersetzung sauber trennen;
- Kontextwarnung bei verkürzten Aussagen;
- keine frei generierten Hadith-Zitate.

### Dua/Dhikr

- arabischer Text;
- Transliteration optional, für Anfänger bei zentralen Texten empfohlen;
- deutsche Bedeutung;
- Quelle;
- Häufigkeit/Zahl nur behaupten, wenn Quelle sie trägt;
- Varianten sichtbar machen.

### Fiqh/Lernen

- Grundregel vs. Rechtsschulunterschied kennzeichnen;
- keine „einzig richtige“ Darstellung bei legitimen Unterschieden;
- strittige Detailfragen an Fachperson verweisen;
- Lernvereinfachung als solche kenntlich machen;
- Anfänger dürfen nicht mit Sonderfällen überladen werden, müssen aber erkennen, dass Sonderfälle existieren.

### Gebet/Reinheit

- Pflichtanteile, Lernvereinfachungen und Varianten sauber trennen;
- arabischen Wortlaut, Transliteration und deutsche Bedeutung nicht vermischen;
- Ghusl/Tayammum nicht als pauschale Ein-Satz-Regel für alle Sonderfälle darstellen;
- bei Gebetsmethoden und Fiqh-Details Variantenhinweise vorsehen;
- praktische Lernschritte müssen fachlich gegen die zugrunde liegende Quelle geprüft werden.

### 99 Namen Allahs

- stabile numerische ID;
- arabische Schreibweise;
- Transliteration;
- deutsche Bedeutung;
- Reihenfolge/Quelle/Redaktionsstandard dokumentieren;
- keine Favoriten-ID nur über möglicherweise doppelte lateinische Namen.

## Harte Release-Gates für religiösen P0-Content

Ein religiöser P0-Inhalt darf nicht als releasebereit markiert werden, wenn einer dieser Punkte fehlt:

- konkrete Quelle/Referenz oder dokumentierte fachliche Grundlage;
- klarer Reviewstatus;
- eindeutige Trennung zwischen Original, Übersetzung und eigener Zusammenfassung;
- Kennzeichnung relevanter Varianten/Meinungsunterschiede;
- verständliche Sprache für Nutzer ohne Vorwissen;
- keine erfundene Gewissheit bei ungeprüften oder individuellen Fragen.

Offene P0-Reviewpunkte sind **Release-Blocker**, nicht bloß spätere Verbesserungen.

## Release-Regel pro Modul

Ein Modul ist releasebereit, wenn:

- Navigation funktioniert;
- Anfänger verstehen, wofür das Modul da ist und wie sie weiterkommen;
- Empty/Loading/Error/Offline vorhanden;
- Persistenz robust ist;
- Contentquelle dokumentiert ist;
- Fachreviewstatus erfüllt ist;
- zentrale Fachbegriffe erklärt sind;
- Accessibility geprüft ist;
- Telemetrie nur nötige Daten enthält;
- Datenschutz-/Anbieterfluss dokumentiert ist;
- automatisierte und reale Tests existieren;
- keine Demo-Aktion echten Produktstatus vortäuscht.
