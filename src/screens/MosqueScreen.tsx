import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Accessibility,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  Clock3,
  ExternalLink,
  Filter,
  Globe2,
  LocateFixed,
  LoaderCircle,
  Map,
  MapPin,
  Navigation,
  Phone,
  RefreshCw,
  Route,
  Search,
  ShieldCheck,
  WifiOff,
  X,
} from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useDialog } from '../shared/useDialog';
import {
  DEFAULT_MOSQUE_ORIGIN,
  fetchNearbyMosques,
  getOpenStreetMapDirectionsUrl,
  getOpenStreetMapUrl,
  readMosqueCache,
  readMosqueOrigin,
  requestMosqueLocation,
} from '../services/mosqueService';
import type {
  MosqueResult,
  MosqueSearchOrigin,
  MosqueSearchSnapshot,
} from '../services/mosqueService';
import { MosqueScene, PremiumImage } from '../shared/PremiumVisuals';

type FinderStatus = 'loading' | 'live' | 'cache' | 'fallback' | 'error' | 'location-denied';

function formatDistance(distanceKm: number) {
  if (distanceKm < 1) return `${Math.max(10, Math.round(distanceKm * 1000 / 10) * 10)} m`;
  return `${distanceKm.toLocaleString('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} km`;
}

function formatUpdatedAt(value: string | undefined) {
  if (!value) return 'Noch nicht geladen';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Unbekannter Zeitpunkt';
  return new Intl.DateTimeFormat('de-DE', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }).format(date);
}

function formatDenomination(value: string | undefined) {
  if (!value) return 'Konfession nicht hinterlegt';
  return value.replaceAll('_', ' ').replace(/\b\w/g, (letter) => letter.toLocaleUpperCase('de-DE'));
}

function formatWheelchair(value: string | undefined) {
  if (value === 'yes') return 'Rollstuhlgerecht';
  if (value === 'limited') return 'Teilweise rollstuhlgerecht';
  if (value === 'no') return 'Nicht rollstuhlgerecht';
  return 'Barrierefreiheit nicht hinterlegt';
}

function openExternal(url: string) {
  window.open(url, '_blank', 'noopener,noreferrer');
}

function getOriginMapUrl(origin: MosqueSearchOrigin) {
  return `https://www.openstreetmap.org/#map=14/${origin.latitude}/${origin.longitude}`;
}

