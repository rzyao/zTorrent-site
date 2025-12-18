import { useState } from 'react';
import { MoviesService } from '@/api/services/MoviesService';
import { PlaylistsService } from '@/api/services/PlaylistsService';
import { TorrentsService } from '@/api/services/TorrentsService';
import { extractErrorMessage } from '../utils';
import type { ReviewItem } from '../types';

export function useReviewActions(onItemsUpdate: (updater: (prev: ReviewItem[]) => ReviewItem[]) => void) {
  const [selectedItem, setSelectedItem] = useState<ReviewItem | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
  const [actionNotes, setActionNotes] = useState('');
  const [showHistory, setShowHistory] = useState(false);

  const handleAction = (item: ReviewItem, action: 'approve' | 'reject') => {
    setSelectedItem(item);
    setActionType(action);
    setActionNotes('');
  };

  const confirmAction = async () => {
    if (!selectedItem || !actionType) return;
    try {
      const payload = { id: selectedItem.id, action: actionType, note: actionNotes.trim() } as any;
      if (selectedItem.type === 'torrent') {
        await TorrentsService.torrentsControllerReview(payload);
      } else if (selectedItem.type === 'movie') {
        // TODO: 待后端实现 moviesControllerReview API
        console.warn('电影审核 API 待实现');
        throw new Error('电影审核功能待实现');
      } else if (selectedItem.type === 'playlist') {
        await PlaylistsService.playlistsControllerReview(payload);
      }
      onItemsUpdate(prev => prev.map(it => it.id === selectedItem.id ? { ...it, status: actionType === 'approve' ? 'approved' : 'rejected', notes: payload.note } : it));
    } catch (e) {
      console.error(extractErrorMessage(e));
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
  };
}

