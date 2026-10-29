import { SourceInfo } from './SourceInfo';
import { useRef } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight, Droplets } from 'lucide-react';
import type { WorshipStep } from '../data/worshipGuideData';
import { WUDU_PRESENTATION } from '../data/wuduPresentation';
import { PremiumImage } from './PremiumVisuals';
import { useStepNavigation } from './useStepNavigation';

type Props = {
  steps: WorshipStep[];
  stepIndex: number;
  onSelect: (index: number) => void;
};

export default function WuduLesson({ steps, stepIndex, onSelect }: Props) {
  const { stepRef, revealStep } = useStepNavigation<HTMLElement>();
  const overview = useRef<HTMLDetailsElement>(null);
  const step = steps[stepIndex];
  const presentation = WUDU_PRESENTATION[stepIndex];
  const instruction = <div className="wudu-lesson__instruction">
    <div className="wudu-lesson__instruction-heading">
      <h3>{stepIndex === 9 ? 'Sinngemäße Bedeutung' : 'So geht’s'}</h3>
      {step.sourceUrl ? <SourceInfo key={step.title} title={`Quelle zu „${step.title}“`}><p className="wudu-lesson__note"><a href={step.sourceUrl} target="_blank" rel="noreferrer">{step.source}</a></p>{stepIndex === 9 ? <p>{step.description}</p> : null}</SourceInfo> : null}
    </div>
    <p>{stepIndex === 9 ? step.description.split(' Diese Lernfassung')[0].replace('Sinngemäße Bedeutung: ', '') : step.description.replace(' Die arabischen Bezeichnungen der folgenden Handlungen sind keine zu sprechenden Gebetsformeln.', '')}</p>
  </div>;
  const select = (index: number) => {
    if (overview.current) overview.current.open = false;
    onSelect(index);
    revealStep();
  };

  return (
    <section className="wudu-lesson" aria-label="Wudu Schritt für Schritt">
      <details className="wudu-lesson__overview" ref={overview}>
        <summary><span>Schritt auswählen</span><small>{steps.length} Schritte</small><ChevronDown size={18} aria-hidden="true" /></summary>
        <ol>
          {steps.map((item, index) => <li key={item.title}><button aria-label={`Schritt ${index + 1}: ${item.title}`} aria-current={index === stepIndex ? 'step' : undefined} onClick={() => select(index)}><span className="wudu-lesson__step-number">{index + 1}</span><span>{item.title}{index === stepIndex ? <small>Aktueller Schritt</small> : null}</span><ChevronRight size={16} aria-hidden="true" /></button></li>)}
        </ol>
      </details>
      <article ref={stepRef} className="wudu-lesson__card" aria-labelledby="wudu-step-title">
        <header>
          <div>
            <p className="wudu-lesson__eyebrow">Schritt {stepIndex + 1} von {steps.length}</p>
            <h2 id="wudu-step-title" tabIndex={-1}>{step.title}</h2>
            <p className="wudu-lesson__cue">{presentation.cue}</p>
          </div>
          {presentation.image ? (
            <figure className="wudu-lesson__figure">
              <PremiumImage key={presentation.image} src={`/premium-assets/high-res-objects/${presentation.image}`} className="wudu-lesson__art" alt={presentation.imageDescription} fallback={<Droplets size={48} />} priority />
            </figure>
          ) : null}
        </header>
        {stepIndex !== 9 ? instruction : null}
        {step.arabic && presentation.arabicRole === 'spoken' ? (
          <section className="wudu-lesson__wording" aria-label="Arabischer Wortlaut und Aussprache">
            <h3>Zum Sprechen</h3>
            <p className="wudu-lesson__arabic" dir="rtl" lang="ar">{step.arabic}</p>
            <div className="wudu-lesson__pronunciation">
              <h3>Aussprachehilfe</h3>
              {presentation.pronunciation?.map(line => <p className="wudu-lesson__phonetic" key={line}>{line}</p>)}
            </div>
            {presentation.meaning ? <p><strong>Bedeutung:</strong> {presentation.meaning}</p> : null}
            <details className="wudu-lesson__help">
              <summary>Hinweise zur Aussprache</summary>
              <p>„aa“, „ii“ und „uu“ sind lange Vokale. „sch“ klingt wie in „Schule“, „dsch“ wie in „Dschungel“, „j“ wie in „ja“. „th“ steht für das englische „th“ in „think“; „gh“ für einen stimmhaften arabischen Rachenlaut. „q“ wird weiter hinten als ein deutsches „k“ gebildet. Der Apostroph markiert einen arabischen Kehllaut.</p>
              <p>Die Umschrift ist nur eine Annäherung. Lass dir die genaue Aussprache von einer kundigen Lehrperson vorsprechen.</p>
              {step.transliteration ? <p><strong>Weitere Umschrift:</strong> {step.transliteration}</p> : null}
            </details>
          </section>
        ) : null}
        {stepIndex === 9 ? instruction : null}
        {stepIndex === 9 ? (
          <div className="wudu-lesson__reference"><span>Überlieferung & Einordnung</span><SourceInfo title="Quellen zum Abschlusswortlaut"><section aria-label="Quellen zum Abschlusswortlaut">
            <h3>Was ist belegt?</h3>
            <p className="wudu-lesson__note">Das Glaubensbekenntnis bis „Sein Diener und Gesandter“ steht in <a href="https://sunnah.com/muslim:234b" target="_blank" rel="noreferrer">Sahih Muslim 234b</a>. Es wird nach dem Wudu empfohlen; es ist keine Pflicht.</p>
            <p className="wudu-lesson__note">Diese Lernfassung endet beim Wortlaut aus Muslim 234b. Der Zusatz aus Tirmidhi 55 wird unterschiedlich bewertet und ist hier ausgelassen.</p>
          </section></SourceInfo></div>
        ) : null}
        <div className="wudu-lesson__actions">
          <button disabled={stepIndex === 0} onClick={() => select(stepIndex - 1)}><ChevronLeft size={18} /> Vorheriger Schritt</button>
          <button className="gold-button" onClick={() => stepIndex === steps.length - 1 ? select(0) : select(stepIndex + 1)}>{stepIndex === steps.length - 1 ? 'Von vorn' : 'Nächster Schritt'} <ChevronRight size={18} /></button>
        </div>
      </article>
      <div className="wudu-lesson__reference"><span>Hinweise zu den Abbildungen</span><SourceInfo title="Quellen und Grenzen der Bildhilfe">
        <p>Beschreibungen zum Waschen finden sich beispielsweise in <a href="https://sunnah.com/bukhari:159" target="_blank" rel="noreferrer">Sahih al-Bukhari 159</a>, zum Reinigen der Ohren in <a href="https://sunnah.com/abudawud:135" target="_blank" rel="noreferrer">Sunan Abi Dawud 135</a>.</p>
        <p>Die Bilder wurden mit KI erstellt und sind vereinfachte Lernhilfen, keine vollständige Bewegungsanleitung. Reihenfolge, Wiederholungen und Körperbereiche bitte im Text lesen.</p>
      </SourceInfo></div>
    </section>
  );
}
