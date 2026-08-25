# V1 Source Audit — Qibla Guidance

Status: **source-audited / GRÜN mit Geräte-QA offen**

> Quellen-/Technikprüfung, keine Gelehrtenfreigabe und kein Ersatz für reale Magnetometer-Tests.

## Religiöse Grundlage

**Quran 2:144** weist die Betenden an, das Gesicht in Richtung der al-Masjid al-Haram zu wenden. Diese Grundlage wird nun direkt im Qibla-Screen sichtbar genannt.

## Technische Umsetzung

- Peilung wird mathematisch vom gespeicherten Gerätestandort zur Kaaba berechnet.
- Ohne echten Gerätestandort zeigt die App keine persönliche Gradzahl und keine persönliche Kompassnadel.
- Der Berlin-Standardwert bleibt nur interner Fallback und wird nicht als Nutzerposition ausgegeben.
- Safari/WebKit `webkitCompassHeading` wird als nordbezogener Sensorwert behandelt.
- Standard-`alpha` wird nur verwendet, wenn `event.absolute === true` ist.
- Wo verfügbar, wird absolute Orientierung/Magnetometer über `requestPermission(true)` angefragt.
- Fehlende oder schwache Genauigkeitsangaben werden sichtbar als Unsicherheit dargestellt.
- Die App behauptet nicht, ein Gerätesensor sei technisch oder religiös unfehlbar.

## Ergebnis

`qibla-guidance` ist auf Source-Audit-Ebene abgeschlossen.

Offen bleibt ausschließlich die reale Geräte-QA: iPhone/Android, Magnetometer, Browserberechtigungen, Displayrotation und Störquellen. Diese Tests dürfen nicht erfunden werden.
