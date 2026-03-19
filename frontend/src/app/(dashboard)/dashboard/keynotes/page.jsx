'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Editor } from '@/components/dynamic-editor';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
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
  const [isDirty, setIsDirty] = useState(false);

  const [noteToDelete, setNoteToDelete] = useState(null);

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
          setSelectedNote((prev) => {
            if (prev?.id?.toString() !== id) {
              setNoteTitle(note.title || 'Untitled Note');
              setEditorContent(note.content_json || []);
              setIsDirty(false);
            }
            return note;
          });
        } else if (!loadingNotes) {
          fetchSingleNote(id);
        }
      } else {
        setSelectedNote((prev) => {
          if (prev !== null) {
            setNoteTitle('');
            setEditorContent(undefined);
            setIsDirty(false);
          }
          return null;
        });
      }
    } else {
      setSelectedNoteId(null);
      setSelectedNote(null);
      setEditorContent(undefined);
      setNoteTitle('');
      setIsDirty(false);
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
        setIsDirty(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditorChange = useCallback((content) => {
    setEditorContent(content);
    setSaved(false);
    setIsDirty(true);
  }, []);

  const handleSave = async (isAutoSave = false) => {
    // Prevent empty note creation on auto-save
    if (isAutoSave && selectedNoteId === 'new' && (!noteTitle.trim() && !editorContent)) return;

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
        if (!isAutoSave) toast.success('Note created successfully!');
        setIsDirty(false);
        setSaved(true);
        router.replace(`/dashboard/keynotes?noteId=${res.id}`);
        fetchNotes();
        setTimeout(() => setSaved(false), 2500);
      } else {
        await updateNote(selectedNoteId, payload);
        if (!isAutoSave) toast.success('Note saved successfully!');
        setIsDirty(false);
        setSaved(true);
        fetchNotes(); // You might want to omit fetchNotes on auto save if it causes UI jumps, but it's safe for now.
        setTimeout(() => setSaved(false), 2500);
      }
    } catch (error) {
      if (!isAutoSave) toast.error('Failed to save note');
    } finally {
      setSaving(false);
    }
  };

  // Auto-save logic
  useEffect(() => {
    if (!isDirty || !selectedNoteId) return;

    const timer = setTimeout(() => {
      handleSave(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, [noteTitle, editorContent, isDirty, selectedNoteId]);

  const handleDeleteClick = (id, e) => {
    if (e) e.stopPropagation();
    setNoteToDelete(id);
  };

  const confirmDelete = async () => {
    if (!noteToDelete) return;

    try {
      await deleteNote(noteToDelete);
      toast.success('Note deleted successfully!');
      fetchNotes();
      if (selectedNoteId === noteToDelete.toString()) {
        handleBack();
      }
    } catch (error) {
      toast.error('Failed to delete note');
    } finally {
      setNoteToDelete(null);
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
              className="border-border hover:bg-muted shrink-0 rounded-lg border p-2 transition-colors cursor-pointer"
              title="Go back"
            >
              <IconArrowLeft size={18} className="text-muted-foreground" />
            </button>
            <Input
              value={noteTitle}
              onChange={(e) => {
                setNoteTitle(e.target.value);
                setSaved(false);
                setIsDirty(true);
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
                onClick={() => handleDeleteClick(selectedNoteId)}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <IconTrash size={18} />
              </Button>
            )}
            <Button
              onClick={handleSave}
              disabled={saving}
              className={`relative overflow-hidden transition-all duration-300 ${saved
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
          <div className="border-border/60 flex items-center justify-between border-b px-4 py-2">
            <div className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
              <IconSparkles size={16} className="text-amber-600" />
              Notes Editor
            </div>
            <span className="text-muted-foreground/60 text-xs">Use '/' for commands</span>
          </div>
          <CardContent className="editor-container h-full min-h-[500px] flex-1 p-0">
            <Editor
              key={selectedNoteId}
              onChange={handleEditorChange}
              initialContent={
                selectedNoteId === 'new'
                  ? undefined
                  : (selectedNote?.content_json && Array.isArray(selectedNote.content_json) && selectedNote.content_json.length === 0)
                    ? undefined
                    : selectedNote?.content_json
              }
            />
          </CardContent>
        </Card>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!noteToDelete} onOpenChange={(open) => !open && setNoteToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your note.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
                className="bg-red-700 hover:bg-red-600 text-white"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
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
        <Button onClick={handleCreateNew}>
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
              <Card className="border-border bg-card relative flex h-full flex-col overflow-hidden border shadow-sm transition-all duration-300 hover:shadow-md">
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
                        Application Linked
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
                      onClick={(e) => handleDeleteClick(note.id, e)}
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!noteToDelete} onOpenChange={(open) => !open && setNoteToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your note.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-700 hover:bg-red-600 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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
