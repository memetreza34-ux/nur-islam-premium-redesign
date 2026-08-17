import { useCallback, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  BookOpen,
  Search,
  Send,
  ShieldCheck,
  X,
} from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { answerFromApp } from '../services/assistantIndex';
import type { AssistantHit } from '../services/assistantIndex';
import { useDialog } from '../shared/useDialog';
import { NurMark, PremiumImage } from '../shared/PremiumVisuals';

const suggestions = [
  'Welche Bedeutung hat Laylat al-Qadr?',
  'Wie kann ich meine Beziehung zu Allah stärken?',
  'Erkläre die Bedeutung von Surah Al-Ikhlas.',
];

type ChatMessage = {
  id: number;
  role: 'user' | 'assistant';
  text: string;
  source?: string;
  hits?: AssistantHit[];
};

export function AssistantScreen({ onBack }: { onBack: () => void }) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [infoOpen, setInfoOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const closeDialog = useCallback(() => { setInfoOpen(false); }, []);
  const screenDialog = useDialog(infoOpen, closeDialog, 'Über den Nur Assistenten');
  const screenTransition = { duration: reduceMotion ? 0 : .28, ease: [0.22, 1, 0.36, 1] as const };
  const microTransition = { duration: reduceMotion ? 0 : .18, ease: [0.22, 1, 0.36, 1] as const };

  const messageIdRef = useRef(Date.now());

  const nextMessageId = () => {
    messageIdRef.current += 1;
    return messageIdRef.current;
  };

  const answerQuestion = (question: string) => {
    const reply = answerFromApp(question);
    const userId = nextMessageId();
    const assistantId = nextMessageId();
    const assistant: ChatMessage = {
      id: assistantId,
      role: 'assistant',
      text: reply.text,
      source: reply.note,
      hits: reply.kind === 'hits' ? reply.hits : undefined,
    };

    setMessages((current) => [
      ...current,
      { id: userId, role: 'user', text: question },
      assistant,
    ]);
  };

  const submit = (event?: FormEvent) => {
    event?.preventDefault();
    const question = input.trim();
    if (!question) return;
    answerQuestion(question);
    setInput('');
  };

  const useSuggestion = (question: string) => {
    answerQuestion(question);
    setInput('');
  };

  return (
    <motion.main className="screen reference-assistant-screen" initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }} animate={{ opacity: 1, y: 0 }} transition={screenTransition}>
      <header className="reference-screen-header">
        <button className="icon-button" onClick={onBack} aria-label="Zurück"><ChevronLeft size={20} /></button>
        <div><span className="overline">Lokaler Quellenmodus</span><h1>Nur Assistent</h1></div>
        <button className="icon-button" onClick={() => setInfoOpen(true)} aria-label="Informationen zum Quellenmodus"><ShieldCheck size={20} /></button>
      </header>

      <section className="reference-assistant-greeting">
        <PremiumImage src="/premium-assets/high-res-objects/nur-logo-emblem-v2.webp" fallback={<NurMark />} />
        <div><span className="overline">Assalamu Alaikum</span><h2>Wie kann ich dir helfen?</h2><p>Lokale, nachvollziehbare Antworten zu unterstützten Themen – ohne erfundene KI-Antworten.</p></div>
      </section>

      {messages.length ? (
        <section className="reference-chat-thread" aria-live="polite">
          {messages.map((message, index) => (
            <motion.div key={message.id} className={`reference-chat-message reference-chat-message--${message.role}`} initial={{ opacity: 0, y: reduceMotion ? 0 : 6 }} animate={{ opacity: 1, y: 0 }} transition={{ ...microTransition, delay: reduceMotion ? 0 : Math.min(index * .025, .08) }}>
              {message.role === 'assistant' ? <span className="reference-chat-message__mark"><BookOpen size={16} /></span> : null}
              <div>
                <p>{message.text}</p>
                {/* Each hit names an entry the user can open and check, rather
                    than an answer the assistant composed. */}
                {message.hits?.length ? (
                  <ul className="reference-chat-hits">
                    {message.hits.map((hit) => (
                      <li key={`${hit.area}-${hit.label}`}>
                        <strong>{hit.label}</strong>
                        <em>{hit.area}</em>
                        <span>{hit.detail}</span>
                        {hit.source ? <small>{hit.source}</small> : null}
                      </li>
                    ))}
                  </ul>
                ) : null}
                {message.source ? <small className="reference-chat-message__source"><ShieldCheck size={13} /> {message.source}</small> : null}
              </div>
            </motion.div>
          ))}
        </section>
      ) : (
        <section className="reference-assistant-suggestions">
          <div className="section-heading"><div><span className="overline">Direkt verfügbar</span><h2>Fragen mit Quellen</h2></div></div>
          <div>
            {suggestions.map((question) => <button key={question} onClick={() => useSuggestion(question)}><span><Search size={16} /></span><strong>{question}</strong><ChevronRight size={17} /></button>)}
          </div>
        </section>
      )}

      <section className="reference-assistant-safety">
        <ShieldCheck size={19} />
        <span><strong>Kein Fake-KI-Modus</strong><small>Wenn kein lokaler Quellen-Treffer vorhanden ist, sagt der Assistent das offen und erzeugt keine religiöse Antwort.</small></span>
      </section>

      <form className="reference-assistant-input" onSubmit={submit}>
        <input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Frage zu einem unterstützten Thema …" aria-label="Frage an den Nur Assistenten" />
        <button type="submit" aria-label="Senden" disabled={!input.trim()}><Send size={18} /></button>
      </form>

      <AnimatePresence>
        {infoOpen ? (
          <motion.div className="reference-modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={microTransition} onClick={() => setInfoOpen(false)}>
            <motion.section {...screenDialog.props} className="reference-profile-modal reference-assistant-info-modal" initial={{ opacity: 0, y: reduceMotion ? 0 : 16, scale: reduceMotion ? 1 : .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: reduceMotion ? 0 : 8, scale: reduceMotion ? 1 : .99 }} transition={screenTransition} onClick={(event) => event.stopPropagation()}>
              <button className="reference-modal-close" onClick={() => setInfoOpen(false)} aria-label="Schließen"><X size={18} /></button>
              <span className="reference-profile-modal__icon"><ShieldCheck size={28} /></span>
              <span className="overline">Quellenmodus</span>
              <h2>Was dieser Assistent wirklich kann</h2>
              <p>Er durchsucht keinen freien KI-Dienst und erzeugt keine neuen religiösen Urteile. Antworten kommen nur aus den lokal hinterlegten Themen und zeigen einen Quellen- oder Funktionshinweis.</p>
              <div className="reference-category-modal__meta reference-assistant-info-list">
                <span><CircleCheck size={15} /> Quran 97 und 112</span>
                <span><CircleCheck size={15} /> Gebetszeiten, Qibla und Wudu-Funktionen</span>
                <span><CircleCheck size={15} /> Dhikr- und Dua-Navigation</span>
                <span><ShieldCheck size={15} /> Unbekannte Fragen werden ausdrücklich nicht beantwortet</span>
              </div>
              <button className="gold-button" onClick={() => setInfoOpen(false)}>Verstanden</button>
            </motion.section>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.main>
  );
}
