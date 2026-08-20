# 02 – Funktions- und Content-Matrix

Diese Matrix trennt **sichtbare Funktion**, **technische Reife** und **inhaltliche Freigabe**. Eine Funktion darf nur dann als „fertig“ gelten, wenn alle drei Ebenen passen.

## Statuslegende

- **Grün technisch** – Funktion ist implementiert und durch technische Checks abgesichert; fachliche oder reale Geräteabnahme kann trotzdem offen sein.
- **Review offen** – technisch vorhanden, aber religiöser/redaktioneller Endreview fehlt. Für P0 ist das ein Release-Blocker.
- **Gelb** – teilweise/experimentell; produktive Quelle, Geräteabnahme oder Infrastruktur fehlt.
- **Rot** – nicht produktiv oder nur UI/Platzhalter.
- **Später** – bewusst nicht für v1 vorgesehen.

## v1-Produktregel

Für den ersten öffentlichen Release gilt: **Anfängerführung und geprüfte Grundlagen haben Vorrang vor zusätzlicher Featurezahl.**

Ein Modul mit vielen Funktionen ist nicht releasebereit, wenn ein kompletter Anfänger nicht versteht, was es bedeutet, wann er es braucht oder welche Aussage fachlich geprüft wurde.

Für religiöse P0-Inhalte gilt zusätzlich der zentrale Freigabeumfang aus:

```text
src/data/v1ReligiousReleaseScope.ts
```

Der finale Merge nach `main` wird durch `scripts/check-v1-religious-release-approval.mjs` blockiert, solange ein dort definierter P0-Inhaltsblock noch nicht dokumentiert freigegeben ist. Der Prozess ist in `docs/V1-RELIGIOUS-RELEASE-GATE.md` beschrieben.

## Kernmodule – aktueller Stand des v1-Branches

