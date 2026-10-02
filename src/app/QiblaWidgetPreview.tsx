import { useId } from 'react';
import { loadPrayerLocation } from '../services/prayerTimesService';
import type { PrayerLocation } from '../services/prayerTimesService';
import { KAABA, calculateBearing, calculateDistance, getDirectionLabel } from '../services/qiblaGeometry';

export function getQiblaWidgetReading(location: PrayerLocation) {
  const bearing = calculateBearing(location, KAABA);
  const distance = calculateDistance(location, KAABA);
  return { bearing, distance, direction: getDirectionLabel(bearing), source: location.source === 'device' ? 'Gespeicherter Standort' : 'Standardstandort' };
}

export function QiblaWidgetPreview({ location = loadPrayerLocation() }: { location?: PrayerLocation }) {
  const dialId = useId();
  const reading = getQiblaWidgetReading(location);
  const nearby = reading.distance < 1;
  return <div className="qibla-widget">
    <header className="qibla-widget__location"><span>{reading.source}</span><strong>{location.label}</strong></header>
    <div className="qibla-widget__instrument">
      <svg className="qibla-widget__dial" viewBox="0 0 240 240" role="img" aria-label={nearby ? 'Nahe der Kaaba, keine zuverlässige Richtung' : `Qibla ${Math.round(reading.bearing)} Grad ab geografisch Nord. Statische Anzeige.`}>
        <defs>
          <linearGradient id={`${dialId}-rim`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#d9c597"/><stop offset=".28" stopColor="#67786d"/><stop offset=".6" stopColor="#233f35"/><stop offset="1" stopColor="#b39e70"/></linearGradient>
          <radialGradient id={`${dialId}-face`} cx=".35" cy=".18" r=".85"><stop stopColor="#244f42"/><stop offset=".6" stopColor="#102f29"/><stop offset="1" stopColor="#061f1b"/></radialGradient>
        </defs>
        <circle cx="120" cy="122" r="113" fill="#00120f" opacity=".55"/>
        <circle cx="120" cy="120" r="111" fill={`url(#${dialId}-rim)`}/>
        <circle cx="120" cy="120" r="108" fill={`url(#${dialId}-face)`} stroke="#071e19" strokeWidth="2"/>
        <circle cx="120" cy="120" r="102" fill="none" stroke="#c9b47f" strokeOpacity=".25" strokeWidth=".5"/>
        {Array.from({ length: 72 }, (_, index) => <line key={index} x1="120" y1="22" x2="120" y2={index % 6 === 0 ? '33' : index % 3 === 0 ? '29' : '26'} transform={`rotate(${index * 5} 120 120)`} stroke={index % 6 === 0 ? '#e4d0a2' : '#9db4a6'} strokeOpacity={index % 6 === 0 ? '.9' : '.5'} strokeWidth={index % 6 === 0 ? '1.4' : '.7'} />)}
        <g fill="#c8d6c8" fontSize="14" textAnchor="middle" dominantBaseline="central" fontFamily="Inter, sans-serif"><text x="120" y="48" fill="#f0d89d" fontWeight="600">N</text><text x="193" y="120">O</text><text x="120" y="193">S</text><text x="48" y="120">W</text></g>
        <g fill="#8ea99b" fontSize="8" textAnchor="middle" dominantBaseline="central" fontFamily="Inter, sans-serif"><text x="172" y="68">45</text><text x="172" y="172">135</text><text x="68" y="172">225</text><text x="68" y="68">315</text></g>
        <circle cx="120" cy="120" r="53" fill="none" stroke="#91ae9b" strokeOpacity=".15" strokeWidth=".7"/>
        <path d="M120 78V162M78 120H162" stroke="#91ae9b" strokeOpacity=".16" strokeWidth=".7"/>
        {!nearby && <g transform={`rotate(${reading.bearing} 120 120)`} data-bearing={reading.bearing}>
          <path d="M120 49L131 120L120 110Z" fill="#f3dba0"/>
          <path d="M120 49L109 120L120 110Z" fill="#b29251"/>
          <path d="M120 169L109 120L120 129Z" fill="#53776b"/>
          <path d="M120 169L131 120L120 129Z" fill="#8aa598"/>
          <g transform={`translate(120 17) rotate(${-reading.bearing})`}>
            <circle r="16" fill="#0b2620" stroke="#bca474" strokeWidth=".8"/>
            <path d="M-10-6L0-10L10-6L0-2Z" fill="#536055"/>
            <path d="M-10-6L0-2V10L-10 6Z" fill="#192821"/>
            <path d="M0-2L10-6V6L0 10Z" fill="#060f0c"/>
            <path d="M-10-2L0 2L10-2" fill="none" stroke="#e2c27d" strokeWidth="2.5"/>
          </g>
        </g>}
        <circle cx="120" cy="120" r="8" fill={`url(#${dialId}-rim)`}/>
        <circle cx="120" cy="120" r="4" fill="#163d31" stroke="#ddc28a" strokeWidth="1"/>
      </svg>
    </div>
    <div className="qibla-widget__metrics">
      <div className="qibla-widget__reading"><strong>{nearby ? '—' : Math.round(reading.bearing)}<small>{nearby ? '' : '°'}</small></strong><span>{nearby ? 'In unmittelbarer Nähe' : reading.direction}</span></div>
      <div className="qibla-widget__distance"><strong>{Math.round(reading.distance).toLocaleString('de-DE')} <small>km</small></strong><span>Luftlinie zur Kaaba</span></div>
    </div>
    <footer className="qibla-widget__footer">Nordorientiert · Sensor aus</footer>
  </div>;
}
