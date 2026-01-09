import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ViewMode = 'grid' | 'list';

interface PreferenceState {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

export const usePreferenceStore = create<PreferenceState>()(
  persist(
    (set) => ({
      viewMode: 'grid',
      setViewMode: (mode) => set({ viewMode: mode }),
    }),
    {
      name: 'preference-storage',
    }
  )
);
