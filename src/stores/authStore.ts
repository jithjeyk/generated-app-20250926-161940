import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useDiaryStore } from './diaryStore';
interface AuthState {
  isAuthenticated: boolean;
  username: string | null;
  encryptionKey: string | null;
  login: (username: string, masterKey: string) => void;
  logout: () => void;
  setEncryptionKey: (key: string) => void;
}
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      username: null,
      encryptionKey: null,
      login: (username, masterKey) => {
        set({
          isAuthenticated: true,
          username,
          encryptionKey: masterKey,
        });
        // After login, trigger fetching entries
        useDiaryStore.getState().fetchEntries();
      },
      logout: () => {
        // Before logging out, clear diary entries
        useDiaryStore.getState().clearEntries();
        set({
          isAuthenticated: false,
          username: null,
          encryptionKey: null,
        });
      },
      setEncryptionKey: (key) => {
        set({ encryptionKey: key });
        // After unlocking, trigger fetching entries
        useDiaryStore.getState().fetchEntries();
      },
    }),
    {
      name: 'cryptext-auth-storage', // name of the item in the storage (must be unique)
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        username: state.username,
      }), // only persist these properties
    }
  )
);