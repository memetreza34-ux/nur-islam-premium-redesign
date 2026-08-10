import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ChevronLeft,
  CircleCheck,
  Cloud,
  CloudUpload,
  LoaderCircle,
  NotebookPen,
  Plus,
  Save,
  Trash2,
  X,
} from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  createNote as createCloudNote,
  deleteNote as deleteCloudNote,
  getSession,
  listNotes as listCloudNotes,
  updateNote as updateCloudNote,
} from '../services/nurBackend';
import type { NurNote, NurSession } from '../services/nurBackend';

type LocalNote = {
  id: string;
  title: string;
  body: string;
  created_at: string;
  updated_at: string;
};

type NoteItem = LocalNote | NurNote;

const LOCAL_KEY = 'nur_local_notes_v1';

function hasValidDate(value: unknown): value is string {
  return typeof value === 'string' && Number.isFinite(Date.parse(value));
}

export function readLocalNotes() {
  try {
    const parsed = JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]') as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((value): value is LocalNote => {
      if (!value || typeof value !== 'object') return false;
      const note = value as Partial<LocalNote>;
      return typeof note.id === 'string'
        && typeof note.title === 'string'
        && typeof note.body === 'string'
        && hasValidDate(note.created_at)
        && hasValidDate(note.updated_at);
    });
  } catch {
    return [];
  }
}

export function writeLocalNotes(notes: LocalNote[]) {
  try { localStorage.setItem(LOCAL_KEY, JSON.stringify(notes)); } catch { /* optional */ }
}

export function noteSignature(title: string, body: string) {
  return `${title.trim().toLocaleLowerCase('de-DE')}\u0000${body.trim()}`;
}

