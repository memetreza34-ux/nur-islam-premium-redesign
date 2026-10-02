import { useRef } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight, Droplets } from 'lucide-react';
import type { WorshipStep } from '../data/worshipGuideData';
import { WUDU_PRESENTATION } from '../data/wuduPresentation';
import { PremiumImage } from './PremiumVisuals';

type Props = {
  steps: WorshipStep[];
  stepIndex: number;
  onSelect: (index: number) => void;
  onComplete: () => void;
};

export default function WuduLesson({ steps, stepIndex, onSelect, onComplete }: Props) {
  const heading = useRef<HTMLHeadingElement>(null);
  const overview = useRef<HTMLDetailsElement>(null);
  const step = steps[stepIndex];
  const presentation = WUDU_PRESENTATION[stepIndex];
  const select = (index: number) => {
    if (overview.current) overview.current.open = false;
    onSelect(index);
    heading.current?.focus({ preventScroll: true });
    heading.current?.scrollIntoView({ block: 'start', behavior: 'instant' });
  };

  return (
    <section className="wudu-lesson" aria-label="Wudu Schritt für Schritt">
      <details className="wudu-lesson__overview" ref={overview}>
        <summary><span>Schritt auswählen</span><small>{steps.length} Schritte</small><ChevronDown size={18} aria-hidden="true" /></summary>
        <ol>
          {steps.map((item, index) => <li key={item.title}><button aria-label={`Schritt ${index + 1}: ${item.title}`} aria-current={index === stepIndex ? 'step' : undefined} onClick={() => select(index)}><span className="wudu-lesson__step-number">{index + 1}</span><span>{item.title}{index === stepIndex ? <small>Aktueller Schritt</small> : null}</span><ChevronRight size={16} aria-hidden="true" /></button></li>)}
        </ol>
      </details>
      <article className="wudu-lesson__card" aria-labelledby="wudu-step-title">
        <header>
          <p className="wudu-lesson__eyebrow">Schritt {stepIndex + 1} von {steps.length}</p>
          <h2 id="wudu-step-title" ref={heading} tabIndex={-1}>{step.title}</h2>
          <p className="wudu-lesson__cue">{presentation.cue}</p>
        </header>
        {presentation.image ? (
          <figure className="wudu-lesson__figure">
            <PremiumImage key={presentation.image} src={`/premium-assets/high-res-objects/${presentation.image}`} className="wudu-lesson__art" alt={presentation.imageDescription} fallback={<Droplets size={48} />} priority />
            <figcaption>Vereinfachte 3D-Bildhilfe</figcaption>
          </figure>
        ) : null}
        <div className="wudu-lesson__instruction">
          <h3>{stepIndex === 9 ? 'Sinngemäße Bedeutung' : 'So geht’s'}</h3>
          <p>{step.description}</p>
        </div>
        {step.arabic ? (
          <section className="wudu-lesson__wording" aria-label={presentation.arabicRole === 'term' ? 'Arabische Bezeichnung und Aussprache' : 'Arabischer Wortlaut und Aussprache'}>
            <h3>{presentation.arabicRole === 'term' ? 'Arabische Bezeichnung' : 'Arabischer Wortlaut'}</h3>
            {presentation.arabicRole === 'term' ? <p className="wudu-lesson__note">Das ist der Name der Handlung – keine Aufforderung, ihn beim Waschen aufzusagen.</p> : null}
            <p className="wudu-lesson__arabic" dir="rtl" lang="ar">{step.arabic}</p>
            <div className="wudu-lesson__pronunciation">
              <h3>Aussprachehilfe</h3>
              <p className="wudu-lesson__note">Mit deutschen Lesegewohnheiten · ungefähr</p>
              {presentation.pronunciation?.map(line => <p className="wudu-lesson__phonetic" key={line}>{line}</p>)}
            </div>
            {presentation.meaning ? <p><strong>Bedeutung:</strong> {presentation.meaning}</p> : null}
            <details className="wudu-lesson__help">
              <summary>Wie lese ich die Aussprachehilfe?</summary>
              <p>„aa“, „ii“ und „uu“ sind lange Vokale. „sch“ klingt wie in „Schule“, „dsch“ wie in „Dschungel“, „j“ wie in „ja“. „th“ steht für das englische „th“ in „think“; „gh“ für einen stimmhaften arabischen Rachenlaut. „q“ wird weiter hinten als ein deutsches „k“ gebildet. Der Apostroph markiert einen arabischen Kehllaut.</p>
              <p>Die Umschrift ist nur eine Annäherung. Lass dir die genaue Aussprache von einer kundigen Lehrperson vorsprechen.</p>
              {step.transliteration ? <p><strong>Weitere Umschrift:</strong> {step.transliteration}</p> : null}
            </details>
          </section>
        ) : null}
        {stepIndex === 9 ? (
          <section aria-label="Quellen zum Abschlusswortlaut">
            <h3>Was ist belegt?</h3>
            <p className="wudu-lesson__note">Das Glaubensbekenntnis bis „Sein Diener und Gesandter“ steht in <a href="https://sunnah.com/muslim:234b" target="_blank" rel="noreferrer">Sahih Muslim 234b</a>. Es wird nach dem Wudu empfohlen; es ist keine Pflicht.</p>
            <p className="wudu-lesson__note">Die anschließende Bitte „O Allah, mache mich zu den Reumütigen …“ steht in <a href="https://sunnah.com/tirmidhi:55" target="_blank" rel="noreferrer">Jamiʿ at-Tirmidhi 55</a>. Ihre Überlieferung wird unterschiedlich bewertet: Ibn Hajar stufte den Zusatz als schwach ein, al-Albani als authentisch. <a href="https://islamqa.info/en/answers/45730" target="_blank" rel="noreferrer">Einordnung der unterschiedlichen Bewertungen</a>. Der Zusatz ist nicht Teil des Wortlauts in Sahih Muslim 234b. Du kannst beim dort belegten Glaubensbekenntnis bleiben.</p>
          </section>
        ) : null}
        <div className="wudu-lesson__actions">
          <button disabled={stepIndex === 0} onClick={() => select(stepIndex - 1)}><ChevronLeft size={18} /> Vorheriger Schritt</button>
          <button className="gold-button" onClick={() => stepIndex === steps.length - 1 ? onComplete() : select(stepIndex + 1)}>{stepIndex === steps.length - 1 ? 'Abschließen' : 'Nächster Schritt'} <ChevronRight size={18} /></button>
        </div>
      </article>
      <details className="wudu-lesson__help">
        <summary>Quellen und Grenzen der Bildhilfe</summary>
        <p>Beschreibungen zum Waschen finden sich beispielsweise in <a href="https://sunnah.com/bukhari:159" target="_blank" rel="noreferrer">Sahih al-Bukhari 159</a>, zum Reinigen der Ohren in <a href="https://sunnah.com/abudawud:135" target="_blank" rel="noreferrer">Sunan Abi Dawud 135</a>.</p>
        <p>Die Bilder wurden mit KI erstellt und sind vereinfachte Lernhilfen, keine vollständige Bewegungsanleitung. Reihenfolge, Wiederholungen und Körperbereiche bitte im Text lesen.</p>
      </details>
    </section>
  );
}
