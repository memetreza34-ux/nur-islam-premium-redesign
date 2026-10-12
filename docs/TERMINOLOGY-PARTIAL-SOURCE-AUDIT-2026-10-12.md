# Begriffslektionen · Teilprüfung · 12. Oktober 2026

Weiterer Nachtrag: Die acht übrigen Begriffslektionen inzwischen im
[vollständigen Feldabgleich](TERMINOLOGY-LEARNING-SOURCE-AUDIT-2026-10-12.md)
bearbeitet. Zusammen mit dem Devotionsbericht aktuell zwölf Begriffslektionen;
gesamt 25/44 Lernlektionen, 19 noch offen. Unten stehende Prüfzahlen und
Restumfänge dokumentieren den früheren Teilprüfungsstand.

Nachtrag: Niyyah/Dua/Dhikr/Tawba anschließend im [Einzelbericht](DEVOTION-LEARNING-SOURCE-AUDIT-2026-10-12.md)
abgeglichen. Unten genannter Reststand 31 war der damalige Zwischenstand;
aktuell sind 27 Lernlektionen nicht abgeschlossen. Die anderen acht
Begriffslektionen sind damit nicht pauschal bestätigt.

## Status

Alle zwölf bestehenden Lektionen mit Zusammenfassungen, Absätzen, Details,
Merksätzen, Optionen und Erklärungen gelesen. Dieser Bericht bestätigt jedoch
**nur die folgenden konkreten Befunde und Belegzuordnungen**, nicht bereits den
vollständigen Quellenabgleich dieser zwölf Lektionen. Keine neuen Lektionen oder
menschlichen Freigabestatus. Die Gesamtzählung bleibt 13/44 vollständig im
bisherigen Umfang abgeglichene Lektionen; 31 sind weiter nicht abgeschlossen.

## Nachgewiesene Befunde

