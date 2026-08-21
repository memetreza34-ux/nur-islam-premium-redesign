# V1 Religious Release Gate

## Zweck

Religiöse Inhalte, die im ersten öffentlichen Release sichtbar sind, dürfen nicht allein deshalb als freigegeben gelten, weil technisch Quellenfelder vorhanden sind. Der finale Merge nach `main` verlangt eine dokumentierte fachliche Freigabe.

Der technische Gate läuft über:

```bash
node scripts/check-v1-religious-release-approval.mjs
```

Im GitHub-Workflow `Premium redesign check` wird dieser Gate automatisch bei Pull Requests nach `main` ausgeführt.

Die verbindliche Liste der prüfpflichtigen Blöcke liegt in:

```text
src/data/v1ReligiousReleaseScope.ts
```

Damit existiert nur eine Quelle dafür, welche religiösen Inhalte Release 1 blockieren.

## Aktueller Prüfumfang: 42 Inhaltsblöcke

### Anfänger-Grundlagen – 10

1. `beginner-islam`
2. `beginner-allah`
3. `beginner-shahada`
4. `beginner-prophet`
5. `beginner-quran-sunnah`
6. `beginner-five-pillars`
7. `beginner-six-beliefs`
8. `beginner-purity`
9. `beginner-prayer`
10. `beginner-next-steps`

Statusdatei: `src/data/beginnerReview.ts`

### Sichtbare Vertiefungslektionen – 18

11. `aqidah-tawhid`
12. `aqidah-iman`
13. `aqidah-names`
14. `fiqh-purity`
15. `fiqh-prayer-time`
16. `fiqh-asking`
17. `tafsir-fatiha`
18. `tafsir-ikhlas`
19. `tafsir-method`
20. `seerah-revelation`
21. `seerah-hijra`
22. `seerah-example`
23. `hadith-basics`
24. `hadith-intention`
25. `hadith-verification`
26. `akhlaq-sincerity`
27. `akhlaq-patience`
28. `akhlaq-mercy`

Statusdatei: `src/data/learningContentReview.ts`

Diese 18 Lektionen sind im Lern-Hub sichtbar. Deshalb dürfen sie nicht außerhalb des fachlichen Release-Gates bleiben, auch wenn sie nicht zum ersten 10-Lektionen-Anfängerpfad gehören.

### Weitere religiöse Kerninhalte – 14

29. `quran-offline-bundle` – arabische Textquelle, deutsche Übersetzungsedition, Provenienz und Nutzungs-/Lizenzgrundlage des Offline-Bestands dokumentieren.
30. `quran-beginner-guide` – redaktionelle Quran-Einführung, Begriffe und Startempfehlungen prüfen.
31. `beginner-reference` – Anfänger-FAQ und Islam-A–Z-Begriffe fachlich prüfen.
32. `purity-basics` – Ghusl-/Tayammum-Grundlagen und Grenzen der Darstellung prüfen.
33. `names-of-allah` – das öffentliche v1-Lernset besteht nur aus einzeln belegten Namen; Schreibweisen, Bedeutungs-Kurzfassungen und jeweilige Belegzuordnung fachlich endprüfen.
34. `dhikr-counter-steps` – einzelne Dhikr-Zählertexte und deren Einzelnachweise prüfen.
35. `dhikr-routines` – Quellen, Zählungen, Bedeutungen und Varianten der Routinen prüfen.
36. `duas` – arabische Texte, Transliteration, Bedeutungsangaben und konkrete Quellen des Dua-Bestands prüfen.
37. `daily-hadith-rotation` – nur einen fachlich geprüften und konkret referenzierten Daily-Hadith-Pool für Home zulassen.
38. `worship-guides` – Wudu-/Salah-Anleitungen, gesprochene Texte und Hinweise zu Rechtsschul-Unterschieden prüfen.
39. `prayer-rakat-sequence` – Rakʿah-für-Rakʿah-Ablauf, arabischer Wortlaut, Umschrift, Bedeutungen und Varianten prüfen.
40. `prayer-time-methodology` – AlAdhan-Methode, Asr-Auswahl, lokale Abweichungen, Cache/Fallback und Reminder-Sicherheit prüfen.
41. `qibla-guidance` – Kaaba-Koordinaten, Bearing-Berechnung, Standortvoraussetzung, absolute Sensororientierung und Genauigkeitshinweise prüfen.
42. `islamic-calendar-content` – öffentliche Termine, Fastenhinweise, Quellen, berechnete Hijri-Daten und quarantänisierte unsichere Datierungen prüfen.

Statusdatei: `src/data/coreContentReview.ts`

## Bereits erfolgte technische Quellen-Audits

