import { create } from 'zustand';
import { DiaryEntry } from '@shared/types';
import { encrypt, decrypt } from '@/lib/crypto';
import { useAuthStore } from './authStore';
import { api } from '@/lib/api-client';
import { toast } from '@/components/ui/sonner';
interface DiaryState {
  entries: DiaryEntry[];
  selectedEntryId: string | null;
  isLoading: boolean;
  isSaving: boolean;
  fetchEntries: () => Promise<void>;
  selectEntry: (id: string | null) => void;
  addEntry: (title: string, content: string) => Promise<DiaryEntry | undefined>;
  updateEntry: (id: string, title: string, content: string) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
  getDecryptedEntry: (id: string) => { title: string; content: string } | null;
  clearEntries: () => void;
}
const getEncryptionKey = () => useAuthStore.getState().encryptionKey;
const getAuthHeaders = () => {
  const username = useAuthStore.getState().username;
  if (!username) return {};
  return { headers: { 'X-User-Id': username } };
};
export const useDiaryStore = create<DiaryState>((set, get) => ({
  entries: [],
  selectedEntryId: null,
  isLoading: false,
  isSaving: false,
  fetchEntries: async () => {
    const key = getEncryptionKey();
    if (!key) return;
    set({ isLoading: true });
    try {
      const entries = await api<DiaryEntry[]>('/api/entries', getAuthHeaders());
      set({ entries, selectedEntryId: entries[0]?.id || null });
    } catch (error) {
      console.error("Failed to fetch entries:", error);
      toast.error("Could not load your diary entries.");
    } finally {
      set({ isLoading: false });
    }
  },
  selectEntry: (id) => {
    set({ selectedEntryId: id });
  },
  addEntry: async (title, content) => {
    const key = getEncryptionKey();
    if (!key) return;
    set({ isSaving: true });
    try {
      const encryptedContent = encrypt(content, key);
      const newEntry = await api<DiaryEntry>('/api/entries', {
        method: 'POST',
        body: JSON.stringify({ title, encryptedContent }),
        ...getAuthHeaders(),
      });
      set((state) => ({
        entries: [newEntry, ...state.entries],
        selectedEntryId: newEntry.id,
      }));
      toast.success("Entry saved successfully!");
      return newEntry;
    } catch (error) {
      console.error("Failed to add entry:", error);
      toast.error("Failed to save your new entry.");
    } finally {
      set({ isSaving: false });
    }
  },
  updateEntry: async (id, title, content) => {
    const key = getEncryptionKey();
    if (!key) return;
    set({ isSaving: true });
    try {
      const encryptedContent = encrypt(content, key);
      const updatedEntry = await api<DiaryEntry>(`/api/entries/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ title, encryptedContent }),
        ...getAuthHeaders(),
      });
      set((state) => ({
        entries: state.entries.map((entry) =>
          entry.id === id ? updatedEntry : entry
        ),
      }));
      toast.success("Entry updated successfully!");
    } catch (error) {
      console.error("Failed to update entry:", error);
      toast.error("Failed to update your entry.");
    } finally {
      set({ isSaving: false });
    }
  },
  deleteEntry: async (id) => {
    set({ isSaving: true });
    try {
      await api(`/api/entries/${id}`, { method: 'DELETE', ...getAuthHeaders() });
      set((state) => {
        const remainingEntries = state.entries.filter((entry) => entry.id !== id);
        return {
          entries: remainingEntries,
          selectedEntryId: state.selectedEntryId === id ? (remainingEntries[0]?.id || null) : state.selectedEntryId,
        }
      });
      toast.success("Entry deleted.");
    } catch (error) {
      console.error("Failed to delete entry:", error);
      toast.error("Failed to delete your entry.");
    } finally {
      set({ isSaving: false });
    }
  },
  getDecryptedEntry: (id) => {
    const key = getEncryptionKey();
    if (!key) return null;
    const entry = get().entries.find((e) => e.id === id);
    if (!entry) return null;
    const content = decrypt(entry.encryptedContent, key);
    return { title: entry.title, content };
  },
  clearEntries: () => {
    set({ entries: [], selectedEntryId: null });
  },
}));