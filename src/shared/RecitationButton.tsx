/**
 * Die Rezitation eines Schritts zum Anhören.
 *
 * Der Release spielt nur Audioquellen ab, deren Nutzung für diesen Produktstand
 * ausreichend dokumentiert ist. Quran-Rezitationen über Islamic Network bleiben
 * verfügbar. Die im Altbestand hinterlegten Hisn-al-Muslim-Dateien werden
 * dagegen bewusst nicht angefordert, solange ihre Einbettungs-/Weiterverwendungs-
 * rechte für diese App nicht belastbar geklärt sind.
 *
 * Die Filterung sitzt direkt an der Audio-Grenze: selbst wenn ein alter Schritt
 * noch eine Hisn-URL als dokumentierte Zuordnung trägt, erzeugt diese Komponente
 * dafür weder bei einem Tap noch im automatischen Gebetsdurchlauf einen Request.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AlertCircle, Pause, Play } from 'lucide-react';

type PlaybackState = 'idle' | 'playing' | 'error';

const ALLOWED_AUDIO_HOSTS = new Set([
  'cdn.islamic.network',
]);

/**
 * Release-Sicherheitsgrenze für externe Rezitationsquellen. Audio ist bewusst
 * allowlist-basiert: neue Hosts sind gesperrt, bis Rechte, Datenschutz und CSP
 * für sie ausdrücklich geprüft wurden.
 */
export function isRecitationUrlAllowed(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && ALLOWED_AUDIO_HOSTS.has(url.hostname.toLowerCase());
  } catch {
    return false;
  }
}

export function RecitationButton({
  urls,
  autoPlay = false,
  onFinished,
}: {
  urls: readonly string[];
  /** Im Durchlauf startet die Wiedergabe ohne Antippen. */
  autoPlay?: boolean;
  /** Meldet dem Durchlauf, dass dieser Schritt zu Ende gesprochen ist. */
  onFinished?: () => void;
}) {
  const [state, setState] = useState<PlaybackState>('idle');
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playableUrls = useMemo(() => urls.filter(isRecitationUrlAllowed), [urls]);
  // Als Ref, damit ein Wechsel des Rückrufs nicht die laufende Kette abbricht.
  const finishedRef = useRef(onFinished);
  finishedRef.current = onFinished;

  const stop = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.onended = null;
      audio.onerror = null;
      audioRef.current = null;
    }
    setState('idle');
  }, []);

  // Ein Schrittwechsel beendet die Wiedergabe. Sonst liefe die Rezitation des
  // vorigen Schritts unter dem neuen Text weiter.
  useEffect(() => stop, [playableUrls, stop]);

  const playFrom = useCallback((index: number) => {
    if (index >= playableUrls.length) {
      stop();
      finishedRef.current?.();
      return;
    }
    const audio = new Audio(playableUrls[index]);
    audioRef.current = audio;
    audio.onended = () => {
      if (audioRef.current === audio) playFrom(index + 1);
    };
    /**
     * Beides meldet dem Durchlauf das Ende — aber nur, wenn diese Wiedergabe
     * noch die aktuelle ist. `play()` bricht mit einem Fehler ab, wenn zwischen
     * Aufruf und Start pausiert oder der Schritt gewechselt wurde; würde das als
     * „fertig“ gelten, überspränge der Durchlauf beim Anhalten einen Schritt.
     */
    const failed = () => {
      if (audioRef.current !== audio) return;
      audioRef.current = null;
      setState('error');
      // Ein fehlender Ton darf den Durchlauf nicht anhalten.
      finishedRef.current?.();
    };
    audio.onerror = failed;
    audio.play().then(() => {
      if (audioRef.current === audio) setState('playing');
    }).catch(failed);
  }, [playableUrls, stop]);

  // Im Durchlauf beginnt der Schritt von selbst zu sprechen. Ein aus
  // Rechte-/Releasegründen gesperrter Audio-Schritt wird ohne Request direkt
  // weitergeschaltet, damit der automatische Gebetsablauf nicht hängen bleibt.
  useEffect(() => {
    if (!autoPlay) return;
    if (!playableUrls.length) {
      const timer = window.setTimeout(() => finishedRef.current?.(), 0);
      return () => window.clearTimeout(timer);
    }
    playFrom(0);
    return stop;
  }, [autoPlay, playFrom, playableUrls, stop]);

  // Keine sichtbare Aktion anbieten, wenn sämtliche hinterlegten Quellen für
  // den Release gesperrt sind.
  if (!playableUrls.length) return null;

  if (state === 'error') {
    return (
      <span className="reference-recitation-button is-error">
        <AlertCircle size={15} />
        Rezitation nicht abspielbar — sie wird online geladen.
      </span>
    );
  }

  return (
    <button
      type="button"
      className={`reference-recitation-button${state === 'playing' ? ' is-playing' : ''}`}
      onClick={() => (state === 'playing' ? stop() : playFrom(0))}
      aria-label={state === 'playing' ? 'Rezitation anhalten' : 'Rezitation anhören'}
    >
      {state === 'playing' ? <Pause size={15} /> : <Play size={15} />}
      {state === 'playing' ? 'Anhalten' : 'Anhören'}
    </button>
  );
}
