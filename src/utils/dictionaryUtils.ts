import { useDictionaryStore } from '@/stores/dictionaryStore';

export const getDictionaryLabel = (category: string, key: string): string | undefined => {
  const { getLabelByKey } = useDictionaryStore.getState();
  
  // Map string category to proper keyof DictionaryData
  const categoryMap = {
    'categories': 'categories',
    'userOrderBy': 'userOrderBy', 
    'adminSortBy': 'adminSortBy',
    'queryOps': 'queryOps'
  } as const;
  
  const mappedCategory = categoryMap[category as keyof typeof categoryMap];
  if (!mappedCategory) return undefined;
  
  return getLabelByKey(mappedCategory, key);
};

export const useDictionary = () => {
  const { dictionaries, isLoading, error, fetchDictionaries, getLabelByKey } = useDictionaryStore();
  
  return {
    dictionaries,
    isLoading,
    error,
    fetchDictionaries,
    getLabelByKey,
    getCategoryLabel: (key: string) => getLabelByKey('categories', key),
    getUserOrderByLabel: (key: string) => getLabelByKey('userOrderBy', key),
    getAdminSortByLabel: (key: string) => getLabelByKey('adminSortBy', key),
    getQueryOpsLabel: (key: string) => getLabelByKey('queryOps', key)
  };
};