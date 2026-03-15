'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Editor } from '@/components/dynamic-editor';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import {
  IconNotebook,
  IconBuildingCommunity,
  IconBriefcase,
  IconArrowRight,
  IconSparkles,
  IconFileText,
  IconArrowLeft,
  IconDeviceFloppy,
  IconCheck,
  IconPlus,
  IconTrash,
} from '@tabler/icons-react';
import { getNotes, createNote, updateNote, deleteNote } from '@/api/notes';

function KeynotesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [notes, setNotes] = useState([]);
  const [loadingNotes, setLoadingNotes] = useState(true);
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [selectedNote, setSelectedNote] = useState(null);

  const [editorContent, setEditorContent] = useState(null);
  const [noteTitle, setNoteTitle] = useState('');
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  // Initial load
  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    setLoadingNotes(true);
    try {
      const data = await getNotes();
      setNotes(data.results || []);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Something went wrong.');
    } finally {
      setLoadingNotes(false);
    }
  };

  useEffect(() => {
    const id = searchParams.get('noteId');
    if (id) {
      setSelectedNoteId(id);
      if (id !== 'new') {
        const note = notes.find((n) => n.id.toString() === id);
        if (note) {
          setSelectedNote(note);
          setNoteTitle(note.title || 'Untitled Note');
          setEditorContent(note.content_json || []);
        } else if (!loadingNotes) {
          fetchSingleNote(id);
        }
      } else {
        setSelectedNote(null);
        setNoteTitle('');
        setEditorContent(undefined);
      }
    } else {
      setSelectedNoteId(null);
      setSelectedNote(null);
      setEditorContent(undefined);
      setNoteTitle('');
    }
  }, [searchParams, notes, loadingNotes]);

  const fetchSingleNote = async (id) => {
    try {
      const noteData = await getNotes();
      const note = Array.isArray(noteData) ? noteData.find((n) => n.id.toString() === id) : null;
      if (note) {
        setSelectedNote(note);
        setNoteTitle(note.title || 'Untitled Note');
        setEditorContent(note.content_json || []);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditorChange = useCallback((content) => {
    setEditorContent(content);
    setSaved(false);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        title: noteTitle || 'Untitled Note',
        content_json: editorContent,
      };

      if (selectedNote?.application_details?.id) {
        payload.application_id = selectedNote.application_details.id;
      }

      if (selectedNoteId === 'new') {
        const appId = searchParams.get('applicationId');
        if (appId) payload.application_id = appId;

        const res = await createNote(payload);
        toast.success('Note created successfully!');
        router.replace(`/dashboard/keynotes?noteId=${res.id}`);
        fetchNotes();
      } else {
        await updateNote(selectedNoteId, payload);
        toast.success('Note saved successfully!');
        setSaved(true);
        fetchNotes();
        setTimeout(() => setSaved(false), 2500);
      }
    } catch (error) {
      toast.error('Failed to save note');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, e) => {
    if (e) e.stopPropagation();
    if (!confirm('Are you sure you want to delete this note?')) return;

    try {
      await deleteNote(id);
      toast.success('Note deleted successfully!');
      fetchNotes();
      if (selectedNoteId === id.toString()) {
        handleBack();
      }
    } catch (error) {
      toast.success('Failed to delete note');
    }
  };

  const handleSelectNote = (id) => {
    router.push(`/dashboard/keynotes?noteId=${id}`);
  };

  const handleBack = () => {
    router.push('/dashboard/keynotes');
  };

  const handleCreateNew = () => {
    router.push('/dashboard/keynotes?noteId=new');
  };

  if (selectedNoteId) {
    return (
      <div className="animate-in fade-in mx-auto flex h-full w-full max-w-7xl flex-col space-y-6">
        {/* Editor Header */}
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex w-full items-center gap-3 sm:w-auto">
            <button
              onClick={handleBack}
              className="border-border hover:bg-muted shrink-0 rounded-lg border p-2 transition-colors"
              title="Go back"
            >
              <IconArrowLeft size={18} className="text-muted-foreground" />
            </button>
            <Input
              value={noteTitle}
              onChange={(e) => {
                setNoteTitle(e.target.value);
                setSaved(false);
              }}
              placeholder="Note Title..."
              className="focus-visible:border-border h-auto w-full border-transparent bg-transparent px-2 py-1 text-xl font-bold shadow-none focus-visible:ring-0 sm:w-[300px]"
            />
          </div>
          <div className="flex items-center gap-2">
            {selectedNoteId !== 'new' && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(selectedNoteId)}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <IconTrash size={18} />
              </Button>
            )}
            <Button
              onClick={handleSave}
              disabled={saving}
              className={`relative overflow-hidden transition-all duration-300 ${
                saved
                  ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              {saving ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Saving...
                </>
              ) : saved ? (
                <>
                  <IconCheck size={16} className="mr-1" />
                  Saved!
                </>
              ) : (
                <>
                  <IconDeviceFloppy size={16} className="mr-1" />
                  Save Notes
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Application Info Card (Optional) */}
        {(selectedNote?.application_details || searchParams.get('applicationId')) && (
          <Card className="border-border bg-muted/40 border shadow-sm">
            <CardContent className="flex flex-wrap items-center gap-4 p-3 text-sm">
              <Badge variant="outline" className="bg-background">
                Linked to Application
              </Badge>
              {selectedNote?.application_details && (
                <>
                  <div className="flex items-center gap-2">
                    <IconBuildingCommunity size={16} className="text-muted-foreground" />
                    <span>{selectedNote.application_details.company_name}</span>
                  </div>
                  {selectedNote.application_details.role_title && (
                    <>
                      <div className="bg-border hidden h-4 w-px sm:block" />
                      <div className="flex items-center gap-2">
                        <IconBriefcase size={16} className="text-muted-foreground" />
                        <span className="text-muted-foreground">
                          {selectedNote.application_details.role_title}
                        </span>
                      </div>
                    </>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        )}

        {/* Editor Section */}
        <Card className="border-border/60 flex min-h-[60vh] flex-1 flex-col overflow-hidden border shadow-sm">
          <div className="border-border/60 bg-muted/30 flex items-center justify-between border-b px-4 py-2">
            <div className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
              <IconSparkles size={16} className="text-indigo-500" />
              Notes Editor
            </div>
            <span className="text-muted-foreground/60 text-xs">Use '/' for commands</span>
          </div>
          <CardContent className="editor-container h-full min-h-[500px] flex-1 p-0">
            <Editor
              key={selectedNoteId}
              onChange={handleEditorChange}
              initialContent={selectedNoteId === 'new' ? undefined : selectedNote?.content_json}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in w-full space-y-6 duration-500">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
            <IconNotebook size={24} className="text-indigo-500" />
            Keynotes
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage your interview notes, technical concepts, and personal takeaways.
          </p>
        </div>
        <Button onClick={handleCreateNew} className="bg-indigo-600 text-white hover:bg-indigo-700">
          <IconPlus size={16} className="mr-1 hidden sm:block" />
          New Note
        </Button>
      </div>

      {/* Notes Grid */}
      {loadingNotes ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
        </div>
      ) : notes.length === 0 ? (
        <Card className="bg-muted/20 border-dashed shadow-none">
          <CardContent className="flex flex-col items-center justify-center py-20 text-center">
            <div className="bg-muted/50 border-border/50 mb-4 rounded-full border p-4">
              <IconFileText size={40} className="text-muted-foreground/50" />
            </div>
            <h3 className="text-foreground mb-1 text-lg font-semibold">No keynotes yet</h3>
            <p className="text-muted-foreground max-w-sm text-sm">
              Create your first note to start documenting your thoughts and interview experiences.
            </p>
            <Button
              onClick={handleCreateNew}
              variant="outline"
              className="mt-6 border-indigo-200 text-indigo-700 hover:bg-indigo-50 dark:border-indigo-800 dark:text-indigo-300 dark:hover:bg-indigo-950/50"
            >
              <IconPlus size={16} className="mr-1" />
              Create my first note
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {notes.map((note) => (
            <div
              key={note.id}
              onClick={() => handleSelectNote(note.id)}
              className="group block cursor-pointer"
            >
              <Card className="border-border bg-card relative flex h-full flex-col overflow-hidden border shadow-sm transition-all duration-300 hover:border-indigo-500/30 hover:shadow-md">
                <CardContent className="flex flex-1 flex-col gap-3 p-5">
                  <div className="flex items-start justify-between">
                    <h3 className="text-foreground line-clamp-2 text-lg leading-tight font-semibold">
                      {note.title || 'Untitled Note'}
                    </h3>
                    {note.application_details && (
                      <Badge
                        variant="secondary"
                        className="shrink-0 rounded-md border-indigo-200 bg-indigo-50 px-1.5 py-0 text-[10px] text-indigo-700 dark:border-indigo-800 dark:bg-indigo-950/50 dark:text-indigo-300"
                      >
                        App Linked
                      </Badge>
                    )}
                  </div>

                  {note.application_details ? (
                    <div className="text-muted-foreground bg-muted/40 border-border/40 mt-1 flex items-center gap-1.5 rounded-md border p-1.5 text-xs">
                      <IconBuildingCommunity size={13} className="text-indigo-500/70" />
                      <span className="truncate">{note.application_details.company_name}</span>
                    </div>
                  ) : (
                    <div className="text-muted-foreground bg-muted/40 border-border/40 mt-1 flex items-center gap-1.5 rounded-md border p-1.5 text-xs opacity-50">
                      <IconFileText size={13} />
                      <span className="truncate">General Note</span>
                    </div>
                  )}

                  <div className="text-muted-foreground border-border/40 mt-auto flex items-center justify-between border-t pt-4 text-xs">
                    <span>
                      {new Date(note.modified).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                      onClick={(e) => handleDelete(note.id, e)}
                    >
                      <IconTrash size={14} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function KeynotesPage() {
  return (
    <Suspense fallback={<div className="text-muted-foreground p-8 text-center">Loading...</div>}>
      <KeynotesContent />
    </Suspense>
  );
}
