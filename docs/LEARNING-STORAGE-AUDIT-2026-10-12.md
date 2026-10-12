# Lernfortschritt · Speicherung und Anzeigen · 12. Oktober 2026

## Geprüfter Umfang und reproduzierte Fehler

Gemeinsamer Ablauf der 44 Grundlagenlektionen in `LearningCourseScreen`,
Wiederaufnahme und Abschlussanzeige in `LearnScreen`. Keine Bestätigung der
religiösen Inhalte der übrigen 31 Lektionen. Gebets-/Prophetenkurse nutzen andere
Speicherwege und sind durch diese Änderung nicht abgesichert.

Zwei Tests vor der Korrektur tatsächlich fehlgeschlagen:

1. Vorhandenes `{broken` bei `nur_learning_completed` wurde schon beim Öffnen
   zu `[]`: Lesehilfe lieferte bei Fehler eine leere Menge, der Effekt schrieb
   diese ohne Benutzeraktion zurück.
2. Bei einer korrekt beantworteten Frage und einem geworfenen Schreibfehler
   zeigte der Dialog trotzdem „Der Fortschritt wurde lokal gespeichert“,
   erhöhte Abschlusszahl und Fortschrittsprozent.

Zusätzliche Codebefunde: Automatisches Umschreiben der letzten Lektionsposition,
keine Schreibbestätigung beim Zurücksetzen, beliebige Arrayelemente mittels
`String` umgewandelt, Erfolgssymbol auch bei Fehlermeldungen und ein rechts
abgeschnittener Kurstoast. Der Inhaltsabgleich hatte diese Fehler nicht behoben.

## Korrekturen und Belege

| Aussage / Vorgang | Verhalten und maßgebliche Implementierung |
|---|---|
| Öffnen liest nur | Kein Effekt schreibt Abschlüsse oder Lektionsposition beim Mount. `readLearningProgress` und `readLearningPosition` in `src/services/learningProgress.ts`. |
| Ungültige Daten | Nur Arrays nichtleerer Strings gelten als lesbar; keine Umwandlung von Zahlen/Objekten. JSON-Fehler, `null`, falsche Formen und Leseausnahmen werden nicht automatisch überschrieben. Kein erfundener 0-%-Stand: Lernübersicht und Kurs kennzeichnen unbekannten Fortschritt. |
| Erhaltene Altwerte | Unbekannte alte String-IDs bleiben im gültigen Bestand erhalten, zählen aber nicht als heute vorhandene Lektionen. Abschluss/Reset liest den aktuellen Bestand vor der einzelnen Änderung, statt die beim Öffnen geladene ganze Liste zurückzuschreiben. |
| Abschluss | `updateLearningCompletion` validiert die angefragte reale Lektions-ID, schreibt und vergleicht den rückgelesenen Wert. Erst nach Bestätigung aktualisiert die Oberfläche den gespeicherten Abschlussstand und zeigt Speicherung als erfolgreich. |
| Richtige Antwort ohne Bestätigung | Die Verständnisfrage bleibt als richtig beantwortet erkennbar. Dialog: „Richtig beantwortet“ und „Speicherung nicht bestätigt“, kein fiktiv erhöhter gespeicherter Fortschritt. Ein dauerhafter Hinweis bleibt nach Schließen des Dialogs bestehen. |
| Zurücksetzen | Nur die gewählte Lektion wird aus dem aktuell gelesenen Bestand entfernt. Fehler lassen die zuletzt bestätigte Anzeige bestehen; Toast und dauerhafter Hinweis melden fehlende Bestätigung. Andere Kurs-/Alt-IDs bleiben erhalten. |
| Letzte Lektionsposition | Keine automatische Reparatur eines unbekannten Zeigers beim Öffnen. Eine ausdrücklich gewählte andere Lektion kann ihn ersetzen. Navigation bleibt bei Schreibfehler nutzbar, aber Speicherung für spätere Sitzungen wird nicht behauptet. Lesen vor Schreiben; Rücklesen für Bestätigung. |
| Bedeutung der Anzeigen | „Verständnisfrage offen“ ersetzt „Noch nicht gelesen“: Die App weiß nicht, ob jemand den Text bereits gelesen hat. Dialogbezeichnung „Verständnisfrage beantwortet“ statt „Kurs abgeschlossen“ beim Abschluss einer einzigen Lektion. |
| Toast | Derselbe bestehende CSS-Baustein; `x: '-50%'` bleibt in allen Bewegungszuständen erhalten. `role=status`, Fehler mit X statt Erfolgszeichen, Timer vor neuer Meldung und beim Unmount bereinigt. Keine neue CSS-Schicht. |
| Teilen | Fehlgeschlagenes Kopieren ist nicht pauschal eine vom Nutzer abgebrochene Freigabe. Nur `AbortError` wird als Abbruch bezeichnet, andere Fehler als nicht erfolgreich geteilt/kopiert. |