| Modul | Technischer Stand | Content-/Datenstand | v1-Priorität | Release-Status / nächster Schritt |
|---|---|---|---|---|
| Home | Grün technisch | Gebete, Quran-Fortschritt, Dhikr, tägliche Inhalte; Anfängerpersonalisierung | P0 | Anfänger sehen nächste Grundlage + 0–10-Fortschritt; reale Geräte-/Screenshot-Abnahme bleibt |
| Onboarding | Grün technisch | Kenntnisstand `beginner / familiar / experienced`, Standort/Notifications | P0 | Knowledge-Level integriert; Permission-Flows auf echten Geräten testen |
| Neu-im-Islam-Pfad | Grün technisch | 10 strukturierte Grundlagenlektionen | P0 | **Review offen** – alle 10 Lektionen stehen im Religious Release Gate |
| Was ist Islam? | Grün technisch | eigene Lektion + Quellen | P0 | **Review offen** |
| Wer ist Allah? | Grün technisch | eigene Lektion + Quellen | P0 | **Review offen** |
| Shahada-Grundlage | Grün technisch | Bedeutung, Einordnung, Quellen, sensible Hinweise | P0 | **Review offen** |
| Fünf Säulen | Grün technisch | eigene Grundlagenlektion | P0 | **Review offen** |
| Sechs Glaubensgrundlagen | Grün technisch | eigene Grundlagenlektion + Hadith Jibril | P0 | **Review offen** |
| Prophet Muhammad ﷺ – Einführung | Grün technisch | eigene Anfängerlektion | P0 | **Review offen** |
| Islam-Lexikon / Begriffe | Grün technisch | durchsuchbares Islam A–Z | P0 | **Review offen** als `beginner-reference` |
| Anfänger-FAQ | Grün technisch | typische Einstiegsfragen + Quellen-/Unsicherheitshinweise | P0 | **Review offen** als `beginner-reference` |
| 7-Tage-Startplan | Grün technisch | bildet die 10 Grundlagen auf 7 Tage ab | P0/P1 | keine neuen Religionsregeln; nutzt denselben Fortschritt; „kein Zeitdruck“ abgesichert |
| Gebetszeiten | Gelb/Grün | AlAdhan live + Cache/Fallback | P0 | Methoden/Regionen/Datenschutz/Fachreview und reale Zeitvergleiche |
| Gebetstracker | Grün technisch | lokal | P0 | Tageswechsel, Recovery und reale Geräteabnahme |
| Prayer Reminders | Gelb | PWA-/Browserabhängigkeit | P0/P1 | Zuverlässigkeit je Releasekanal real testen; native/push Strategie später |
| Qibla | Gelb/Grün | Berechnung + Gerätesensorpfad | P0 | reale Sensor-/Permission-/Kalibrierungstests |
| Quran-Katalog | Grün technisch | 114 Suren-Metadaten | P0 | Quellen-/Lizenzregister vollständig dokumentieren |
| Quran-Reader | Grün technisch / Review offen | **114 Suren paarweise offline**, Al Quran Cloud nur Fallback | P0 | **Release-blockiert:** Offline-Arabisch, deutsche Übersetzungsedition, Provenienz und Nutzungs-/Lizenzgrundlage konkret dokumentieren |
| Quran für Anfänger | Grün technisch | Sure/Ayah/Juz/Tafsir/Übersetzung erklärt, 4 Start-Suren | P0 | **Review offen** als `quran-beginner-guide` |
| Quran-Audio | Rot | keine produktive/lizenzierte Quelle | P1 | erst nach definierter Rezitations-/Lizenzquelle |
| Gebets-Aussprache-Audio | Rot | Text/Transliteration vorhanden | P1 | lizenzierte/geprüfte Quelle für Al-Fatiha und zentrale Formulierungen definieren |
| Dhikr-Routinen | Grün technisch | Routinen mit sichtbaren Quellen | P0 | **Review offen** – Quellen, Zählungen, Bedeutungen und Varianten prüfen |
| Dhikr-Zählertexte | Grün technisch | arabische Texte/Bedeutungen vorhanden | P0 | **Review offen** – Einzelnachweise/Behauptungen prüfen |
| Duas | Grün technisch | 34 Einträge mit Quellenfeldern | P0 | **Review offen** – arabischer Text, Transliteration, Bedeutung und Referenzen vollständig fachlich prüfen |
| 99 Namen | Grün technisch | 99 Einträge, stabile IDs | P0 | **Release-blockiert:** Reihenfolge, arabische Schreibweise, Transliteration, Bedeutungen und Quellen-/Redaktionsstandard prüfen |
| Hadith des Tages | Grün technisch / Review offen | sinngemäße Zusammenfassungen; Altbestand teils ohne konkrete Nummer | P0 sichtbar auf Home | **Release-blockiert:** vor Freigabe expliziten kuratierten `DAILY_HADITH_IDS`-Pool mit konkreten Referenzen verwenden |
| Kalender | Grün technisch | Hijri-Berechnung + lokale Termine | P0 | regionale Abweichungen und Ereignisquellen prüfen |
| Wudu | Grün technisch | ausführlicher Worship-Guide | P0 | **Review offen** als Teil `worship-guides`; gemeinsame Grundlagen vs. Fiqh-Varianten prüfen |
| Ghusl-Grundlagen | Grün technisch | eigene Anfänger-Hilfeseite | P0 | **Review offen** als `purity-basics` |
| Tayammum-Grundlagen | Grün technisch | eigene Anfänger-Hilfeseite | P0 | **Review offen** als `purity-basics` |
| Salah lernen | Grün technisch | alle fünf Pflichtgebete, Rakʿah-für-Rakʿah, Arabisch/Umschrift/Bedeutung | P0 | **Review offen:** `worship-guides` + `prayer-rakat-sequence`; Madhhab-Hinweise und fachliche Ablaufabnahme |
| Gebetsbegriffe & Voraussetzungen | Grün/teilweise | Rakʿah, Fard, Qibla, Reinheit usw. über Anfänger- und Gebetsbereich | P0 | durch P0-Reviewumfang mitprüfen |
| Wissenskurse | Grün technisch | 6 Kurse/18 Lektionen | P1 | Quellenstatus pro Lektion und redaktioneller Review vor v1-Freischaltung bewerten |
| Alltagssituationen-Hub | Rot/neu | Inhalte in Dua/Sunnah/Fasten verteilt | P1 | erst nach P0-Kernrelease bündeln |
| Hadith-Sammlung | technisch vorhanden, öffentlich gesperrt | Legacy-Bestand teilweise ohne konkrete Nummern | P1 | vollständige Datenbasis prüfen; bis dahin nicht öffentlich in v1 |
| Propheten | technisch vorhanden, öffentlich gesperrt | Quellen-/Redaktionsreview offen | P1 | nicht öffentlich in v1 |
| Seerah-Timeline | Rot/neu | Seerah-Lektionen vorhanden | P1 | später chronologische Grundtimeline mit geprüften Kerndaten |
| Moschee-Finder | Gelb/Grün | OSM/Overpass live | P1 | Attribution, SLA, Datenschutz, Edgecases |
| Sammlungen | Grün technisch | lokale Favoriten | P1 | stabile IDs, Export, Cloud-Sync-Entscheidung |
| Profil/Einstellungen | Grün technisch | lokal + optionales Konto/Cloud | P0 | Privacy/Export/Löschung und reale Auth-Flows abnehmen |
| Quellen-/Reviewanzeige | Teilweise/Grün | Anfängerlektionen zeigen Reviewstatus; Gate-Ledger vorhanden | P0 | Reviewstatus künftig auf weitere P0-Inhaltsscreens vereinheitlichen |
| KI-Assistent | öffentlich v1 gesperrt | UI/Quellenmodus technisch vorhanden, Safety nicht releasebereit | P2 | kein v1-Feature; erst Backend/RAG/Quellen/Eval/Safety |

