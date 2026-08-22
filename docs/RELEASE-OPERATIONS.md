# Release-Betrieb

Was passiert, wenn nach der Veröffentlichung etwas schiefgeht. Ohne diesen
Ablauf ist ein Release ein einmaliges Ereignis statt eines Betriebszustands.

**Grundregel:** Die Datenschutzerklärung sagt ausdrücklich „kein Tracking" zu.
Alles hier kommt ohne Analytics-Bibliothek aus. Sentry, Google Analytics oder
Vergleichbares nachträglich einzubauen, würde diese Zusage brechen — das wäre
eine bewusste Entscheidung mit neuer Datenschutzerklärung und Einwilligung,
kein Implementierungsdetail.

---

## Versionsanzeige

Damit eine Fehlermeldung zuordenbar ist, muss der Nutzer sagen können, welche
Version läuft.

- [ ] App-Version aus `package.json` im Mehr-Bereich sichtbar machen.
- [ ] Service-Worker-Cache-Version danebenstellen — bei einer PWA ist das die
      Frage, die zuerst zählt: Läuft überhaupt der neue Stand?

Aktuell: `package.json` steht auf `0.3.0`, der Service Worker auf
`nur-islam-premium-v14-20260808-release-hardening`. Beide sind im Build, aber
für den Nutzer nicht sichtbar.

---

## Fehler melden

Ohne Crash-Reporting ist die Nutzermeldung der einzige Kanal. Er muss deshalb
funktionieren.

- [ ] Kontaktadresse im Mehr-Bereich, dieselbe wie im Impressum.
- [ ] „Fehler melden" mit vorbereitetem Betreff, der App-Version und
      Service-Worker-Version enthält.
- [ ] Keine automatische Übermittlung von Nutzerinhalten — der Nutzer schreibt,
      was er schreiben will.

---

## Bekannte Probleme

- [ ] Eine gepflegte Liste, im Repository und in der App verlinkt.

Verhindert wiederholte Meldungen desselben Fehlers und macht sichtbar, dass er
bekannt ist.

---

## Release Notes

- [ ] `CHANGELOG.md` je Veröffentlichung: was ist neu, was ist repariert, was
      ist bekannt.
- [ ] Bei religiösen Inhalten zusätzlich: welche Blöcke neu freigegeben wurden
      und von wem.

Der zweite Punkt ist der wichtigere. Wer wissen will, ob ein Inhalt geprüft ist,
soll das nachlesen können, ohne den Code zu öffnen.

---

## Fehlerdiagnose ohne Tracking

Was ohne jede Übertragung geht:

| Symptom | Wie man drankommt |
| --- | --- |
| Weiße Seite | Nutzer schickt Screenshot der Browser-Konsole |
| Falsche Gebetszeiten | Nutzer nennt Ort, Methode, Asr-Schule und angezeigte Quelle |
| Erinnerung kommt nicht | Freigabestatus, Betriebssystem, ob PWA installiert |
| Alter Stand nach Update | Service-Worker-Version aus der Versionsanzeige |
| Offline-Fehler | Ob die App vorher einmal vollständig online geladen wurde |

Alle fünf setzen die Versionsanzeige oben voraus. Sie ist deshalb der erste
Punkt, nicht der letzte.

---

## Rollback

GitHub Pages veröffentlicht, was auf `main` liegt.

**Zurückrollen:**

1. Den fehlerhaften Commit auf `main` per `git revert` rückgängig machen.
2. Der Pages-Workflow läuft erneut und veröffentlicht den vorherigen Stand.

**Wichtig bei einer PWA:** Ein Rollback erreicht nur Geräte, die den Service
Worker aktualisieren. Der Worker prüft bei jedem Start auf eine neue Version
(`updateViaCache: 'none'`), aber ein Gerät, das die App nicht öffnet, bleibt
auf dem alten Stand. Ein Rollback wirkt also nicht sofort für alle.

- [ ] Prüfen, ob für einen schweren Fehler ein erzwungener Update-Pfad nötig ist
      (Cache-Version erhöhen, damit der alte Cache verworfen wird).

### Schutz von `main`

Ein Ruleset namens `main safety` verhindert Force-Push und Löschen des Branches.
Mehr ist bewusst nicht gesetzt: Ein PR-Zwang bringt einem Ein-Personen-Repo
wenig — der eigene Pull Request lässt sich nicht selbst freigeben — und die
Veröffentlichung hängt ohnehin am Workflow.

Falls das später enger werden soll, etwa weil jemand mitarbeitet:

```bash
gh api --method POST repos/memetreza34-ux/nur-islam-premium-redesign/rulesets --input - <<'EOF'
{
  "name": "main release protection",
  "target": "branch",
  "enforcement": "active",
  "conditions": { "ref_name": { "include": ["~DEFAULT_BRANCH"], "exclude": [] } },
  "rules": [
    { "type": "deletion" },
    { "type": "non_fast_forward" },
    { "type": "pull_request", "parameters": {
        "required_approving_review_count": 0,
        "dismiss_stale_reviews_on_push": true,
        "require_code_owner_review": false,
        "require_last_push_approval": false,
        "required_review_thread_resolution": false,
        "allowed_merge_methods": ["merge", "squash", "rebase"] } },
    { "type": "required_status_checks", "parameters": {
        "strict_required_status_checks_policy": true,
        "required_status_checks": [
          { "context": "validate" },
          { "context": "smoke" } ] } }
  ]
}
EOF
```

Das vorhandene `main safety`-Ruleset vorher entfernen, sonst gelten beide.

`v1-religious-content-release-gate` ist hier absichtlich **nicht** als
Pflicht-Check aufgeführt. Als solcher würde er jeden Merge nach `main` sperren,
bis alle 42 Inhaltsblöcke freigegeben sind — auch einen reinen Technik-Hotfix.
Die Veröffentlichung sperrt er ohnehin, weil der Pages-Workflow ihn ausführt.
Wer das trotzdem will, hängt die Zeile an die Liste an.

---

**Nicht rückgängig zu machen:** eine Änderung an der Cloud-Datenstruktur. Ein
Restore mit einer nicht unterstützten `schema_version` wird abgelehnt — das ist
richtig, heißt aber, dass ein Schema-Rückschritt Nutzerdaten unlesbar machen
kann. Schema-Änderungen brauchen deshalb einen eigenen Migrationsweg.

---

## Hotfix

1. Branch von `main`.
2. Fix plus Test, der den Fehler abdeckt.
3. `npm run check` und `npm run e2e` lokal.
4. Pull Request nach `main`. Der religiöse Gate läuft mit — ein Hotfix darf
   nicht die Tür sein, durch die ungeprüfte Inhalte gehen.
5. Nach dem Deployment prüfen, dass die neue Version wirklich ausgeliefert wird.

Schritt 4 ist der, den man unter Druck überspringen will. Genau dafür hängt der
Gate am Deployment und nicht nur am Pull Request.

---

## Vor jedem Release

- [ ] `npm run check` grün
- [ ] `npm run e2e` grün
- [ ] Religiöser Gate grün (alle 42 Blöcke freigegeben)
- [ ] Impressum ausgefüllt
- [ ] CHANGELOG aktualisiert
- [ ] Auf einem echten Gerät geöffnet, nicht nur im Simulator
- [ ] Installierte PWA aktualisiert sich auf den neuen Stand
- [ ] Offline-Start funktioniert nach dem Update