Ein Quellen-Audit ist nicht dasselbe wie eine fachliche Freigabe. Es reduziert jedoch konkrete Datenfehler vor dem menschlichen Endreview.

### Dua-Bestand

Alle 34 derzeit sichtbaren Duas besitzen inzwischen einen eigenen Quellen-Audit-Datensatz in:

```text
src/data/duaSourceAudit.ts
```

`src/data/duaSourceAudit.test.ts` erzwingt exakt einen Prüfdatensatz pro Dua. Dabei wurden unter anderem falsche oder unpräzise Referenzen, Bedeutungs-Auslassungen und nicht von der angegebenen Quelle getragene Zusätze korrigiert. Der globale Reviewstatus `duas` bleibt trotzdem `pending`, bis ein qualifizierter menschlicher Endreview stattgefunden hat.

### Hadith des Tages

Home rotiert nicht mehr durch die gesamte Legacy-Hadithbibliothek. `DAILY_HADITH_IDS` begrenzt die tägliche Auswahl auf konkret referenzierte Einträge. Das beseitigt die frühere technische Release-Lücke, ersetzt aber nicht die fachliche Endfreigabe des kuratierten Pools.

### Namen Allahs

Die öffentliche Names-Seite verwendet nicht mehr die alte feste 99er-Liste. `src/data/verifiedNamesOfAllahData.ts` enthält aktuell 32 einzeln mit Quranstellen belegte Namen/Bezeichnungen. Für jeden öffentlichen Eintrag werden Quelle und Quellenhinweis direkt angezeigt.

Der frühere 99er-Altbestand bleibt nur für Migration und Audit erhalten. `src/data/legacyNamesAudit.ts` ordnet 31 alte Zeilen dem neuen belegten Set zu; 68 weitere Altzeilen sind `legacy-quarantined`. Das bedeutet nicht automatisch „falsch“, sondern: noch nicht ausreichend einzeln belegt und fachlich geprüft für den öffentlichen v1-Inhalt.

Auch `Meine Sammlung` darf nur Favoriten zeigen, die auf das belegte öffentliche Set gemappt werden können.

### Gebetszeiten

Der frühere feste Berlin-Ersatzplan wurde entfernt. Der Offline-Fallback enthält keine Uhrzeiten mehr (`—:—`). Ohne Live-Daten oder einen passenden aktuellen Cache:

- zeigt Home keine scheinbar aktuelle nächste Gebetszeit;
- werden keine statischen Ersatzzeiten als Gebetsentscheidung ausgegeben;
- dürfen Gebetserinnerungen nicht auf Fallback-Uhrzeiten feuern.

Die Berechnungsmethode bleibt als berechnete Hilfe gekennzeichnet; lokaler Moschee-/Behördenabgleich bleibt relevant.

### Qibla

Die öffentliche Qibla-Seite gibt ohne echten gespeicherten Gerätestandort keine persönliche Gradzahl mehr aus. Relative `deviceorientation`-Werte werden nicht als Nordreferenz akzeptiert; für den Kompass wird absolute Orientierung angefordert, soweit der Browser dies unterstützt. Unbekannte oder große Sensorabweichungen werden sichtbar gewarnt.

Zusätzlich prüfen mathematische Tests bekannte Bearing-/Distanzfälle für mehrere Städte.

### Islamischer Kalender

Der öffentliche Kalender wurde auf einen konservativen, einzeln belegten Kern reduziert. Unter anderem:

- Ramadan wird nicht als „freiwilliges Fasten“ bezeichnet;
- Laylat al-Qadr wird nicht fest auf den 27. Ramadan gesetzt, sondern in den ungeraden Nächten der letzten zehn gesucht;
- die letzten zehn Nächte enthalten auch die 27. Nacht;
- traditionelle/unsichere Festdatierungen wie 12. Rabi al-Awwal als fixes Mawlid-Datum, 27. Rajab als fixes Isra-/Miʿraj-Datum und eine pauschale Sonderpraxis am 15. Shaʿban sind für v1 quarantänisiert;
- Quran-/Hadith-Quellen werden direkt am sichtbaren Kalenderhinweis angezeigt;
- das Hijri-Datum bleibt ausdrücklich als berechnet gekennzeichnet, da lokale Mondsichtung abweichen kann.

## Zusätzliche technische Bedingungen

Ein Review-Datensatz allein reicht bei besonders sensiblen Bereichen nicht aus:

