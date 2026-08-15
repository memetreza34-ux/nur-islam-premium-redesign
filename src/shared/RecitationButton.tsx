/**
 * Die Rezitation eines Schritts zum Anhören.
 *
 * Wer beten lernt, braucht nicht nur den Wortlaut, sondern den Klang — die
 * Umschrift allein trägt weder Länge noch Betonung. Der Knopf spielt die
 * Aufnahmen des Schritts der Reihe nach ab; beim Koran ist das Vers für Vers.
 *
 * Zwei Quellen, beide mit echten Sprechern: der Koran von Al Quran Cloud, die
 * überlieferten Formeln aus Hisn al-Muslim. Eine künstlich erzeugte Stimme
 * steht bewusst nirgends — wer nachspricht, prägt sich die Aussprache ein, die
 * er hört, und dafür ist eine synthetische Näherung die falsche Vorlage.
 * Welche Schritte trotzdem stumm bleiben, steht bei `audioUrl` in
 * `prayerRakatData`.
 *
 * Die Aufnahmen liegen nicht im App-Paket. Ohne Verbindung sagt der Knopf das,
 * statt still nichts zu tun.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { AlertCircle, Pause, Play } from 'lucide-react';

type PlaybackState = 'idle' | 'playing' | 'error';

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
  useEffect(() => stop, [urls, stop]);

  const playFrom = useCallback((index: number) => {
    if (index >= urls.length) {
      stop();
      finishedRef.current?.();
      return;
    }
    const audio = new Audio(urls[index]);
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
  }, [urls, stop]);

  // Im Durchlauf beginnt der Schritt von selbst zu sprechen.
  useEffect(() => {
    if (!autoPlay) return;
    playFrom(0);
    return stop;
  }, [autoPlay, playFrom, stop, urls]);

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