## Legacy-/Spezialmodule – v1-Grenze

Die folgenden Alt-/Spezialmodule bleiben im Code erhalten, werden aber in v1 nicht als fertige öffentliche Inhalte angeboten, solange ihr Release-Status nicht ausdrücklich `ready` ist.

| Modul | v1-Entscheidung |
|---|---|
| Islam-Quiz | **gesperrt** – Fragen/Antworten/Erklärungen einzeln belegen und fachlich prüfen |
| Hajj & Umrah | **gesperrt** – später als Lernhilfe, nicht als individuelle Rechtsanweisung |
| Hadith-Sammlung | **gesperrt** – konkrete Referenzen und Review vervollständigen |
| Propheten | **gesperrt** – Quellen-/Redaktionsreview |
| Wissensbibliothek Legacy | **gesperrt** – Überschneidung mit neuen Lernkursen und Review klären |
| Sunnah im Alltag | **gesperrt/P1** – Quellen je Punkt |
| Fehler & Reue | **gesperrt/P1** – sensible Sprache und Fachreview |
| Fasten-Assistent | **gesperrt/P1** – Quellen-/Fiqh-Hinweise und Reminder-Logik prüfen |
| Ummah-Übersicht | **gesperrt/später** – belastbare, datierte Datenbasis erforderlich |
| Islamische Orte | **gesperrt/P1** – redaktionelle Quellen |
| Jumuah | **gesperrt/P1** – Quellen und regionale Praxis |
| Zakat | **gesperrt/P2** – keine individuelle Finanz-/Fatwa-Funktion ohne Fachsystem |
| Standby/Gebetsanzeige | **gesperrt/P2** – kein Kernbedarf für v1 |
| Community/Social | **später** |

Der Route-Guard verhindert zusätzlich, dass alte Browserzustände/Deep-Links gesperrte Legacy- oder KI-Bereiche als scheinbar fertige Inhalte öffnen.

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
- Anfänger müssen verstehen, was Sure, Ayah, Juz, Übersetzung/Bedeutung und Tafsir sind;
- Offline-Bestand darf nicht mit unbekannter Altbestands-Provenienz als öffentlich freigegeben gelten.

### Hadith

- Sammlung/Werk;
- Nummer/Referenz;
- Authentizitäts-/Bewertungsinformation, soweit belastbar und relevant;
- Original/Übersetzung sauber trennen;
- Kontextwarnung bei verkürzten Aussagen;
- keine frei generierten Hadith-Zitate;
- Home/Daily-Pool nur aus konkret referenzierten und freigegebenen Einträgen.

### Dua/Dhikr

- arabischer Text;
- Transliteration optional, für Anfänger bei zentralen Texten empfohlen;
- deutsche Bedeutung;
- Quelle;
- Häufigkeit/Zahl nur behaupten, wenn Quelle sie trägt;
- Varianten sichtbar machen;
- Quellenpräsenz ersetzt nicht den fachlichen Release-Review.

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
- keine erfundene Gewissheit bei ungeprüften oder individuellen Fragen;
- bei Quran/Übersetzungen nachvollziehbare Edition/Provenienz und Nutzungsgrundlage;
- bei Hadithen für öffentliche Daily-Flächen konkrete Referenz statt nur Sammlungsname.

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
