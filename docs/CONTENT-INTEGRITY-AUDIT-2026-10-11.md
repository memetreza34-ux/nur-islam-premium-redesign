# Inhaltsprüfung vom 11. Oktober 2026

Dies ist eine technische und redaktionelle Prüfung konkreter Auffälligkeiten, keine religiöse Gesamtfreigabe. Ein Quellennachweis allein beweist weder die richtige Übersetzung noch die passende Anwendung. Anerkannte Unterschiede zwischen Rechtsschulen sind nicht automatisch Fehler.

## Behoben

| Bereich | Befund und Änderung | Nachweis |
| --- | --- | --- |
| Ummah | Undatierte Prozentwerte und unbelegte Rangbehauptungen vollständig entfernt. Nur geografische Auswahl bleibt. | Die bisherigen Daten hatten keine prüfbare Quelle und kein Bezugsjahr. |
| Tages-Hadith | Dokumentation versprach sieben ausgewählte Einträge, der Code rotierte aber alle zwanzig. Jetzt ausschließlich die dokumentierten sieben Bukhari/Muslim-Einträge. | `docs/V1-SOURCE-AUDIT-DAILY-HADITH.md`, Regressionstest |
| Hadith-Sammlung | Die frühere vorsorgliche Entfernung von Tirmidhi 2317 wurde im erneuten Abgleich zurückgenommen. 20 Einträge; abweichende Bewertungen bleiben sichtbar und zugeordnet, keine pauschale Authentizitätszusage. | Aktueller [Hadith-Abgleich](HADITH-SOURCE-AUDIT-2026-10-11.md) mit direkt gelesenen Sammlungstexten. |
| Kalender | Qadr nicht mehr als sicherer 27. Ramadan. Suchhinweise an den fünf ungeraden Nächten, letzte zehn Tage einschließlich 27. Ramadan. Beginn einer Nacht am vorherigen Sonnenuntergang erläutert. | [Bukhari 2017](https://sunnah.com/bukhari:2017) |
| Kalender | Mawlid, fest datierte Isra/Miʿraj-Nacht und Mitte-Shaʿban-Nacht aus automatischen Anlass-/Praxisempfehlungen entfernt. Keine pauschale Verurteilung der jeweiligen Überlieferung oder Praxis. | Datum bzw. besondere religiöse Bewertung konnten hier nicht eindeutig abgesichert werden. |
| Weiße Tage | 13./14./15. Hijri als kalendarische Tage statt als exakte dreitägige Vollmondvorhersage. | Mondphase und Kalendertag sind nicht gleichbedeutend. |
| Salah | Bestehendes Wudu muss nicht vor jedem Gebet neu gemacht werden; Ghusl/Tayammum mit eigenen Voraussetzungen. | [Quran 5:6](https://quran.com/5/6) |
| Zakat | Keine pauschalen 2,5 % auf sämtliches Vermögen. Vermögensart, Nisab, Besitzdauer und unterschiedliche Berechnungsregeln berücksichtigt. | [Abu Dawud 1573](https://sunnah.com/abudawud:1573); Einzelfallberatung bleibt nötig. |
| Fasten | Krankheit/Reise mit Erleichterung und Nachholen; Schwangerschaft/Stillzeit nicht als pauschale dauerhafte Befreiung dargestellt. | [Quran 2:184–185](https://quran.com/2/184-185), [Abu Dawud 2408](https://sunnah.com/abudawud:2408) |
| Dhikr | Gekürzte gezählte Abendformeln vervollständigt; Quellen je Schritt sichtbar. Zehnmal Tahlil nicht als speziell überlieferter Abendritus ausgegeben. | [Muslim 2723a](https://sunnah.com/muslim:2723a), [Abu Dawud 5088](https://sunnah.com/abudawud:5088), [Muslim 2692](https://sunnah.com/muslim:2692), [Muslim 2693](https://sunnah.com/muslim:2693) |
| Istighfar/Salawat | Rabbighfir-Formel vollständig; frei gewählte Salawat-Zähler nicht als vorgeschriebene Anzahl oder Belohnungszusage bezeichnet. | [Abu Dawud 1516](https://sunnah.com/abudawud:1516), [Bukhari 6307](https://sunnah.com/bukhari:6307), [Quran 33:56](https://quran.com/33/56) |
| Quiz/Wissen | Unbelegte Schulterposition der Schreibengel, absolutes „unbesiegt“ und automatische Authentizität durch „Qudsi“ entfernt. Pauschale „100 % gültig“-Behauptung zu Rechtsschulen ersetzt. Quiz weist auf fehlende Einzelnachweise hin. | [Quran 82:10–12](https://quran.com/82/10-12); Qudsi bezeichnet die Art einer Überlieferung, nicht ihren Zuverlässigkeitsgrad. |
| 99 Namen | Alle 99 erhalten. Traditionelle Lernliste und unterschiedliche Einordnungen einzelner Formen ausdrücklich erklärt. | Keine unberechtigte Einzelprüfung oder einheitlich authentifizierte feste Liste behauptet. |

## Archivierter Befund zu Tirmidhi 2317

Der automatisierte Vergleich vor der Entfernung führte: Ahmad Muhammad Shakir – Sahih; Al-Albani – Sahih; Bashar Awad Maarouf – Hasan; Zubair Ali Zai – Daif. Dies waren Zuordnungen eines Datenmirrors, keine selbst bestätigten Druckausgaben. Die pauschale Entfernung allein wegen abweichender Bewertungen entsprach nicht dem jetzigen Prüfauftrag und ist zurückgenommen. Sichtbar sind jetzt Darussalam: daif für Tirmidhi 2317 und an-Nawawi: hasan in seiner Vierzigersammlung, Nr. 12, mit getrennten Links. Überlieferungswege und Nummerierung sind dabei nicht gleichzusetzen. Kein eigenes religiöses Urteil der App.

Der Referenzprüfer hatte zudem eine über-escapte Zahlensuche; diese ist korrigiert. Nummernexistenz bzw. Sammlungsgrenzen sind ausdrücklich keine inhaltliche Freigabe.

## Umfang und offene Freigabe

Gesichtet wurden Datenbestände, Quellenhinweise und widerspruchsanfällige Formulierungen in Quran/Ayah, Hadith, Duas/Dhikr, Gebets-/Wudu-Anleitungen, Kalender/Fasten, Zakat, Namen, Quiz/Wissen, Propheten und Pilgerübersichten. Nicht jede Aussage und Übersetzung wurde einzeln gegen eine Primärquelle geprüft.

Die damalige [Prüfmappe](INHALTE-PRUEFUNG.md) enthielt nach dem [anschließenden Quiz-/Dua-Abgleich](AI-SOURCE-AUDIT-2026-10-11.md) 478 Prüfpositionen, davon 79 ohne Einzelnachweis und 309 hier verfasste Formulierungen. Diese Zahlen sind ein historischer Zwischenstand: Die erweiterte Bestandsaufnahme und der aktuelle Umfang stehen im [zentralen Prüfbericht](APP-CONTENT-AUDIT-2026-10-11.md). Prüfpositionen sind keine Anzahl erwiesener Fehler.

Vor Veröffentlichung weiterhin erforderlich:

- Qualifizierte islamische Fachprüfung von Praxisanleitungen, Pilgerregeln und Varianten; keine neue Freigabe gesetzt.
- Die 58 Positionen der Wissensbibliothek sind inzwischen im [Quellenbericht](KNOWLEDGE-SOURCE-AUDIT-2026-10-11.md) abgeglichen; der Abgleich der umfangreicheren Lernkurse bleibt offen. Die 60 Quizfragen wurden mit Frage, Antwort und Erklärung abgeglichen und tragen Quellenlinks; dies ist keine Fachfreigabe.
- Duas mit Band-/Seitenangaben wurden inzwischen gegen Hisn al-Muslim abgeglichen. Die Prüfung sämtlicher Originalausgaben und Überlieferungswege bleibt davon zu unterscheiden.
- Einzelne Namensformen, deutsche Bedeutungen und Propheten-/Geschichtenerklärungen prüfen.
- Gebetsmethoden, lokale Hijri-Abweichungen und Qibla-Sensoren auf echten Geräten prüfen. Browser-/Rechentests ersetzen keine Geräte- oder religiöse Prüfung.

## Technische Absicherung

Neue Regressionstests schützen die Entfernung unbelegter Demografie, die Qadr-Suchnächte, vollständige gezählte Formeln, qualifizierte Praxisregeln und die sieben Tages-Hadithe. Browsertests prüfen sichtbare Änderungen und schmale Ansichten; sie prüfen keine religiöse Authentizität.

Historisches Ergebnis dieser ersten Prüfphase: `npm run check` bestanden, einschließlich 464 Tests, Typprüfung, Build und Größenlimit. 16 Browsertests für Inhaltskorrekturen, Kalender/Notizen und Einstieg bestanden; Inhaltsansichten bei 320, 768 und 1280 px geprüft. `git diff --check` ohne Fehler. Der damalige Referenzbericht findet die 32 zitierten Bukhari-Nummern; die vier verbleibenden Tirmidhi-Stellen sind mit den jeweiligen Einstufungen aufgelistet. Aktuelle Testergebnisse stehen im zentralen Prüfbericht.
