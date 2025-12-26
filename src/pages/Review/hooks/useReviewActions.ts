
import { useState } from 'react';
import { useReviewAction } from './useReviewMutations';
import { extractErrorMessage } from '../utils';
import type { ReviewItem } from '../types';
import { toast } from 'sonner'; 

export function useReviewActions() {
  const [selectedItem, setSelectedItem] = useState<ReviewItem | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
  const [actionNotes, setActionNotes] = useState('');
  const [showHistory, setShowHistory] = useState(false);

  const mutation = useReviewAction();

  const handleAction = (item: ReviewItem, action: 'approve' | 'reject') => {
    setSelectedItem(item);
    setActionType(action);
    setActionNotes('');
  };

  const confirmAction = async () => {
    if (!selectedItem || !actionType) return;
    try {
      await mutation.mutateAsync({
        id: selectedItem.id,
        type: selectedItem.type,
        action: actionType,
        note: actionNotes.trim(),
      });
      toast.success(actionType === 'approve' ? '审核通过' : '审核驳回');
    } catch (e) {
      console.error(extractErrorMessage(e));
      toast.error('操作失败: ' + extractErrorMessage(e));
    } finally {
      setActionType(null);
      setActionNotes('');
      setSelectedItem(null);
    }
  };

  const cancelAction = () => {
    setActionType(null);
    setActionNotes('');
  };

  return {
    selectedItem, setSelectedItem,
    actionType, setActionType,
    actionNotes, setActionNotes,
    showHistory, setShowHistory,
    handleAction, confirmAction, cancelAction,
    isPending: mutation.isPending,
  };
}
