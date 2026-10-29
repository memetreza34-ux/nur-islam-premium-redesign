# Bildmotive ohne eingebrannte Zeichen

Die vorhandenen drei Illustrationen wurden mit Codex built-in Imagegen als Referenz bearbeitet. Entfernt wurden die „99“ samt rundem Goldrahmen auf dem Buch, das Fragezeichen auf den Quiz-Karten und die „25“ auf der Schriftrolle. Perspektive, Formen, Materialien und Farbwelt bleiben an den bisherigen Motiven orientiert. Zahlen in Beschriftungen und Fortschrittsanzeigen bleiben erhalten.

| Motiv | Aktuelles App-Bild | Generierte PNG-Vorlage |
| --- | --- | --- |
| Namen Allahs | [home-names-v5.webp](../public/premium-assets/high-res-objects/home-names-v5.webp) | [names.png](../output/imagegen/plain-feature-icons-20261022/names.png) |
| Quiz | [home-quiz-v6.webp](../public/premium-assets/high-res-objects/home-quiz-v6.webp) | [quiz.png](../output/imagegen/plain-feature-icons-20261022/quiz.png) |
| Propheten | [learn-hub-prophets-v2.webp](../public/premium-assets/high-res-objects/learn-hub-prophets-v2.webp) | [prophets.png](../output/imagegen/plain-feature-icons-20261022/prophets.png) |

[Vollständige Prompts und Eingabevorlagen](../output/imagegen/plain-feature-icons-20261022/prompts.json). Generation begann am 22. Oktober, abschließende Prüfung am 23. Oktober 2026. Runtime-Dateien: 512 × 512 WebP, echte Transparenz erhalten; cwebp q88, m6, alpha_q100. Alte Dateien und historische Herkunftsnachweise bleiben erhalten. Neue Dateien sind im Herkunftsmanifest mit SHA-256 dokumentiert und mit PWA-Version 119 offline vorgemerkt.

Prüfung: `npm run check` bestanden, einschließlich 1.145 Tests in 62 Dateien und Build-Budget. Zehn vorhandene Browserprüfungen aus `learning-intro-art.spec.ts` und `interaction-feedback.spec.ts` bestanden, darunter Lernbereich bei 320, 390 und 768 Pixeln. Die Handyaufnahme wurde visuell geprüft. Dies ersetzt keine Prüfung auf physischen Geräten.

[App-Aufnahme bei 390 Pixeln](plain-feature-icons-2026-10-23/learning-390.png).

Protokolle: `/tmp/nur-plain-icons-check-20261022.log`, `/tmp/nur-plain-icons-browser-20261023.log`. Lokale App auf Port 3004 antwortet mit HTTP 200.
