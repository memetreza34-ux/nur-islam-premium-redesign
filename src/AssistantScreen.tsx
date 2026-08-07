import { FormEvent, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  Mic,
  Send,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { NurMark, PremiumImage } from './PremiumVisuals';

const suggestions = [
  'Welche Bedeutung hat Laylat al-Qadr?',
  'Wie kann ich meine Beziehung zu Allah stärken?',
  'Erkläre die Bedeutung von Surah Al-Ikhlas.',
];

type ChatMessage = { id: number; role: 'user' | 'assistant'; text: string };

export function AssistantScreen({ onBack }: { onBack: () => void }) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  const flash = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2100);
  };

  const submit = (event?: FormEvent) => {
    event?.preventDefault();
    const question = input.trim();
    if (!question) return;
    const id = Date.now();
    setMessages((current) => [
      ...current,
      { id, role: 'user', text: question },
      {
        id: id + 1,
        role: 'assistant',
        text: 'Die Oberfläche ist vorbereitet. Für eine verlässliche Antwort muss zuerst eine echte KI mit geprüften Quran- und Sunnah-Quellen verbunden werden.',
      },
    ]);
    setInput('');
  };

  const useSuggestion = (question: string) => {
    setInput(question);
    window.setTimeout(() => {
      const id = Date.now();
      setMessages((current) => [
        ...current,
        { id, role: 'user', text: question },
        {
          id: id + 1,
          role: 'assistant',
          text: 'Diese Frage wird später ausschließlich mit nachvollziehbaren Quellen beantwortet. Aktuell ist noch kein KI-Anbieter verbunden.',
        },
      ]);
      setInput('');
    }, 80);
  };

  return (
    <motion.main className="screen reference-assistant-screen" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <header className="reference-screen-header">
        <button className="icon-button" onClick={onBack} aria-label="Zurück"><ChevronLeft size={20} /></button>
        <div><span className="overline">Nur Islam</span><h1>KI-Assistent</h1></div>
        <button className="icon-button" onClick={() => flash('Quellenmodus: Quran und authentische Sunnah')} aria-label="Informationen zum Quellenmodus"><ShieldCheck size={20} /></button>
      </header>

      <section className="reference-assistant-greeting">
        <PremiumImage src="/premium-assets/high-res-objects/nur-logo-emblem-v2.webp" fallback={<NurMark />} />
        <div><span className="overline">Assalamu Alaikum</span><h2>Wie kann ich dir helfen?</h2><p>Fragen zu Glauben, Gebet, Quran und islamischem Alltag.</p></div>
      </section>

      {messages.length ? (
        <section className="reference-chat-thread">
          {messages.map((message) => (
            <motion.div key={message.id} className={`reference-chat-message reference-chat-message--${message.role}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              {message.role === 'assistant' ? <span className="reference-chat-message__mark"><Sparkles size={16} /></span> : null}
              <p>{message.text}</p>
            </motion.div>
          ))}
        </section>
      ) : (
        <section className="reference-assistant-suggestions">
          <div className="section-heading"><div><span className="overline">Vorgeschlagen</span><h2>Fragen für dich</h2></div></div>
          <div>
            {suggestions.map((question) => <button key={question} onClick={() => useSuggestion(question)}><span><Sparkles size={16} /></span><strong>{question}</strong><ChevronRight size={17} /></button>)}
          </div>
        </section>
      )}

      <section className="reference-assistant-safety">
        <ShieldCheck size={19} />
        <span><strong>Quellenbasierter Modus</strong><small>Keine Antwort wird als religiöse Gewissheit dargestellt, solange keine geprüfte Quelle vorhanden ist.</small></span>
      </section>

      <form className="reference-assistant-input" onSubmit={submit}>
        <input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Frage etwas …" />
        <button type="button" onClick={() => flash('Spracheingabe benötigt Mikrofonzugriff')} aria-label="Spracheingabe"><Mic size={18} /></button>
        <button type="submit" aria-label="Senden"><Send size={18} /></button>
      </form>

      <AnimatePresence>{toast ? <motion.div className="toast" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}><CircleCheck size={18} /> {toast}</motion.div> : null}</AnimatePresence>
    </motion.main>
  );
}
