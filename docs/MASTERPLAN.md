# Masterplan: Nur Islam bis zur Veröffentlichung

Stand: 10. August 2026. Branch `premium-design-finish`.

Dieser Plan ersetzt den Parallelbetrieb mit ChatGPT. Ab jetzt arbeitet nur noch Claude Code am Repository, damit keine Rebases, doppelten Dateien oder überschriebenen Fixes mehr entstehen.

---

## Die Kernaussage

Die App ist technisch weiter, als sie sich anfühlt. Was die Veröffentlichung blockiert, ist **kein Code**:

| Blocker | Wer | Aufwand |
|---|---|---|
| Impressum- und Datenschutzangaben (7 Platzhalter) | **nur Arman** | ~30 Min |
| Fachliche Prüfung der religiösen Inhalte | **nur Arman** (qualifizierte Person beauftragen) | Tage bis Wochen |
| Supabase-Einstellungen im Dashboard | **nur Arman** | ~20 Min |

Solange diese drei offen sind, kann die App nicht veröffentlicht werden, egal wie viel Code entsteht. Deshalb stehen sie in Phase 0 und laufen parallel zu allem anderen.

---

## Was v1.0 ist — und was bewusst nicht

Der schnellste Weg zu „fertig" ist nicht, alles zu bauen, sondern **einen ehrlichen Umfang festzulegen und den vollständig zu machen**.

### In v1.0 drin
- Gebetszeiten live über AlAdhan, mit Standort und Methode
- Vollständiger Quran, 114 Suren, offline, arabisch + deutsche Bedeutung
- Duas, Dhikr, 99 Namen, Qibla, Kalender, Moschee-Suche
- Lernbereich, Hadith-Sammlung, Quiz
- Konto, Cloud-Sicherung, Notizen
- Nur auf Deutsch

### Bewusst nicht in v1.0
- **Weitere Sprachen.** Das alte Repo hatte elf. Jede zusätzliche Sprache vervielfacht *jede* spätere Inhaltsänderung. Erst wenn die deutschen Inhalte fachlich freigegeben sind, lohnt Übersetzung. Sonst übersetzt man Texte, die sich noch ändern.
- **Quran-Rezitation.** Braucht eine lizenzierte Audioquelle. Das ist eine Rechte- und Lizenzfrage, keine Programmieraufgabe. Die Oberfläche täuscht heute korrekterweise keine Wiedergabe vor.

Beides kommt in v1.1. Diese zwei Streichungen sind der größte Zeitgewinn im ganzen Plan.

---

## Phase 0 — Blocker (Arman, ab sofort, parallel)

1. **Impressum ausfüllen.** In `src/data/legalContent.ts` stehen 7× `<<BITTE AUSFÜLLEN>>`: Name, Straße, Ort, E-Mail. `npm run legal:check` schlägt fehl, solange sie da sind — ein Release-Build kommt damit nicht durch.
2. **Fachliche Prüfung beauftragen.** Ich liefere in Phase 1 eine Prüfliste mit jedem Inhalt, seiner Quelle und offenem Prüfstatus. Diese Liste geht an eine qualifizierte Person. Das ist der längste Posten im Plan — deshalb sofort starten.
3. **Supabase-Dashboard prüfen:** E-Mail-Bestätigung erzwungen, Rate-Limits, JWT-Laufzeit, Schutz gegen geleakte Passwörter.
4. **Zwei Testkonten anlegen**, damit `npm run rls:verify` laufen kann.

---

## Phase 1 — Inhalte auf Release-Niveau (Claude)

Der größte inhaltliche Rückstand. Alles mit Quellenangabe, nichts erfunden, Herkunft aus dem Altbestand `nur-islam` oder belegten Quellen.

| Bereich | Jetzt | Ziel |
|---|---|---|
| Hadithe | 8 | 40, thematisch geordnet, mit Sammlung und Nummer |
| Quiz | dünn | 60 Fragen über alle Kategorien, mit Erklärung zur Antwort |
| Lernbereich | 24 Stichpunkte in 6 Kategorien | echte Lektionen mit Fortschritt |
| Assistent | 9 vorgefertigte Antworten | 40 Antworten, klare Grenze bei Rechtsfragen |
| Duas | 47 | Prüfliste je Eintrag, Lücken schließen |

**Ergebnis dieser Phase:** eine vollständige Prüfliste `docs/INHALTE-PRUEFUNG.md` — jeder religiöse Inhalt mit Quelle, Herkunft und Feld für die Freigabe. Das ist das Dokument für Phase 0.2.

---

## Phase 2 — Die letzten Halbfertigen (Claude)

- **Qibla:** Gerätekompass statt nur berechneter Gradzahl
- **Moschee-Suche:** Fehlerfälle und leere Ergebnisse sauber abfangen
- **Assistent:** Grenzen sichtbar machen — was er nicht beantwortet, muss er sagen
- **Onboarding:** einmal komplett durchspielen und glätten

---

## Phase 3 — Qualität (Claude)

- **CSS-Schulden.** 98 Stylesheets, 2281 `!important`, 33 Override-Ebenen. Erst Design-Tokens als einzige Quelle, dann Ebenen auflösen. Ziel: unter 25 Dateien, unter 300 `!important`. Die Bremse `style-debt:check` sorgt dafür, dass es nicht zurückwächst.
- **Jeder Screen einzeln** bei 320, 375 und 430px angeschaut und nachgemessen — nicht nur im Testlauf. Genau dieser Schritt hat den 126px-Navigationsfehler gefunden.
- **Performance:** Bundle aufteilen, aktuell 706 KB CSS in einer Datei.
- Hell-Modus, Reduced Motion, Tastaturbedienung.

---

## Phase 4 — Veröffentlichung

1. Impressum-Daten einsetzen, `NUR_RELEASE=true npm run check`
2. `npm run rls:verify` gegen das echte Projekt
3. `/security-review` auf dem fertigen Stand
4. PWA-Installation auf echtem iPhone und Android testen
5. Store-Entscheidung: PWA über GitHub Pages, oder native Hülle über Capacitor

---

## Reihenfolge und Abhängigkeiten

```
Phase 0 (Arman)  ──────────────────────────────────►  Phase 4
                     ▲
Phase 1 (Inhalte) ───┘ liefert die Prüfliste
        │
        ▼
Phase 2 (Halbfertige)
        │
        ▼
Phase 3 (Qualität)
```

Phase 1 zuerst, weil sie die Prüfliste liefert und die fachliche Prüfung der langsamste Vorgang ist. Während geprüft wird, laufen Phase 2 und 3.

---

## Arbeitsweise ab jetzt

- **Ein Branch, ein Bearbeiter.** Kein paralleler ChatGPT-Zugriff mehr. Sonst entstehen wieder Fälle wie die doppelte `src/main.tsx`.
- **Kleine Commits, sofort gepusht.** Jeder Commit lässt `npm run check` grün.
- **Nichts gilt als fertig, bevor es im Browser in echter Breite nachgemessen wurde.** Grüne Tests haben den Navigationsfehler nicht gefunden — das Nachmessen bei 320px schon.
- **Religiöse Inhalte:** ich prüfe Struktur, Vollständigkeit, Quellenangaben und Konsistenz. Die inhaltliche Richtigkeit bestätigt ein Mensch.
