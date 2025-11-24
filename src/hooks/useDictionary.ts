import { useDictionaryStore } from '@/stores/dictionaryStore';

export const useDictionaryLabels = () => {
  const store = useDictionaryStore();
  
  const getCategoryLabel = (key: string): string | undefined => {
    return store.getLabelByKey('categories', key);
  };
  
  const getUserOrderByLabel = (key: string): string | undefined => {
    return store.getLabelByKey('userOrderBy', key);
  };
  
  const getAdminSortByLabel = (key: string): string | undefined => {
    return store.getLabelByKey('adminSortBy', key);
  };
  
  const getQueryOpsLabel = (key: string): string | undefined => {
    return store.getLabelByKey('queryOps', key);
  };
  
  const getAllCategories = () => {
    return store.dictionaries?.categories || [];
  };
  
  const getAllUserOrderBy = () => {
    return store.dictionaries?.userOrderBy || [];
  };
  
  const getAllAdminSortBy = () => {
    return store.dictionaries?.adminSortBy || [];
  };
  
  const getAllQueryOps = () => {
    return store.dictionaries?.queryOps || [];
  };
  
  return {
    // Individual label getters
    getCategoryLabel,
    getUserOrderByLabel,
    getAdminSortByLabel,
    getQueryOpsLabel,
    
    // Batch getters
    getAllCategories,
    getAllUserOrderBy,
    getAllAdminSortBy,
    getAllQueryOps,
    
    // Store state
    isLoading: store.isLoading,
    error: store.error,
    dictionaries: store.dictionaries,
    refreshDictionaries: store.fetchDictionaries
  };
};