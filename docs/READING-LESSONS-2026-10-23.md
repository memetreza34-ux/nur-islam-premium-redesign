# Wissenslektionen dauerhaft lesen

Die sieben Grundlagenbereiche mit 44 Lektionen und die 25 Propheten-Kurse bleiben jederzeit frei lesbar. Im Grundlagenverzeichnis steht dauerhaft „Lektion lesen“. Abschlusszahlen, Gesamtfortschritt und Abschlussmarkierungen der Wissenslektionen sind entfernt. Der Lernplan zeigt eine statische Orientierung ohne Erledigt-Häkchen.

Im Kursplan bleibt jede Lektion verfügbar, unabhängig von früheren Abschlussdaten. Verständnisfragen sind freiwillig: Antworten zeigen ihre Erklärung direkt im Text, schreiben keinen Abschluss und öffnen kein Erfolgsfenster. Die Leseposition wird weiterhin gespeichert und nach erneutem Öffnen wiederhergestellt. Bei nicht speicherbarer Position bleibt die Lektion lesbar und zeigt den bestehenden Speicherhinweis.

Propheten-Kapitel haben keine Abschluss-Schaltfläche, keine Erledigt-Symbole und kein Kursabschlussfenster mehr. Kapitelwahl, Quran-Verweise, Rückkehr zur Lesestelle und sämtliche Inhalte bleiben erhalten. Bestehende Abschlussdaten werden nicht gelöscht. Praktische Wudu-/Gebetsübungen und der tatsächliche Gebetstracker sind von dieser Umstellung der Wissenslektionen getrennt.

Entfernte Dialoge und Zähler haben keine aktiven CSS-Regeln mehr. Die bestehenden Prüfungen schützen jetzt ausdrücklich die jederzeit lesbaren Lektionen ohne Abschlusslogik. Der aufklappbare Kursplan blendet seine Inhalte innerhalb der animierten Fläche ein, damit sie während des Öffnens nicht über den Lektionsinhalt malen. Vier Pixel Innenraum erhalten den Tastaturfokusrahmen. Der Offline-App-Stand ist Version 121.

Prüfung: 31 Browserfälle zu Kursstruktur, Quellen, Rückkehr zur Übersicht, Kartenlayout und Propheten-Kapiteln bestanden. Weitere sechs Lesepositionsfälle bei 320, 390 und 768 px bestanden nach Korrektur des Testablaufs für das erneute Öffnen nach Reload. Diese prüfen normale und beschädigte historische Abschlussdaten, freiwillige Fragen, ausbleibende Abschlussfenster und wiederhergestellte Lesestellen. Bestehende Abschlussdaten bleiben dabei unverändert.

Die vollständige App-Prüfung `npm run check` ist bestanden: 1.142 Tests in 62 Dateien, sämtliche statischen Prüfungen, TypeScript und Build. Das komprimierte Größenbudget beträgt 502 KB bei 511 KB Grenze.

Aufnahmen visuell geprüft: [Grundlagenverzeichnis](reading-lessons-2026-10-23/overview-390.png), [Kursplan](reading-lessons-2026-10-23/course-plan-390.png).

Protokolle: `/tmp/nur-reading-final-check-20261023.log`, `/tmp/nur-reading-final-browser-20261023.log` (31 bestanden; sechs danach korrigierte Wiederöffnungsprüfungen), `/tmp/nur-reading-verified-20261023.log` (alle sechs Wiederöffnungs- und Geometrieprüfungen mit endgültiger Aufklappanimation bestanden).
