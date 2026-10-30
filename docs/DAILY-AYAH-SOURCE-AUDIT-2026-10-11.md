# Tages-Ayah · Quellenabgleich vom 11.10.2026

Umfang: alle fünf statischen Einträge in `dailyAyah.ts`, ihre gemeinsame Verwendung in Einstieg und Startseite sowie der Tagesauswahlcode. Keine menschliche Fachfreigabe und kein Abgleich aller Quran-Texte der App.

| Eintrag | Ergebnis / Änderung | Nachgelesene Quelle |
|---|---|---|
| 112:1 | Arabische Wörter stimmen überein; deutsche Paraphrase präzisiert zu „Sprich: Er ist Allah, der Eine.“ | [Al-Ikhlas 112:1](https://quran.com/112/1), Arabisch und Bedeutung. |
| 94:5 | Voller arabischer Vers; „Gewiss“ ergänzt, um die Bekräftigung sichtbar zu machen. „Mit“, nicht erst „nach“ der Schwierigkeit. Keine zusätzliche Heilungs-, Termin- oder Erfolgszusage. | [Asch-Scharh 94:5](https://quran.com/94/5). |
| 93:11 | Aufforderung, über die Gaben des Herrn zu sprechen, durch die Fundstelle getragen. | [Ad-Duha 93:11](https://quran.com/93/11). |
| 1:5 | Zweifache ausschließliche Hinwendung; „anbeten“ verdeutlicht den Sinn gegenüber dem weiteren Wort „dienen“. | [Al-Fatiha 1:5](https://quran.com/1/5-6). |
| 1:6 | Bitte um Führung auf den geraden Weg. | [Al-Fatiha 1:6](https://quran.com/1/5-6). |

Die Referenzseiten wurden tatsächlich geöffnet, einschließlich arabischer Texte. Unterschiedliche Quran-Darstellungsschriften können andere Zeichen für Sukūn und kleine Vokal-/Rezitationszeichen verwenden; hier wird keine Editionsidentität der Unicode-Zeichen zwischen Plattformen behauptet. Die lokalen Einträge stimmen exakt mit dem mitgelieferten arabischen Bestand überein, bei 112:1 nach Entfernung der vom Datenanbieter vorangestellten Basmala. Kein beliebiger Suffixvergleich mehr.

Die deutschen Texte sind kurze eigene sinngemäße Bedeutungen, ausdrücklich so beschriftet. Der Abgleich übernimmt keine vollständige fremde deutsche Übersetzung und ist keine umfassende Tafsir-Prüfung.

## Technische Grenzen

- Auswahl durch lokalen Kalendertag der Gebetsstandort-Zeitzone, Zyklus mit fünf Einträgen, nicht zufällig bei jedem Öffnen.
- `getDailyAyah` greift auf `getPrayerClock` zurück. Ungültiges Datum oder ungültige Zone verwendet Eintrag 1, keine erfundene Zeit.
- Tests: identische Auswahl innerhalb eines lokalen Tages, Tageswechsel, Sommerzeitumstellung, alle fünf Einträge über eine Schaltjahresgrenze und exakte lokale arabische Texte.
- Der Einstieg zeigt dieselbe Auswahl wie die Startkarte. Bei fehlenden oder veralteten Gebetszeiten wird keine Uhrzeit erfunden. Bereits vorhandene Browsertests prüfen diese Simulationen und die Größen 320/390/768/1280 sowie Querformat; keine echte Standort-/Geräteprüfung.
- Die exakten aktuellen Testergebnisse stehen im [zentralen Bericht](APP-CONTENT-AUDIT-2026-10-11.md).
