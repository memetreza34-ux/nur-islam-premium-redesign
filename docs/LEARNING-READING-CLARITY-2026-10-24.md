# Lernansichten vereinfachen

Abgeschlossen und geprüft am 25.10.2026. Die bestehende grün-goldene Gestaltung und die vorhandenen Bilder bleiben erhalten.

## Darstellung

- **Wudu:** ein aktiver Schritt mit Bild, konkreter Handlung und Navigation. Arabische Namen reiner Waschhandlungen werden nicht zusätzlich gezeigt. Gesprochene Texte, Aussprachehilfe und Bedeutung bleiben erhalten.
- **Weitere Anleitungen:** derselbe Aufbau mit einem aktiven Schritt. Themenwechsel und Schrittauswahl sind eingeklappt. Alle elf Anleitungen und 91 Schritte bleiben zugänglich.
- **Gebetsablauf:** kompakter Einstieg; alle fünf Gebete sind ohne seitliches Scrollen sichtbar. Rakʿah-Auswahl, automatischer Durchlauf und Vorbereitung sind aufklappbar. Hinweise zur lauten oder leisen Quran-Rezitation sind an den Quran-Abschnitten erreichbar. Wiederholungen, Aufnahmen und Rechtsschulunterschiede bleiben erhalten.
- **Wissenslektionen:** ein Titel und eine Zusammenfassung, ohne zusätzliche Kursziel-Karte und dekorative Abschnittsnummern. Fragen sind freiwillig aufklappbar. Alle 44 Lektionen bleiben direkt auswählbar.
- **Propheten:** Kapitelwahl und ausführliche Einordnung sind eingeklappt. Doppelte Kapitelzusammenfassungen, allgemeine Verständnisfragen und der wie ein Abschlussfortschritt wirkende Balken sind entfernt. Alle 25 Propheten und 97 Kapitel einschließlich Quran-Verweisen bleiben zugänglich. Die Überschriften verwenden wie die anderen Lernseiten Cormorant Garamond; der Kopfbereich heißt einheitlich „Nur Islam“.
- **Hadithe, Hajj/Umrah, Sunnah und Reue:** einzeln aufklappbare Kapitel. Die Kapitelübersicht öffnet das gewählte Kapitel. In der Hadith-Bibliothek ist die Suche direkt geöffnet.

Quellen, Unterschiede und Wissensgrenzen bleiben erreichbar. Speicherfehler bleiben sichtbar. Lesepositionen, Favoriten und persönliche Daten bleiben erhalten; es entsteht kein neuer Abschlussstatus. Beim Nachladen einer Ansicht erscheint ein kurzer Status statt einer leeren Fläche.

## Verifikation

Die frühere Browserblockade ist behoben. Geprüft wurde mit aktuellem Chrome gegen den Produktionsbuild, unter anderem bei 320, 390 und 768 Pixeln Breite.

- Der erste Lauf bestand 46 von 49 Fällen. Drei Prüfungen verwendeten mehrdeutige oder veraltete Selektoren; diese wurden auf den Zurück-Knopf im Kopfbereich beziehungsweise das tatsächliche Quellen-Dialogfenster eingegrenzt.
- Der folgende Lauf bestand alle 23 Fälle: alle Anleitungen und Wissenslektionen, sämtliche Prophetenkapitel, Quellenaufrufe, kompakte Auswahlzeilen, fünf direkt sichtbare Gebete, automatischer Durchlauf und freie Navigation ohne Abschlussstatus.
- Nach der letzten Angleichung der Prophetenüberschriften bestanden erneut beide betroffenen Prüfungen: alle 97 Kapitel mit einheitlicher Schrift sowie der Sprung in Quran-Belege und zurück.
- Wudu-Bilder einschließlich Ausfallersatz, Schrittauswahl, Leseposition nach Neuladen, Hadith-Suche und Favoriten, Rückkehr zur Übersicht sowie die vollständige Namens- und Rechtsschulliste sind in den Browserläufen geprüft.
- Die fertigen Ansichten für Wudu, Gebetsablauf, Wissenslektionen und Propheten wurden zusätzlich anhand der Browserbilder gesichtet.
- Alle **1116 Unit-Tests in 62 Dateien**, TypeScript und Produktionsbuild bestehen.
- Paketgröße: 496 KB komprimiert, Einstieg 95 KB, innerhalb der unveränderten Grenzen. Stylesheets: 797687 Bytes, 2079 `!important`, 103 Dateien. Größen-, Bildzuordnungs-, Inhalts-, Quellen-, Layout- und Speicherprüfungen sowie `git diff --check` bestehen.

Browserprotokolle dieses Abschlusses: `/tmp/nur-learning-final-20261025.log`, `/tmp/nur-learning-verified-20261025.log` und `/tmp/nur-learning-final-prophets-20261025.log`. Unit-Protokoll: `/tmp/nur-learning-final-units-20261025.log`.

## Änderung am 25.10.2026: Lektionen ohne Wissenstest

Auf Wunsch des Betreibers entfallen die „Wissen prüfen“-Abschnitte in allen 44 Lektionen vollständig. Antwortzustand, Rückmeldungen und ungenutzte Quiz-Stile sind entfernt. Die vorhandenen Unterrichtstexte, Quellen, freie Lektionsauswahl und gespeicherte Leseposition bleiben erhalten. Vier gezielte Browserprüfungen einschließlich aller 44 Lektionen und alter/ungültiger Abschlussdaten bestanden; TypeScript, Produktionsbuild und Design-/Persistenzprüfungen bestanden. Protokoll: `/tmp/nur-learning-no-questions-20261025.log`.

## Wudu-Lesegestaltung — abgeschlossen am 26.10.2026

Der Wudu-Lesebereich verwendet jetzt eine elfenbeinfarbene Fläche, dunkelgrüne Schrift und eine feine doppelte Einfassung. Der Einstieg führt Hinweis, vorhandene Abbildung und Quellenknopf in einer kompakten Zeile zusammen. Bei der abschließenden Dua stehen arabischer Wortlaut und Aussprache vor der einmaligen sinngemäßen Bedeutung; der vollständige bisherige Erklärungstext bleibt in der Quellenansicht erhalten. Bilder, Wortlaut, Fundstellen, freiwillige Einordnung und Leseposition bleiben erhalten.

14 Browserprüfungen auf 320/390/768 px bestanden; eine zusätzliche Gesamtansicht bei 390 px ebenfalls. Alle acht Abbildungen, Quellen, Schrittwahl, Wiederaufnahme und Bildausfall geprüft. Die beiden abschließenden Screenshots wurden visuell kontrolliert. TypeScript, Produktionsbuild, Bildzuordnung, Inhalts- und CSS-Prüfungen bestanden. Bundle: 495 KB gzip innerhalb 511 KB; CSS-Gesamtgröße 791.617 Bytes. Protokolle: `/tmp/nur-wudu-editorial-20261025.log`, `/tmp/nur-wudu-editorial-visual-20261025.log`.