export function NotesScreen({ onBack, onOpenAccount }: { onBack: () => void; onOpenAccount: () => void }) {
  const [session, setSession] = useState<NurSession | null>(null);
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [localNotesPending, setLocalNotesPending] = useState<LocalNote[]>(readLocalNotes);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [busy, setBusy] = useState(true);
  const [status, setStatus] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();
  const localNoteIdRef = useRef(Date.now() * 1000);
  const screenTransition = { duration: reduceMotion ? 0 : .28, ease: [0.22, 1, .36, 1] as const };
  const microTransition = { duration: reduceMotion ? 0 : .18, ease: [0.22, 1, .36, 1] as const };

  const selected = useMemo(() => notes.find((note) => note.id === selectedId) ?? null, [notes, selectedId]);

  useEffect(() => {
    let active = true;
    void getSession().then(async (current) => {
      if (!active) return;
      setSession(current);
      const local = readLocalNotes();
      setLocalNotesPending(local);
      if (current) {
        try {
          const cloud = await listCloudNotes();
          if (!active) return;
          setNotes(cloud);
        } catch (reason) {
          if (!active) return;
          setNotes([]);
          setStatus(reason instanceof Error ? `Cloud-Notizen konnten nicht geladen werden: ${reason.message}` : 'Cloud-Notizen konnten nicht geladen werden.');
        }
      } else {
        setNotes(local);
      }
      if (active) setBusy(false);
    });
    return () => { active = false; };
  }, []);

  const nextLocalNoteId = () => {
    localNoteIdRef.current = Math.max(localNoteIdRef.current + 1, Date.now() * 1000);
    return `local-${localNoteIdRef.current}`;
  };

  const resetEditor = (open: boolean) => {
    setSelectedId(null);
    setTitle('');
    setBody('');
    setStatus(null);
    setEditorOpen(open);
  };

  const beginNew = () => resetEditor(true);
  const closeEditor = () => resetEditor(false);

  const openNote = (note: NoteItem) => {
    setSelectedId(note.id);
    setTitle(note.title);
    setBody(note.body);
    setStatus(null);
    setEditorOpen(true);
  };

  const save = async () => {
    const cleanTitle = title.trim().slice(0, 160);
    const cleanBody = body.slice(0, 20000);
    if (!cleanTitle && !cleanBody.trim()) {
      setStatus('Eine leere Notiz wird nicht gespeichert.');
      return;
    }
    setBusy(true);
    try {
      if (session) {
        const saved = selectedId
          ? await updateCloudNote(selectedId, cleanTitle || 'Notiz', cleanBody)
          : await createCloudNote(cleanTitle || 'Notiz', cleanBody);
        const refreshed = await listCloudNotes();
        setNotes(refreshed);
        setSelectedId(saved?.id ?? null);
        setStatus('Cloud-Notiz gespeichert.');
      } else {
        const now = new Date().toISOString();
        const local = notes as LocalNote[];
        let next: LocalNote[];
        if (selectedId) {
          next = local.map((note) => note.id === selectedId ? { ...note, title: cleanTitle || 'Notiz', body: cleanBody, updated_at: now } : note);
        } else {
          const created: LocalNote = { id: nextLocalNoteId(), title: cleanTitle || 'Notiz', body: cleanBody, created_at: now, updated_at: now };
          next = [created, ...local];
          setSelectedId(created.id);
        }
        next.sort((a, b) => b.updated_at.localeCompare(a.updated_at));
        setNotes(next);
        setLocalNotesPending(next);
        writeLocalNotes(next);
        setStatus('Notiz lokal auf diesem Gerät gespeichert.');
      }
    } catch (reason) {
      setStatus(reason instanceof Error ? reason.message : 'Speichern fehlgeschlagen.');
    } finally {
      setBusy(false);
    }
  };

  const importLocalNotes = async () => {
    if (!session || localNotesPending.length === 0 || busy) return;
    setBusy(true);
    setStatus(null);
    try {
      const cloud = await listCloudNotes();
      const existing = new Set(cloud.map((note) => noteSignature(note.title, note.body)));
      let imported = 0;
      for (const note of localNotesPending) {
        const cleanTitle = note.title.trim().slice(0, 160) || 'Notiz';
        const cleanBody = note.body.slice(0, 20000);
        const signature = noteSignature(cleanTitle, cleanBody);
        if (existing.has(signature)) continue;
        await createCloudNote(cleanTitle, cleanBody);
        existing.add(signature);
        imported += 1;
      }
      const refreshed = await listCloudNotes();
      setNotes(refreshed);
      writeLocalNotes([]);
      setLocalNotesPending([]);
      setStatus(imported > 0 ? `${imported} lokale Notiz${imported === 1 ? '' : 'en'} in Nur Cloud übernommen.` : 'Lokale Notizen waren bereits in Nur Cloud vorhanden. Lokale Kopien wurden bereinigt.');
    } catch (reason) {
      setStatus(reason instanceof Error ? `Import nicht abgeschlossen: ${reason.message}. Lokale Notizen bleiben erhalten.` : 'Import nicht abgeschlossen. Lokale Notizen bleiben erhalten.');
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!selectedId) return;
    setBusy(true);
    try {
      if (session) {
        await deleteCloudNote(selectedId);
        setNotes(await listCloudNotes());
      } else {
        const next = (notes as LocalNote[]).filter((note) => note.id !== selectedId);
        setNotes(next);
        setLocalNotesPending(next);
        writeLocalNotes(next);
      }
      closeEditor();
      setStatus('Notiz gelöscht.');
    } catch (reason) {
      setStatus(reason instanceof Error ? reason.message : 'Löschen fehlgeschlagen.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <motion.main className="screen reference-notes-screen" initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }} animate={{ opacity: 1, y: 0 }} transition={screenTransition}>
      <header className="reference-screen-header">
        <button className="icon-button" onClick={onBack} aria-label="Zurück"><ChevronLeft size={20} /></button>
        <div><span className="overline">Deine Gedanken</span><h1>Notizen</h1></div>
        <button className="icon-button" onClick={beginNew} aria-label="Neue Notiz"><Plus size={20} /></button>
      </header>

      <section className="reference-notes-storage">
        {session ? <Cloud size={18} /> : <NotebookPen size={18} />}
        <span><strong>{session ? 'Cloud-Notizen aktiv' : 'Lokale Notizen'}</strong><small>{session ? localNotesPending.length ? `${localNotesPending.length} lokale Notiz${localNotesPending.length === 1 ? '' : 'en'} wartet noch auf Import.` : 'Diese Notizen liegen in deinem geschützten Konto.' : 'Ohne Konto bleiben Notizen nur auf diesem Gerät.'}</small></span>
        {!session
          ? <button onClick={onOpenAccount}>Cloud aktivieren</button>
          : localNotesPending.length
            ? <button onClick={() => void importLocalNotes()} disabled={busy}><CloudUpload size={14} /> Importieren</button>
            : <CircleCheck size={18} />}
      </section>

      {busy && notes.length === 0 ? <div className="reference-notes-loading"><LoaderCircle size={24} className="is-spinning" /> Notizen werden geladen …</div> : null}

      <section className="reference-notes-list">
        {notes.map((note) => (
          <button key={note.id} className={selectedId === note.id ? 'is-active' : ''} onClick={() => openNote(note)}>
            <span><strong>{note.title || 'Notiz'}</strong><small>{note.body.trim().slice(0, 76) || 'Kein Text'}</small></span>
            <em>{new Intl.DateTimeFormat('de-DE', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }).format(new Date(note.updated_at))}</em>
          </button>
        ))}
        {!busy && notes.length === 0 && !editorOpen ? (
          <div className="reference-empty-result">
            <NotebookPen size={25} />
            <strong>Noch keine Notizen</strong>
            <small>{status?.startsWith('Cloud-Notizen konnten') ? 'Prüfe deine Verbindung oder Sitzung und öffne den Bereich erneut.' : 'Halte Gedanken, Lernpunkte oder persönliche Erinnerungen fest. Religiöse Entscheidungen sollten nicht allein auf privaten Notizen beruhen.'}</small>
            {!status?.startsWith('Cloud-Notizen konnten') ? <button className="reference-inline-button" onClick={beginNew}><Plus size={16} /> Neue Notiz schreiben</button> : null}
          </div>
        ) : null}
      </section>

      {editorOpen ? (
        <section className="reference-note-editor">
          <div className="reference-note-editor__heading"><span><NotebookPen size={18} /><strong>{selected ? 'Notiz bearbeiten' : 'Neue Notiz'}</strong></span>{selected ? <button onClick={() => void remove()} disabled={busy} aria-label="Notiz löschen"><Trash2 size={17} /></button> : <button onClick={closeEditor} aria-label="Editor schließen"><X size={17} /></button>}</div>
          <input value={title} onChange={(event) => setTitle(event.target.value)} maxLength={160} placeholder="Titel" aria-label="Titel der Notiz" />
          <textarea value={body} onChange={(event) => setBody(event.target.value)} maxLength={20000} rows={8} placeholder="Deine Gedanken …" />
          <button className="gold-button" onClick={() => void save()} disabled={busy}>{busy ? <LoaderCircle size={17} className="is-spinning" /> : <Save size={17} />} Speichern</button>
        </section>
      ) : null}

      <AnimatePresence>{status ? <motion.div className="reference-account-status" initial={{ opacity: 0, y: reduceMotion ? 0 : 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={microTransition} role="status">{status}</motion.div> : null}</AnimatePresence>
    </motion.main>
  );
}
