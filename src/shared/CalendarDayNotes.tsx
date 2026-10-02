import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { CircleCheck, NotebookPen, Pencil, Plus, Trash2, X } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useDialog } from './useDialog';
import {
  CALENDAR_DAY_NOTES_CHANGED_EVENT,
  getCalendarDayNotesSnapshot,
  readCalendarDayNotes,
  writeCalendarDayNotes,
} from '../services/calendarDayNotes';
import type { CalendarDayNote } from '../services/calendarDayNotes';
import { getDateKey } from '../services/calendarViewModel';

type CalendarDayNotesProps = {
  date: Date;
  compact?: boolean;
};

export function CalendarDayNotes({ date, compact = false }: CalendarDayNotesProps) {
  const dateKey = getDateKey(date);
  const dateLabel = useMemo(() => new Intl.DateTimeFormat('de-DE', {
    day: 'numeric', month: 'long', year: 'numeric',
  }).format(date), [dateKey]);
  const textareaId = useId();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [notes, setNotes] = useState(readCalendarDayNotes);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [openedNote, setOpenedNote] = useState<CalendarDayNote | null>(null);
  const [draft, setDraft] = useState('');
  const [error, setError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const selectedNotes = notes.filter((note) => note.date === dateKey);
  const visibleNotes = compact ? selectedNotes.slice(0, 1) : selectedNotes;
  const closeEditor = useCallback(() => {
    setEditorOpen(false);
    setConfirmDelete(false);
    setError('');
  }, []);
  const editorDialog = useDialog(editorOpen, closeEditor, editingId ? 'Notiz bearbeiten' : 'Notiz hinzufügen');

  useEffect(() => {
    if (editorOpen) textareaRef.current?.focus({ preventScroll: true });
  }, [editorOpen]);

  useEffect(() => {
    const refresh = () => setNotes(readCalendarDayNotes());
    window.addEventListener(CALENDAR_DAY_NOTES_CHANGED_EVENT, refresh);
    window.addEventListener('storage', refresh);
    window.addEventListener('nur:cloud-restored', refresh);
    return () => {
      window.removeEventListener(CALENDAR_DAY_NOTES_CHANGED_EVENT, refresh);
      window.removeEventListener('storage', refresh);
      window.removeEventListener('nur:cloud-restored', refresh);
    };
  }, []);

  const openEditor = (note?: CalendarDayNote) => {
    setEditingId(note?.id ?? null);
    setOpenedNote(note ?? null);
    setDraft(note?.text ?? '');
    setError('');
    setConfirmDelete(false);
    setEditorOpen(true);
  };

  const save = () => {
    const text = draft.trim();
    if (!text) {
      setError('Schreib etwas in deine Notiz.');
      return;
    }
    const snapshot = getCalendarDayNotesSnapshot();
    if (!snapshot) {
      setError('Gespeicherte Notizen enthalten ungültige Daten. Nichts wurde überschrieben.');
      return;
    }
    const current = snapshot.notes;
    if (editingId && !current.some((note) => note.id === editingId && note.date === openedNote?.date && note.text === openedNote?.text)) {
      setError('Diese Notiz wurde zwischenzeitlich geändert. Schließe sie und öffne sie erneut.');
      return;
    }
    const next = editingId
      ? current.map((note) => note.id === editingId ? { ...note, text } : note)
      : [...current, { id: crypto.randomUUID(), date: dateKey, text }];
    if (!writeCalendarDayNotes(next, snapshot.raw)) {
      setError('Speichern nicht möglich. Prüfe den Gerätespeicher oder öffne die Notiz erneut.');
      return;
    }
    setNotes(next);
    closeEditor();
  };

  const remove = () => {
    if (!editingId) return;
    const snapshot = getCalendarDayNotesSnapshot();
    if (!snapshot) {
      setError('Gespeicherte Notizen enthalten ungültige Daten. Nichts wurde gelöscht.');
      return;
    }
    if (!snapshot.notes.some((note) => note.id === editingId && note.date === openedNote?.date && note.text === openedNote?.text)) {
      setError('Diese Notiz wurde zwischenzeitlich geändert. Schließe sie und öffne sie erneut.');
      return;
    }
    const next = snapshot.notes.filter((note) => note.id !== editingId);
    if (!writeCalendarDayNotes(next, snapshot.raw)) {
      setError('Löschen nicht möglich. Prüfe den Gerätespeicher oder öffne die Notiz erneut.');
      return;
    }
    setNotes(next);
    closeEditor();
  };

  return (
    <section className={`calendar-day-notes${compact ? ' calendar-day-notes--compact' : ''}`} aria-label={`Notizen für ${dateLabel}`}>
      <div className="calendar-day-notes__heading">
        <span className="calendar-day-notes__title"><NotebookPen size={compact ? 16 : 19} aria-hidden="true" /><span>{compact ? 'Deine Notizen' : 'Notizen an diesem Tag'}</span>{selectedNotes.length > 0 ? <small>{selectedNotes.length}</small> : null}</span>
        <button type="button" onClick={() => openEditor()}><Plus size={16} aria-hidden="true" /> Notiz hinzufügen</button>
      </div>
      {visibleNotes.length ? (
        <div className="calendar-day-notes__list">
          {visibleNotes.map((note) => (
            <button className="calendar-day-notes__entry" type="button" key={note.id} onClick={() => openEditor(note)} aria-label={`Notiz bearbeiten: ${note.text.slice(0, 70)}`}>
              <span>{note.text}</span><Pencil size={15} aria-hidden="true" />
            </button>
          ))}
          {compact && selectedNotes.length > 1 ? <span className="calendar-day-notes__more">+ {selectedNotes.length - 1} weitere {selectedNotes.length === 2 ? 'Notiz' : 'Notizen'} im Kalender</span> : null}
        </div>
      ) : <p className="calendar-day-notes__empty">Gedanken oder Pläne für diesen Tag festhalten.</p>}

      {editorOpen ? createPortal(
        <div className="calendar-modal-backdrop calendar-note-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) closeEditor(); }}>
          <section {...editorDialog.props} className="calendar-note-dialog">
            <div className="calendar-note-dialog__heading"><span><small>{dateLabel}</small><h2>{editingId ? 'Notiz bearbeiten' : 'Notiz hinzufügen'}</h2></span><button type="button" className="calendar-note-dialog__close" onClick={closeEditor} aria-label="Schließen"><X size={20} /></button></div>
            <label htmlFor={textareaId}>Deine Notiz</label>
            <textarea id={textareaId} ref={textareaRef} value={draft} onChange={(event) => { setDraft(event.target.value); setError(''); }} maxLength={1000} placeholder="Was möchtest du dir für diesen Tag merken?" rows={6} />
            <div className="calendar-note-dialog__hint"><span>Nur auf diesem Gerät · ohne Erinnerung</span><span>{draft.length}/1000</span></div>
            {error ? <p className="calendar-note-dialog__error" role="alert">{error}</p> : null}
            <button className="calendar-note-dialog__save" type="button" onClick={save}><CircleCheck size={18} /> Notiz speichern</button>
            {editingId ? (
              <div className="calendar-note-dialog__delete">
                {confirmDelete ? <><span>Notiz wirklich löschen?</span><button type="button" onClick={remove}>Ja, löschen</button><button type="button" onClick={() => setConfirmDelete(false)}>Abbrechen</button></>
                  : <button type="button" onClick={() => setConfirmDelete(true)}><Trash2 size={16} /> Notiz löschen</button>}
              </div>
            ) : null}
          </section>
        </div>, document.body,
      ) : null}
    </section>
  );
}
