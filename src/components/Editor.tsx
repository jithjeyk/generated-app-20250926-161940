import React, { useState, useEffect, useRef } from 'react';
import { useDiaryStore } from '@/stores/diaryStore';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Save, Trash2, FilePlus2, Loader2 } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';
import { motion } from 'framer-motion';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
export function Editor() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isNew, setIsNew] = useState(true);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const { selectedEntryId, isSaving, getDecryptedEntry, addEntry, updateEntry, deleteEntry, selectEntry } = useDiaryStore(
    useShallow((state) => ({
      selectedEntryId: state.selectedEntryId,
      isSaving: state.isSaving,
      getDecryptedEntry: state.getDecryptedEntry,
      addEntry: state.addEntry,
      updateEntry: state.updateEntry,
      deleteEntry: state.deleteEntry,
      selectEntry: state.selectEntry,
    }))
  );
  useEffect(() => {
    if (selectedEntryId) {
      const entry = getDecryptedEntry(selectedEntryId);
      if (entry) {
        setTitle(entry.title);
        setContent(entry.content);
        setIsNew(false);
      }
    } else {
      setTitle('');
      setContent('');
      setIsNew(true);
      titleInputRef.current?.focus();
    }
  }, [selectedEntryId, getDecryptedEntry]);
  const handleSave = async () => {
    if (title.trim() === '' || isSaving) return;
    if (isNew || !selectedEntryId) {
      const newEntry = await addEntry(title, content);
      if (newEntry) {
        selectEntry(newEntry.id);
      }
    } else {
      await updateEntry(selectedEntryId, title, content);
    }
  };
  const handleDeleteConfirm = async () => {
    if (!isNew && selectedEntryId && !isSaving) {
      await deleteEntry(selectedEntryId);
    }
  };
  if (!selectedEntryId && !isNew) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center h-full bg-white rounded-lg p-8 text-center border-2 border-dashed"
      >
        <FilePlus2 className="h-16 w-16 text-slate-300 mb-4" />
        <h2 className="text-2xl font-semibold text-slate-600">Your Digital Sanctuary</h2>
        <p className="text-slate-500 mt-2 max-w-sm">
          Select an entry from the list to read and edit, or click 'New Entry' to capture today's thoughts.
        </p>
      </motion.div>
    );
  }
  return (
    <div className="flex flex-col h-full space-y-4">
      <Input
        ref={titleInputRef}
        placeholder="Entry Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="text-3xl font-bold border-0 border-b-2 rounded-none focus:ring-0 focus:border-diary-accent p-2 h-auto bg-transparent"
      />
      <Textarea
        placeholder="Start writing your thoughts here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="flex-grow text-lg border-0 focus:ring-0 resize-none p-2 min-h-[50vh] bg-transparent"
      />
      <div className="flex items-center justify-end space-x-4 pt-4 border-t">
        {!isNew && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                disabled={isSaving}
                className="transition-all duration-200 ease-in-out hover:shadow-md active:scale-95"
              >
                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your diary entry.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
        <Button
          onClick={handleSave}
          disabled={isSaving || !title.trim()}
          className="bg-diary-accent hover:bg-sky-600 text-white font-semibold transition-all duration-200 ease-in-out hover:shadow-lg active:scale-95"
        >
          {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          {isNew ? 'Save Entry' : 'Update Entry'}
        </Button>
      </div>
    </div>
  );
}