Belege sind die gelesenen Implementierungen und tatsächlichen Regressionstests,
keine externe religiöse Quelle oder fachliche Freigabe. Quellen-/Lektionen-
Inhalte wurden durch diese Funktionskorrektur nicht ersetzt.

## Verifikation

- **43 gezielte Tests** in `src/services/learningProgress.test.ts` und
  `src/screens/LearningCourseScreen.test.ts` bestanden; davon 33 neu, zehn
  vorhandene Wiederaufnahme-/Zahlentests weiter erhalten.
- Fälle: gültiger Abschluss, Wiederaufnahme, expliziter Reset, andere Kurs-
  und Altwerte, fehlerhaftes JSON/Datentypen, Leseverweigerung, geworfene und
  verworfene Schreibvorgänge, fehlendes Rücklesen, aktuell veränderte Daten,
  Cursorfehler und passende sichtbare Dialog-/Statusmeldungen.
- Vollständiger `npm run check` **Exit 0**, **878 Tests in 54 Dateien**, zehn
  Node-Prüferregressionen, Typprüfung, Build und Budget:
  `/private/tmp/nur-learning-storage-check-completed-20261012.log`.
- Gemessen JS 376, CSS 123, Gesamt 499 KB gzip. Gegenüber Säulen-Abgleich
  +1 KB JS/Gesamt für die Speicher-/Warnzustände; Entry unverändert 92/95 KB,
  CSS-Grenze 123 KB und Raw-Grenze 500 KB unverändert. Erster Gesamtcheck
  scheiterte nur am bisherigen JS-Budget, nicht an den 878 Tests.
- Browserlauf mit installiertem Chrome, Produktionsbuild und getrennten
  Test-Browserprofilen: **24 Fälle bestanden (2,2 Minuten), Exit 0**;
  `/private/tmp/nur-learning-storage-e2e-20261012.log`. Sechs bestehende
  Quellen-/Inhaltsfälle plus 18 neue Speicherfälle bei 320/768/1280 px:
  Abschluss/Reload/Wiederaufnahme/Reset, Schreibausnahme, verworfener Schreib-
  vorgang, verweigertes Rücklesen, unlesbare Altwerte und fehlgeschlagener Reset.
  Toastgrenzen direkt gemessen. Drei repräsentative Bilder tatsächlich gesehen:
  Fehler-Toast/320, unbestätigter Dialog/768, bestätigter Dialog/1280.
- Drei zusätzliche Browserfälle **bestanden (15,7 Sekunden), Exit 0** mit
  expliziten Assertierungen für die unbekannte Lernübersicht vor Betreten des
  Kurses: `—` und „nicht lesbar“, nicht `0% abgeschlossen`;
  `/private/tmp/nur-learning-overview-invalid-e2e-20261012.log`.
- `git diff --check` und `npm run review:check` bestanden. Inventar unverändert
  1.146 Positionen, kein daraus abgeleiteter vollständiger Quellenabschluss.
- App-Shell und Registrierung gemeinsam v69. Keine Änderung oder Löschung
  realer Benutzerdaten, Veröffentlichung, neuer Funktion oder Abhängigkeit.

## Grenzen

Bestätigtes Rücklesen beweist nicht unbegrenzte Speicherdauer: Nutzer/Browser
können Daten später löschen. Keine dauerhafte Backup- oder Synchronisations-
Garantie. Kein echtes Gerät, Safari, Speicher-Hardware oder Magnetometer getestet.

Bei erfolgreichem Schreiben und anschließend verweigertem Rücklesen kann der
neue Wert tatsächlich vorhanden sein. Die App sagt deshalb „nicht bestätigt“,
nicht sicher „nicht gespeichert“, und führt keinen spekulativen Rollback aus.

Aktuellen Bestand vor einer Mutation lesen schützt vor bereits vorhandenen
Änderungen anderer Tabs. Local Storage ist aber keine atomare Transaktion über
mehrere Tabs; nahezu gleichzeitig eintreffende Änderungen sind damit nicht
vollständig ausgeschlossen. Kein Live-Sync-Versprechen: eine geöffnete Anzeige
kann den zuletzt bestätigten Stand zeigen. Andere Speicherwege der App bleiben
Teil der laufenden Gesamtprüfung.

## Dateistand

SHA-256 nach den abgeschlossenen Tests. Hashes bestätigen Identität der Dateien,
nicht eine Fachfreigabe oder vollständige Geräte-/App-Abdeckung.

| Datei | SHA-256 |
|---|---|
| `src/services/learningProgress.ts` | `dc6687507b1cfde0212ddd205dfccc0dc2cce29cab42222aa44acf562f113e71` |
| `src/screens/LearningCourseScreen.tsx` | `ad457a603d379b98fbbd265b4a017afd575f61e5642746b558ba9f961e110061` |
| `src/screens/LearnScreen.tsx` | `9eed1800071bd4f54c83346d52faa3f2107f2bbd4148e28f4275a81568297169` |
| `e2e/learning-progress-storage.spec.ts` | `61b02695f56acea59cc70fcff0c9ae287e9eeced30888b73a246da8e4d45f456` |
