# Vier ergänzende Bereiche im Grundlagenpfad

Stand: 03.09.2026. Religiös-fachliche Freigabe: **offen**.

## Struktur

Hadith-Sammlung, Hajj & Umrah, Sunnah im Alltag und Fehler & Reue stehen als Kacheln 11–14 im bestehenden Zwei-Spalten-Raster. Die separate Liste „Weitere Funktionen“ entfällt. Die zuvor entfernten Wissensbibliothek, Gefährten, Frauen im Islam und Islam-Quiz bleiben aus der Navigation entfernt. Gespeicherte Daten werden nicht gelöscht.

Jeder Bereich beginnt mit einer kurzen Einführung. Eine standardmäßig geschlossene Kapitelübersicht erlaubt direkte Sprünge. Alle Kapitel bleiben darunter ohne einzelne Freischalt-Klicks lesbar. Begriffe, Erklärung, konkrete Anwendung und Beleg sind voneinander unterscheidbar. Es gibt keine erfundenen Abschlusszähler für diese Lesebereiche. Suche und lokale Hadith-Favoriten bleiben erhalten.

## Quellenmatrix

Die Seiten wurden im Web gelesen; deutsche Texte sind eigene Zusammenfassungen. Anwendungsbeispiele sind didaktische Vorschläge, keine wörtlichen Überlieferungen oder neuen Vorschriften.

| Inhalt | Nachgeschlagene Grundlage |
| --- | --- |
| Hadith, Sammlung, Nummerierung, Grenzen einer Einzelquelle | [Sunnah.com: About](https://sunnah.com/about), [al-Bukhari 1](https://sunnah.com/bukhari:1) |
| Kleine regelmäßige gute Taten | [al-Bukhari 6464](https://sunnah.com/bukhari:6464) |
| Schlafen: Wudu, rechte Seite | [al-Bukhari 6311](https://sunnah.com/bukhari:6311) |
| Essen: Name Allahs, rechte Hand, gemeinsames Gefäß | [al-Bukhari 5376](https://sunnah.com/bukhari:5376) |
| Gedenken beim Heimkommen | [Muslim 2018a](https://sunnah.com/muslim:2018a) |
| Freundlichkeit, Sprache und Miswak | [at-Tirmidhi 1956](https://sunnah.com/tirmidhi:1956), [al-Bukhari 6018](https://sunnah.com/bukhari:6018), [al-Bukhari 887](https://sunnah.com/bukhari:887) |
| Hoffnung und Umkehr | [Quran 39:53–54](https://quran.com/39/53-54), [3:135](https://quran.com/3/135) |
| Bedingungen der Reue, Rechte anderer | [Dar al-Ifta 7148](https://www.dar-alifta.org/en/fatwa/details/7148/how-can-i-repent-from-a-sin-so-god-would-forgive-me), [al-Bukhari 2449](https://sunnah.com/bukhari:2449) |
| Wieder anfangen, Istighfar | [Dar al-Ifta 7980](https://www.dar-alifta.org/en/fatwa/details/7980/falling-into-cardinal-sins-any-chance-for-repentance), [Riyad as-Salihin 13](https://sunnah.com/riyadussalihin:13) |
| Hajj und Fähigkeit | [Quran 3:97](https://quran.com/3/97) |
| Drei Pilgerformen | [Dar al-Ifta 6382](https://dar-alifta.org/en/fatwa/details/6382/the-meaning-of-hajj-ifrad-qiran-and-tamattu) |
| Umrah-Ablauf | [Nusuk Umrah Journey](https://umrah.nusuk.sa/Journey) |
| Hajj-Ablauf, Sa’i-Zuordnung, Tashriq | [Dar al-Ifta: Ablauf](https://www.dar-alifta.org/en/article/details/29/overview-of-the-rites-of-hajj-and-umrah) |

## Bewusste Grenzen und Korrekturen

- Die unbelegte Regel „mit dem rechten Fuß das Haus betreten“ wurde entfernt. Die verlinkte Überlieferung berichtet vom Gedenken Allahs, nicht von einer Fußregel.
- Keine zusätzlichen Formeln oder religiösen Regeln aus einem nicht passenden Beleg ableiten. Die Sunnah-Beispiele behandeln jeweils die konkret nachgeschlagene Praxis.
- Bei Tamattuʿ beginnt Hajj nach Ende der Umrah mit einem neuen Ihram in Makkah. Ifrad und Qiran können anders beginnen. Sa’i ist nicht in allen Formen an derselben Stelle erneut vorgesehen.
- Die drei Pilgerformen werden nicht als drei Religionen oder als Rangliste präsentiert. Rechtsschulunterschiede und persönliche Situationen benötigen qualifizierte Einordnung.
- Hajj-Stationsbeschreibungen bleiben eine zeitliche Orientierung; Gültigkeitsbedingungen, Ersatzhandlungen, Erleichterungen oder medizinische Empfehlungen werden nicht individuell entschieden.
- Nusuk dient auch als offizieller Einstieg für aktuelle Reiseinformationen. Nicht alle Formulierungen einer offiziellen Seite sind deshalb ungeprüft übernommen worden.
- Die bisherigen fünf Einträge zu schweren Verfehlungen und die bestehenden Hadith-Zusammenfassungen wurden nicht pauschal als neu fachlich geprüft ausgegeben. Ihr offener Prüfstatus bleibt sichtbar. Vorhandene Hadith-Kontexte werden nun mit angezeigt und müssen mitgeprüft werden.
- `scripts/write-content-review.mjs` führt die neuen Kapitel und überarbeiteten Praxistexte als verfasst und prüfbedürftig, nicht als approved.

## Design und Prüfung

Gemeinsame Lesekomponenten im bestehenden Lern-Stylesheet: große Fließtexte, offene nummerierte Kapitel, ruhige Beispiele und direkt zugeordnete Quellen. Keine neue Bildgenerierung, keine weitere Override-Datei und kein zusätzliches `!important`.

Automatisierte Tests decken Datenvollständigkeit, Kapitelziele, mobile Lesbarkeit, Raster-Rückkehr und Hadith-Suche/Favoriten ab. Technische Tests ersetzen weder religiöse Freigabe noch Tests auf echten Geräten.

Abschluss: vollständiger Projektcheck erfolgreich; alle 14 gezielt geprüften Browser-Szenarien bestanden (10 bestehende Lernkursfälle, 4 ergänzende Fälle). Dunkle Browseransicht und heller mobiler Screenshot wurden visuell geprüft. Der neue Kontrasttest bewertet dunkle Textfarbe auf einer konservativen hellen Hintergrundreferenz; er ist kein vollständiges Barrierefreiheits-Audit. Die lokale Vorschau läuft unabhängig vom Testserver auf Port 4178.
