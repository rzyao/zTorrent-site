
import { useState, useMemo, useEffect } from 'react';
import { useDynamicTitle } from '@/hooks/useDynamicTitle';
import type { ReviewItem, ReviewStatus, ReviewType } from '../types';
import { useReviewItems, useReviewCounts, useReviewSwitches } from './useReviewQueries';

export function useReviewData() {
  useDynamicTitle('审核');

  const [typeFilter, setTypeFilter] = useState<ReviewType>('torrent');
  const [statusFilter, setStatusFilter] = useState<ReviewStatus>('pending');
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month' | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setPage(1); // Reset page on search
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset page on filter change
  useEffect(() => {
    setPage(1);
  }, [typeFilter, statusFilter]);

  // Queries
  const { data: itemsData, isLoading: itemsLoading } = useReviewItems({
    type: typeFilter,
    status: statusFilter,
    page,
    limit,
    keyword: debouncedSearchQuery || undefined,
  });

  const { data: countsData } = useReviewCounts();
  const { data: switchesData } = useReviewSwitches();

  // Derived state
  const items = itemsData?.items || [];
  const total = itemsData?.total || 0;
  const loading = itemsLoading;

  // Client-side filtering for endpoints that don't support server-side search (e.g. pending lists)
  // For history lists, the backend usually handles it, but client-side filtering here is safe as a fallback/refinement for current page.
  const filteredItems = useMemo(() => {
    if (!debouncedSearchQuery) return items;
    return items.filter(item => 
        item.title?.toLowerCase?.().includes(debouncedSearchQuery.toLowerCase()) ||
        item.submitter?.toLowerCase?.().includes(debouncedSearchQuery.toLowerCase())
    );
  }, [items, debouncedSearchQuery]);

  const stats = useMemo(() => ({
    pending: (countsData?.torrent || 0) + (countsData?.movie || 0) + (countsData?.series || 0) + (countsData?.playlist || 0),
    pendingMovies: countsData?.movie || 0,
    pendingSeries: countsData?.series || 0,
    pendingPlaylists: countsData?.playlist || 0,
    pendingTorrents: countsData?.torrent || 0,
    todayApproved: 0, 
    todayRejected: 0,
  }), [countsData]);

  const reviewSwitches = switchesData || {};

  return {
    // filters
    typeFilter, setTypeFilter,
    statusFilter, setStatusFilter,
    timeRange, setTimeRange,
    searchQuery, setSearchQuery,
    showFilters, setShowFilters,
    // data
    loading, items, setItems: () => {}, // No-op, managed by query
    filteredItems, stats,
    page, setPage, limit, setLimit, total, setTotal: () => {}, // No-op
    reviewSwitches,
    // fetchers are automatic now
  };
}