| Bereich | Befund, Korrektur und tatsächlicher Beleg |
|---|---|
| Einführung | Elf Themenlektionen bündeln mehrere Wörter. Das Versprechen „jeder Begriff erhält eine eigene Lektion“ passt nicht zum vorhandenen Zwölferkurs einschließlich Einführung. Zusammenfassung, Absatz und richtige Antwort an die tatsächlich vorhandenen IDs in `learningCategories.ts` angepasst. Kein religiöser Quellentext erforderlich für diese Kursstruktur. |
| Mubah/Makruh | Die pauschale Erklärung „Meiden empfohlen“ übersieht hanafitisches Tahrimi. Unterarten in Zusammenfassung, Absatz, Detail und Quiz berücksichtigt. [Ferhat Koca, MEKRUH, TDV, Bd. 28 (2003), S. 581–583](https://islamansiklopedisi.org.tr/mekruh), Abschnitte über unterschiedliche Fachverwendungen und hanafitische Unterarten. Keine Anwendung auf konkrete Personen/Fälle. |
| Beleggrenzen Makruh | [Bukhari 52, Buch 2/Hadith 45](https://sunnah.com/bukhari:52) und [Muslim 1599a, Buch 22/Hadith 133](https://sunnah.com/muslim:1599a) behandeln Erlaubtes/Verbotenes/Zweifel; sie definieren nicht die gesamte spätere Rechtsterminologie. Kombinierten Verweis in einzelne Links aufgeteilt. [5:87](https://quran.com/5/87) warnt vor eigenmächtigem Verbieten, ist keine alleinige Fachdefinition. Arabic/angezeigte englische Bedeutung tatsächlich gelesen. |
| Fard/Wajib | Vorhandene hanafitische Unterscheidung bisher ohne passenden Begriffsbeleg. [TDV, FARZ, Bd. 12 (1995), S. 184](https://islamansiklopedisi.org.tr/farz), Passagen über eindeutige/nicht eindeutige Belege und verbindliche Handlungen hinzugefügt. Keine darin enthaltenen Aussagen über den Glaubensstatus von Personen in die App übernommen. |
| Sunnah | Quellen für die unterschiedlichen Fachbedeutungen ergänzt: [Murteza Bedir, SÜNNET](https://islamansiklopedisi.org.tr/sunnet--peygamber), begriffliche Einleitung, und [Ferhat Koca, SÜNNET als Rechtsbegriff](https://islamansiklopedisi.org.tr/sunnet--hukum), Empfehlung und Abstufungen. Keine Übertragung sämtlicher Artikelbeispiele auf alle Schulen. |
| Hadith/Sunnah | Die starre begriffliche Trennung verallgemeinerte eine didaktische Unterscheidung. Bedirs oben verlinkte Einleitung nennt häufig synonyme Verwendung in der Hadithwissenschaft. Absatz/Merksatz/Erklärung angepasst. „Hadith“ allein ist keine Echtheitsbewertung; ein Bericht kann Zuschreibungen enthalten. |

TDV ist eine namentlich zugeordnete wissenschaftliche Sekundärdarstellung,
nicht Quran-/Hadithwortlaut oder automatische Fachfreigabe. Es wurden die
jeweils benannten türkischen Abschnitte gelesen und knapp redaktionell
zusammengefasst, keine ganzen Artikel oder Bilder übernommen. Rechtsverwendung
von Makruh kann auch historisch anders sein. Keine eigenen Fatwas/Bewertungen.

Agent Reach/Jina Reader scheiterte an DNS; `mcporter` war nicht verfügbar.
Der verfügbare Web-Zugriff lieferte die tatsächlich gelesenen Artikel und
Sammlungseinträge. Suchtreffer allein wurden nicht als Beleg ausgegeben.

## Absicherung

- Fünf zusätzliche Datenregressionen; `npm run check` **Exit 0**, **883 Tests
  in 54 Dateien**, zehn Node-Prüferregressionen, Typprüfung und Build:
  `/private/tmp/nur-terminology-check-completed-20261012.log`.
- JS 377, CSS 123, Gesamt 499 KB gzip. JS-Grenze +1 KB für Fachreferenzen und
  Korrekturen; Gesamtgrenze unverändert 499 KB (gerundete Einzelwerte sind nicht
  exakt additiv). Entry 92/95 KB, CSS und Raw-Grenze unverändert. Erster Check
  scheiterte nur an der alten JS-Grenze. Keine Abhängigkeit/CSS-Schicht.
- Cache/Registrierung gemeinsam v70. Prüfmappe neu erzeugt: weiterhin 1.146
  Positionen, 91 ohne Einzelfundstelle, 862 redaktionell für diese App verfasst.
- Browserprüfung der Makruh-Lektion: **drei Fälle bestanden (16,5 Sekunden),
  Exit 0**, `/private/tmp/nur-terminology-e2e-20261012.log`. Zusammenfassung,
  Absätze, Details, Quizoptionen/falsche Antwort samt Erklärung und alle vier
  Quellen mit Kontext bei 320/768/1280 px; Linkgrenzen und Dokumentbreite ohne
  horizontalen Überlauf. Alle drei Quellenbilder tatsächlich visuell angesehen.
  Kein Nachweis des gesamten Zwölferkurses oder echter Geräte/Aussprache.
- `git diff --check` und `review:check` bestanden.

## Konkret weiter offen

Vollständiger Belegabgleich für Niyyah (einschließlich guter Absicht und
unerlaubtem Tun), Dua in eigenen Worten/innerhalb der Salah, alle genannten
Dhikr-Beispiele und Quranrezitation, Tawba-Bedingungen/Rechte anderer und
erneute Reue, Fiqh/Madhhab-Definitionen sowie sämtliche Grundbelege der übrigen
Begriffslektionen. Die Warnung vor unbegründeten Verboten macht eine einzelne
Definition nicht automatisch richtig. Kurze arabische Begriffsformen sind
keine abgeschlossene Aussprache-/Sprachprüfung. Alle 31 noch nicht vollständig
abgeglichenen Lernlektionen und die weiteren zentral dokumentierten App-Bereiche
bleiben Bestandteil des aktiven Gesamtziels.