export function MosqueScreen({ onBack }: { onBack: () => void }) {
  const initialOrigin = useMemo(readMosqueOrigin, []);
  const [origin, setOrigin] = useState<MosqueSearchOrigin>(initialOrigin);
  const [snapshot, setSnapshot] = useState<MosqueSearchSnapshot | null>(() => readMosqueCache(initialOrigin));
  const [status, setStatus] = useState<FinderStatus>(() => snapshot?.source ?? 'loading');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<MosqueResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();
  const toastTimerRef = useRef<number | null>(null);
  const screenTransition = { duration: reduceMotion ? 0 : .28, ease: [0.22, 1, 0.36, 1] as const };
  const microTransition = { duration: reduceMotion ? 0 : .18, ease: [0.22, 1, 0.36, 1] as const };
  const itemTransition = (index: number) => ({ duration: reduceMotion ? 0 : .18, delay: reduceMotion ? 0 : Math.min(index * .02, .1), ease: [0.22, 1, 0.36, 1] as const });

  const closeDialog = useCallback(() => { setSelected(null); }, []);
  const mosqueDialog = useDialog(Boolean(selected), closeDialog, selected?.name);

  const flash = (message: string) => {
    if (toastTimerRef.current !== null) window.clearTimeout(toastTimerRef.current);
    setToast(message);
    toastTimerRef.current = window.setTimeout(() => {
      setToast(null);
      toastTimerRef.current = null;
    }, 2400);
  };

  const loadMosques = async (targetOrigin: MosqueSearchOrigin, forceRefresh = false) => {
    setStatus('loading');
    setError(null);
    try {
      const result = await fetchNearbyMosques(targetOrigin, 10000, forceRefresh);
      setOrigin(targetOrigin);
      setSnapshot(result);
      setStatus(result.source);
      if (forceRefresh) flash(result.source === 'live' ? 'Moscheen wurden aktualisiert' : 'Gespeicherte Moscheen werden angezeigt');
    } catch (reason) {
      const message = reason instanceof Error ? reason.message : 'Die Moschee-Suche ist derzeit nicht erreichbar.';
      setError(message);
      setStatus('error');
    }
  };

  useEffect(() => {
    let active = true;
    void fetchNearbyMosques(initialOrigin)
      .then((result) => {
        if (!active) return;
        setSnapshot(result);
        setStatus(result.source);
        setError(null);
      })
      .catch((reason: unknown) => {
        if (!active) return;
        setError(reason instanceof Error ? reason.message : 'Die Moschee-Suche ist derzeit nicht erreichbar.');
        setStatus('error');
      });
    return () => { active = false; };
  }, [initialOrigin]);

  useEffect(() => () => {
    if (toastTimerRef.current !== null) window.clearTimeout(toastTimerRef.current);
  }, []);

  const useDeviceLocation = async () => {
    setStatus('loading');
    setError(null);
    try {
      const deviceOrigin = await requestMosqueLocation();
      await loadMosques(deviceOrigin, true);
      flash('Moscheen für deinen Standort geladen');
    } catch (reason) {
      const message = reason instanceof Error ? reason.message : 'Standort konnte nicht ermittelt werden.';
      setError(message);
      setStatus(message.includes('nicht freigegeben') ? 'location-denied' : 'error');
      flash(message);
    }
  };

  const visible = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase('de-DE');
    const results = snapshot?.results ?? [];
    if (!normalized) return results;
    return results.filter((mosque) => [
      mosque.name,
      mosque.address,
      mosque.denomination,
      mosque.openingHours,
      mosque.serviceTimes,
    ].filter(Boolean).join(' ').toLocaleLowerCase('de-DE').includes(normalized));
  }, [query, snapshot]);

  const statusLabel = status === 'live'
    ? 'Live von OpenStreetMap'
    : status === 'cache'
      ? 'Gespeicherte Live-Daten'
      : status === 'fallback'
        ? 'Älterer Offline-Cache'
        : status === 'location-denied'
          ? 'Standort nicht freigegeben'
          : status === 'error'
            ? 'Datenquelle nicht erreichbar'
            : 'Moscheen werden gesucht …';

  const resultCount = snapshot?.results.length ?? 0;

  return (
    <motion.main className="screen reference-mosque-screen reference-mosque-screen--live" initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }} animate={{ opacity: 1, y: 0 }} transition={screenTransition}>
      <header className="reference-screen-header">
        <button className="icon-button" onClick={onBack} aria-label="Zurück"><ChevronLeft size={20} /></button>
        <div><span className="overline">In deiner Nähe</span><h1>Moschee-Finder</h1></div>
        <button className="icon-button" onClick={() => void loadMosques(origin, true)} aria-label="Moscheen aktualisieren" disabled={status === 'loading'}><RefreshCw size={20} className={status === 'loading' ? 'is-spinning' : ''} /></button>
      </header>

      <section className="reference-mosque-hero">
        <PremiumImage src="/premium-assets/high-res-objects/mosque-gold-v2.webp" fallback={<MosqueScene />} priority />
        <div><span className="hero-pill">{origin.label}</span><h2>Finde einen Ort<br />für dein Gebet.</h2><p>Echte Moschee- und Gebetsraumdaten im Umkreis von zehn Kilometern.</p><button className="reference-mosque-location-button" onClick={() => void useDeviceLocation()} disabled={status === 'loading'}><LocateFixed size={16} /> Eigenen Standort verwenden</button></div>
      </section>

      <section className={`reference-mosque-live-status is-${status}`} aria-live="polite">
        <span className="reference-mosque-live-status__dot" />
        <span><strong>{statusLabel}</strong><small>{resultCount} Ergebnisse · Aktualisiert {formatUpdatedAt(snapshot?.fetchedAt)}</small></span>
        {snapshot?.source === 'live' ? <CircleCheck size={18} /> : status === 'loading' ? <LoaderCircle size={18} className="is-spinning" /> : null}
      </section>

      <section className="reference-prototype-note reference-mosque-source-note"><ShieldCheck size={16} /><span><strong>Daten: OpenStreetMap-Mitwirkende</strong><small>Bei freiwilliger Standortfreigabe werden deine Koordinaten ausschließlich für die Radiusabfrage an einen öffentlichen Overpass-Dienst gesendet. Namen, Adressen und Zusatzangaben können in OpenStreetMap fehlen oder veraltet sein.</small></span></section>

      <label className="reference-input-search"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Name, Adresse oder Konfession suchen …" /><Filter size={17} /></label>

      <div className="reference-nearby-label"><span><Navigation size={15} /> Nach Entfernung sortiert · 10 km</span><button onClick={() => openExternal(getOriginMapUrl(origin))}><Map size={16} /> Karte</button></div>

      {status === 'loading' && !snapshot ? (
        <div className="reference-mosque-loading"><LoaderCircle size={28} className="is-spinning" /><strong>Moscheen werden gesucht</strong><small>Gebäude, Gebetsräume und Musallas werden aus OpenStreetMap geladen.</small></div>
      ) : status === 'error' && !snapshot ? (
        <div className="reference-mosque-error"><WifiOff size={30} /><strong>Moschee-Suche nicht erreichbar</strong><small>{error}</small><div><button onClick={() => void loadMosques(origin, true)}><RefreshCw size={16} /> Erneut versuchen</button><button onClick={() => void loadMosques(DEFAULT_MOSQUE_ORIGIN, true)}>Berlin verwenden</button></div></div>
      ) : visible.length ? (
        <section className="reference-mosque-list reference-mosque-list--live">
          {visible.map((mosque, index) => (
            <motion.button key={mosque.id} initial={{ opacity: 0, y: reduceMotion ? 0 : 6 }} animate={{ opacity: 1, y: 0 }} transition={itemTransition(index)} onClick={() => setSelected(mosque)}>
              <span className="reference-mosque-list__pin"><MapPin size={20} /></span>
              <span><strong>{mosque.name}</strong><small>{mosque.address}</small><em>{formatDenomination(mosque.denomination)} · {mosque.serviceTimes ? `Gebetszeiten: ${mosque.serviceTimes}` : 'Gebetszeiten nicht hinterlegt'}</em></span>
              <span className="reference-mosque-distance">{formatDistance(mosque.distanceKm)}</span>
              <ChevronRight size={18} />
            </motion.button>
          ))}
        </section>
      ) : (
        <div className="reference-empty-result"><Search size={24} /><strong>Keine Moschee gefunden</strong><small>{query ? 'Ändere den Suchbegriff.' : 'In diesem Radius ist kein passender OpenStreetMap-Eintrag vorhanden.'}</small></div>
      )}

      <AnimatePresence>
        {selected ? (
          <motion.div className="reference-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closeDialog(); }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={microTransition}>
            <motion.section {...mosqueDialog.props} className="reference-mosque-detail-modal" initial={{ opacity: 0, y: reduceMotion ? 0 : 16, scale: reduceMotion ? 1 : .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: reduceMotion ? 0 : 8, scale: reduceMotion ? 1 : .99 }} transition={screenTransition}>
              <header>
                <span className="reference-mosque-detail-modal__pin"><MapPin size={22} /></span>
                <div><span className="overline">{formatDistance(selected.distanceKm)} entfernt</span><h2>{selected.name}</h2><p>{selected.address}</p></div>
                <button className="reference-mosque-detail-modal__close" onClick={closeDialog} aria-label="Schließen"><X size={20} /></button>
              </header>

              <div className="reference-mosque-detail-facts">
                <span><Globe2 size={17} /><strong>{formatDenomination(selected.denomination)}</strong></span>
                <span><Accessibility size={17} /><strong>{formatWheelchair(selected.wheelchair)}</strong></span>
                {selected.openingHours ? <span><Clock3 size={17} /><strong>{selected.openingHours}</strong></span> : null}
                {selected.serviceTimes ? <span><Clock3 size={17} /><strong>Gebetszeiten: {selected.serviceTimes}</strong></span> : <span><Clock3 size={17} /><strong>Gebetszeiten nicht hinterlegt</strong></span>}
              </div>

              <div className="reference-mosque-detail-actions">
                <button onClick={() => openExternal(getOpenStreetMapDirectionsUrl(origin, selected))}><Route size={18} /> Route öffnen</button>
                <button onClick={() => openExternal(getOpenStreetMapUrl(selected))}><Map size={18} /> In OSM öffnen</button>
                {selected.phone ? <a href={`tel:${selected.phone}`}><Phone size={18} /> Anrufen</a> : null}
                {selected.website ? <button onClick={() => openExternal(selected.website as string)}><ExternalLink size={18} /> Website</button> : null}
              </div>
            </motion.section>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>{toast ? <motion.div className="toast" initial={{ opacity: 0, y: reduceMotion ? 0 : 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reduceMotion ? 0 : 6 }} transition={microTransition}>{toast}</motion.div> : null}</AnimatePresence>
    </motion.main>
  );
}
