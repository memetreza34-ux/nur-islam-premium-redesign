# V1 Religious Release Gate

## Zweck

Religiöse P0-Inhalte dürfen für Release 1 nicht allein deshalb als freigegeben gelten, weil technisch Quellenfelder vorhanden sind. Der finale Merge nach `main` verlangt eine dokumentierte fachliche Freigabe.

Der technische Gate läuft über:

```bash
node scripts/check-v1-religious-release-approval.mjs
```

Im GitHub-Workflow `Premium redesign check` wird dieser Gate automatisch bei Pull Requests nach `main` ausgeführt.

## Aktueller P0-Prüfumfang

### Anfänger-Grundlagen

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

### Weitere religiöse P0-Inhalte

11. `names-of-allah` – 99 Namen: Reihenfolge, arabische Schreibweise, Transliteration und deutsche Bedeutungsangaben prüfen.
12. `dhikr-counter-steps` – einzelne Dhikr-Zählertexte und deren Einzelnachweise prüfen.

Statusdatei: `src/data/coreContentReview.ts`

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

## Änderung nach Freigabe

Wird ein bereits freigegebener religiöser Inhalt inhaltlich geändert, muss seine Freigabe erneut bewertet werden. Bei materiellen Änderungen ist der Status bis zum erneuten Review wieder auf `pending` zu setzen.

## Was bewusst nicht durch Code entschieden wird

Der technische Gate entscheidet nicht, ob eine religiöse Aussage richtig ist. Er prüft nur, ob für jeden release-kritischen Inhalt ein dokumentierter menschlicher/fachlicher Freigabeschritt vorhanden ist.

Legacy-Bereiche wie Quiz, Propheten, Hajj/Umrah, Ummah, Zakat und weitere noch nicht freigegebene Module bleiben unabhängig davon über die v1-Release-Grenze aus den öffentlichen Hubs ausgeschlossen.
