import { useState, useMemo } from 'react';
import { useDiaryStore } from '@/stores/diaryStore';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { PlusCircle, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ScrollArea } from './ui/scroll-area';
import { Skeleton } from './ui/skeleton';
import { useShallow } from 'zustand/react/shallow';
import { motion, AnimatePresence } from 'framer-motion';
export function EntryList() {
  const [searchQuery, setSearchQuery] = useState('');
  const { entries, selectedEntryId, isLoading, selectEntry } = useDiaryStore(
    useShallow((state) => ({
      entries: state.entries,
      selectedEntryId: state.selectedEntryId,
      isLoading: state.isLoading,
      selectEntry: state.selectEntry,
    }))
  );
  const handleNewEntry = () => {
    selectEntry(null); // Deselect current to signal a new entry
  };
  const filteredEntries = useMemo(() => {
    return entries.filter((entry) =>
      entry.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [entries, searchQuery]);
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring' as const,
        stiffness: 100,
      },
    },
  };
  return (
    <aside className="h-full">
      <div className="flex flex-col space-y-4">
        <Button
          onClick={handleNewEntry}
          className="w-full bg-diary-accent hover:bg-sky-600 text-white text-md font-semibold py-5 transition-all duration-200 ease-in-out hover:shadow-md active:scale-95"
        >
          <PlusCircle className="mr-2 h-5 w-5" />
          New Entry
        </Button>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <Input
            type="text"
            placeholder="Search entries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <ScrollArea className="h-[calc(100vh-18rem)] pr-4">
          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="p-4 bg-white rounded-lg">
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-2"
            >
              <AnimatePresence>
                {filteredEntries.length > 0 ? (
                  filteredEntries.map((entry) => (
                    <motion.button
                      key={entry.id}
                      variants={itemVariants}
                      layout
                      onClick={() => selectEntry(entry.id)}
                      className={cn(
                        'w-full text-left p-4 rounded-lg transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-diary-accent',
                        selectedEntryId === entry.id
                          ? 'bg-sky-100 text-diary-accent shadow-inner'
                          : 'bg-white hover:bg-slate-100'
                      )}
                    >
                      <h3 className="font-semibold truncate">{entry.title}</h3>
                      <p className="text-sm text-slate-500">
                        {format(new Date(entry.updatedAt), 'MMMM d, yyyy')}
                      </p>
                    </motion.button>
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center text-slate-500 py-10"
                  >
                    <p>
                      {searchQuery ? 'No entries match your search.' : 'No entries yet.'}
                    </p>
                    <p>
                      {searchQuery ? 'Try a different search term.' : 'Click "New Entry" to start.'}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </ScrollArea>
      </div>
    </aside>
  );
}