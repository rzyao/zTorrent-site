
import { useReviewItemHistory } from './useReviewQueries';
import type { ReviewItem } from '../types';

export function useReviewHistory(selectedItem: ReviewItem | null, showHistory: boolean) {
  const { data: historyItems, isLoading: historyLoading } = useReviewItemHistory(
    showHistory && selectedItem ? selectedItem.id : undefined,
    showHistory && selectedItem ? selectedItem.type : undefined
  );

  return { 
    historyItems: historyItems || [], 
    historyLoading,
    setHistoryItems: () => {} // Read-only now
  };
}