- `quran-offline-bundle` kann nicht freigegeben werden, solange die lokale deutsche Ausgabe im Code nur als `übernommener deutscher Altbestand` bezeichnet wird. Vor Freigabe müssen Edition/Provenienz und Nutzungsgrundlage konkret benannt sein.
- `daily-hadith-rotation` kann nur freigegeben werden, wenn ein explizit kuratierter `DAILY_HADITH_IDS`-Pool existiert. Diese technische Voraussetzung ist auf dem aktuellen Feature-Branch bereits umgesetzt; der fachliche Reviewstatus bleibt davon getrennt.
- `names-of-allah` darf nicht wieder auf die alte feste 99er-Liste als öffentlichen Datenbestand zurückfallen. Der v1-Screen und Sammlungen verwenden nur den einzeln belegten öffentlichen Satz.
- `prayer-time-methodology` darf keine fest codierten Uhrzeiten als aktuellen religiösen Zeitplan verwenden. Reminder müssen bei unzuverlässigem Fallback blockiert bleiben.
- `qibla-guidance` darf ohne persönlichen Gerätestandort und absoluten Nordbezug keine scheinbar exakte persönliche Kompassführung vortäuschen.
- `islamic-calendar-content` darf quarantänisierte Datierungen nicht als sichere öffentliche religiöse Termine ausgeben.

Diese Bedingungen werden durch spezialisierte Repo-Checks zusätzlich abgesichert.

## Statusmodell

Jeder Review-Datensatz besitzt:

- `contentId`
- `status`: `pending` oder `approved`
- `reviewer`
- `reviewedAt`
- `evidence`

### Pending

```ts
{ contentId: '...', status: 'pending', reviewer: null, reviewedAt: null, evidence: null }
```

Solange ein Inhalt `pending` ist, blockiert er den finalen Religious Release Gate.

### Approved

Eine Freigabe darf nur eingetragen werden, wenn ein qualifizierter fachlicher Review tatsächlich erfolgt ist:

```ts
{
  contentId: '...',
  status: 'approved',
  reviewer: 'Name / eindeutig dokumentierte Reviewer-Rolle',
  reviewedAt: 'YYYY-MM-DD',
  evidence: 'PR, Issue, Review-Protokoll oder andere nachvollziehbare Referenz',
}
```

Der Gate lehnt `approved` ohne Reviewer, gültiges Datum oder Nachweis ab.

## Review-Regeln

Vor einer Freigabe müssen mindestens geprüft werden:

- Aussage inhaltlich korrekt und nicht irreführend
- Quran-/Hadith-Referenzen passen tatsächlich zur Aussage
- Übersetzung, sinngemäße Wiedergabe und Originalwortlaut werden klar getrennt
- bei Hadithen ist Quelle und Einordnung ausreichend konkret
- anerkannte Fiqh-Unterschiede werden nicht als einzige universelle Position dargestellt
- persönliche Sonderfälle werden nicht pauschal entschieden
- arabische Schreibweise und Transliteration sind konsistent
- deutsche Bedeutungsangaben sind sachlich vertretbar
- Anfängerformulierungen erzeugen keine falsche Gewissheit
- Gebets-/Wudu-Schritte unterscheiden klar zwischen gemeinsamem Grundablauf, empfohlenen Handlungen und Punkten mit anerkannten Rechtsschul-Unterschieden
- Quran-Editionen, Übersetzungsquelle und Nutzungsrechte sind nachvollziehbar dokumentiert
- bei Zählungen oder festgelegten Wiederholungszahlen trägt die genannte Quelle tatsächlich die behauptete Anzahl
- Seerah- und Tafsir-Zusammenfassungen behaupten nicht mehr, als die angegebenen Quellen tragen
- eine gute Absicht wird nicht als pauschale Erlaubnis für ansonsten verbotene Handlungen dargestellt
- berechnete Gebetszeiten werden nicht mit lokaler verbindlicher Festlegung verwechselt
- Sensor-/Standortdaten der Qibla werden nicht genauer dargestellt, als das Gerät sie tatsächlich liefert
- berechnete Hijri-Daten und historisch unsichere Datierungen werden transparent gekennzeichnet

## Änderung nach Freigabe

Wird ein bereits freigegebener religiöser Inhalt inhaltlich geändert, muss seine Freigabe erneut bewertet werden. Bei materiellen Änderungen ist der Status bis zum erneuten Review wieder auf `pending` zu setzen.

## Was bewusst nicht durch Code entschieden wird

Der technische Gate entscheidet nicht, ob eine religiöse Aussage richtig ist. Er prüft nur, ob für jeden release-kritischen Inhalt ein dokumentierter menschlicher/fachlicher Freigabeschritt vorhanden ist.

Legacy-Bereiche wie Quiz, Propheten, Hajj/Umrah, Ummah, Zakat und weitere noch nicht freigegebene Module bleiben unabhängig davon über die v1-Release-Grenze aus den öffentlichen Hubs ausgeschlossen.
