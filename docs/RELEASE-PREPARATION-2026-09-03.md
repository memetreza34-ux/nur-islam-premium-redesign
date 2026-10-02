# Release-Vorbereitung · 3. September 2026

## Umgesetzt

- Interne Hinweise zu Migration, ausstehender Endprüfung und fachlicher Freigabe aus Lernen, Prophetenkursen, Rechtsschulen, Duas, Namen, Wudu und weiteren Leseansichten entfernt.
- Keine ersatzweisen „geprüft“- oder „freigegeben“-Behauptungen eingefügt. Der Prophetenkurs verweist neutral auf seine Quran-Belegstellen.
- Bei fünf Duas nur die unbestätigte Bewertung aus dem Altbestand entfernt; die vorhandenen Fundstellen bleiben unverändert. Arabisch, Umschrift und Bedeutung sind unverändert.
- Nutzerrelevante Grenzen bleiben sichtbar: sinngemäße Wiedergaben, Quellenlücken, Wudu-Illustrationen, unterschiedliche Überlieferungsbewertungen und Abgrenzung der Hajj-Ablaufbeschreibung von Rechtsurteilen.
- Kein Eingriff in gespeicherte Lernstände, Favoriten oder Navigation. Keine Veröffentlichung und keine Änderung von menschlichen Prüfstatus auf „approved“.
- Prüfdokumente intern aktualisiert. Ein automatischer UI-Text-Check verhindert die Rückkehr der internen Statusmeldungen.
- Im vollständigen Browserlauf gefundene Darstellungsfehler behoben: Lernkachel-Beschreibungen werden auf schmalen Geräten nicht mehr nach zwei Zeilen abgeschnitten; Kachelnummern, Hijri-Tageszahlen und der Fastenhinweis erhalten im hellen Design besser lesbare Farben.
- Veraltete Browser-Tests an den bestehenden allgemeinen Lerneinstieg und die getrennten Offline-Hinweise für Quran-Aussprache/Bedeutung angepasst. Die eigentlichen Funktionsprüfungen bleiben erhalten.
- Ungeklärte Hisn-al-Muslim-Audioaufrufe aus Gebetskurs, Datenschutzangaben und Content Security Policy entfernt. Nur Quran-Rezitation von Mishary Alafasy über Islamic Network bleibt aktiv und wird erst nach Antippen gestreamt.

## Verifiziert / noch ausstehend

- `npm run check`: bestanden, einschließlich Quellenschutz, **228 Unit-Tests**, Lint, Produktions-Build und Bundle-Budget.
- Abschließender Browser-Gesamtlauf auf dem korrigierten Stand: **122 bestanden**, 2 optionale Exporttests ohne gesetztes `SNAP`/`SHOT_DIR` planmäßig übersprungen, keine Fehler. Dazu gehören vier neue Tests für die bereinigte Oberfläche und erhaltene Quellen-/Lizenzhinweise. Projektcheck und Browserlauf liefen abschließend nacheinander.
- Sichtkontrolle im vorhandenen App-Tab auf Port 4178: Lernraster ohne Prüfhinweis, Schlusszitat direkt darunter.
- `npm run recitation:verify`: alle **11** verwendeten Quran-Aufnahmen beim offiziellen Islamic-Network-CDN erreichbar.
- `NUR_RELEASE=true npm run legal:check`: erwartungsgemäß **blockiert**. Straße, PLZ/Ort und E-Mail enthalten weiterhin Platzhalter. Betreibername ist eingetragen, aber noch nicht vom Betreiber bestätigt.

## Keine öffentliche Release-Freigabe

Das Entfernen der UI-Hinweise schließt die vorhandenen P0-Punkte nicht:

1. Vollständige, bestätigte Betreiberangaben und finale rechtliche Prüfung.
2. Qualifizierter religiöser Fachreview gemäß [Prüfübergabe](RELIGIOUS-REVIEW-HANDOFF.md).
3. Dokumentierte Tests auf realem iPhone und Android-Gerät, insbesondere Standort, Qibla, Installation, Updates und Benachrichtigungen. Siehe [Gerätetest](REAL-DEVICE-QA.md).

Zusätzlicher technischer Prüfpunkt aus der aktuellen Bestandskontrolle: `prayerTimesService.ts` verwendet ohne Live-/Cache-Daten einen festen Ersatzzeitplan. Er ist als „Offline-Ersatzzeitplan“ gekennzeichnet und darf nicht als verlässlicher Tagesplan verstanden werden. Eine Release-Abnahme muss diesen Zustand einschließlich Erinnerungen ausdrücklich einschließen; dieser Turn hat die Gebetszeitberechnung nicht verändert.

Die bestehende [Release-Checkliste](RELEASE-CHECKLIST.md) bleibt maßgeblich. Keine dieser offenen Voraussetzungen wurde durch das Entfernen eines Textes als erledigt markiert.
