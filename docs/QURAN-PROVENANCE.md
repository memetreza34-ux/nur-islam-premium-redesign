# Quran-Bestand: was die App mitliefert und was nicht

## Die Entscheidung

Die App liefert **den arabischen Uthmani-Text** mit und **keine deutsche
Übersetzung**. Die deutsche Wiedergabe wird beim Öffnen einer Sure von Al Quran
Cloud geladen (`de.bubenheim`) und im Browser des Nutzers zwischengespeichert.

Das ist kein technisches Detail, sondern der Grund, warum es hier keine offene
Lizenzfrage gibt:

- **Arabischer Text** — kein geschütztes Werk, liegt vollständig offline vor
  und macht den Reader ohne Verbindung nutzbar.
- **Deutsche Übersetzung** — Bubenheim & Elyas ist ein geschütztes Werk. Sie
  vollständig mitzuliefern hieße, dass die App sie selbst verbreitet; das
  bräuchte die Erlaubnis des Rechteinhabers. Beim Abruf pro Sure liefert der
  Anbieter den Text aus, der Browser des Lesers behält seine Kopie, und diese
  App verteilt nichts davon.

Der Preis ist ehrlich zu nennen: **ohne Verbindung ist beim ersten Öffnen einer
Sure kein deutscher Text da**, nur der arabische. Einmal geöffnete Suren bleiben
danach auch offline lesbar.

## Was daraus folgt

| Frage | Stand |
| --- | --- |
| Arabischer Wortlaut | liegt offline vor, 114 Suren |
| Deutsche Übersetzung | wird abgerufen, nicht mitgeliefert |
| Lizenz arabischer Text | unkritisch |
| Lizenz deutsche Übersetzung | **entfällt für diese App**, da nicht verbreitet |
| Verfügbarkeit ohne Netz | Arabisch ja, Deutsch erst nach einmaligem Laden |

## Was weiterhin zu prüfen bleibt

- [ ] Die Nutzungsbedingungen von Al Quran Cloud für den Abruf im Produktivbetrieb.
- [ ] Ob der arabische Bestand aus einer Quelle stammt, deren Herkunft
      dokumentiert ist — die Textidentität ist das eine, die Herkunft der
      konkreten Dateien das andere.
- [ ] Die fachliche Freigabe des Quran-Bereichs. Sie ist von der Lizenzfrage
      unabhängig und steht weiterhin aus.

Die Aussage „der Text stimmt" und die Aussage „wir dürfen ihn verbreiten" sind
zwei verschiedene Dinge. Diese Datei beantwortet nur die zweite, und zwar
dadurch, dass die App die Übersetzung gar nicht erst verbreitet.
