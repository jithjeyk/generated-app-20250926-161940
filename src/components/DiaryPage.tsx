import { useEffect } from 'react';
import { EntryList } from './EntryList';
import { Editor } from './Editor';
import { Button } from './ui/button';
import { useAuthStore } from '@/stores/authStore';
import { useDiaryStore } from '@/stores/diaryStore';
import { LogOut } from 'lucide-react';
import { UnlockModal } from './UnlockModal';
import { useShallow } from 'zustand/react/shallow';
export function DiaryPage() {
  const { logout, username, isAuthenticated, encryptionKey } = useAuthStore(
    useShallow((state) => ({
      logout: state.logout,
      username: state.username,
      isAuthenticated: state.isAuthenticated,
      encryptionKey: state.encryptionKey,
    }))
  );
  const fetchEntries = useDiaryStore((state) => state.fetchEntries);
  useEffect(() => {
    // Fetch entries only if the key is present.
    // The auth store will trigger this after login or unlock.
    if (encryptionKey) {
      fetchEntries();
    }
  }, [encryptionKey, fetchEntries]);
  if (isAuthenticated && !encryptionKey) {
    return <UnlockModal />;
  }
  return (
    <div className="bg-diary-background min-h-screen text-diary-text">
      <header className="fixed top-0 left-0 right-0 bg-diary-background/80 backdrop-blur-sm border-b z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold text-diary-text">
              Cryptext Diary
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-slate-600 hidden sm:block">Welcome, {username}</span>
              <Button variant="ghost" size="icon" onClick={logout} className="hover:bg-slate-200 rounded-full transition-colors">
                <LogOut className="h-5 w-5 text-slate-600" />
              </Button>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        <div className="flex flex-col md:flex-row md:space-x-8">
          <div className="w-full md:w-1/3 lg:w-80 md:flex-shrink-0">
            <EntryList />
          </div>
          <div className="flex-1 mt-8 md:mt-0">
            <Editor />
          </div>
        </div>
      </main>
    </div>
  );
}