import { create } from 'zustand';
import { DictionaryService } from '@/api/services/DictionaryService';

interface DictionaryItem {
  key: string;
  label: string;
}

interface DictionaryData {
  categories?: DictionaryItem[];
  userOrderBy?: DictionaryItem[];
  adminSortBy?: DictionaryItem[];
  queryOps?: DictionaryItem[];
}

interface DictionaryState {
  dictionaries: DictionaryData | null;
  isLoading: boolean;
  error: string | null;
  fetchDictionaries: () => Promise<void>;
  getLabelByKey: (category: keyof DictionaryData, key: string) => string | undefined;
}

export const useDictionaryStore = create<DictionaryState>((set, get) => ({
  dictionaries: null,
  isLoading: false,
  error: null,

  fetchDictionaries: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await DictionaryService.dictionaryControllerDictionaries();
      if (response.data) {
        set({ dictionaries: response.data, isLoading: false });
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch dictionaries', 
        isLoading: false 
      });
    }
  },

  getLabelByKey: (category, key) => {
    const { dictionaries } = get();
    if (!dictionaries || !dictionaries[category]) return undefined;
    
    const items = dictionaries[category] as DictionaryItem[];
    const item = items.find(item => item.key === key);
    return item?.label;
  }
}));