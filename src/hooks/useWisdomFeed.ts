import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  getCachedItems,
  setCachedItems,
  getCachedCount,
  setCachedCount,
  getCachedSubcategoryCounts,
  setCachedSubcategoryCounts,
  type CachedWisdomItem,
} from '@/lib/wisdomCache';

// Only select fields we need - NEVER select *
const SELECT_FIELDS = 'id,type,subcategory,text,origin,created_at,video_url,audio_voice_type';

export interface WisdomFeedItem {
  id: string;
  type: 'proverb' | 'quote' | 'idiom' | 'simile';
  subcategory: string;
  text: string;
  origin: string;
  created_at: string;
  video_url?: string;
  audio_voice_type?: 'child' | 'youth' | 'old';
}

type TableName = 'proverbs' | 'quotes' | 'idioms' | 'similes';

const PAGE_SIZE = 20;

export function useWisdomFeed(table: TableName, searchTerm: string = '', subcategoryFilter: string = 'all') {
  const [items, setItems] = useState<WisdomFeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [subcategoryCounts, setSubcategoryCounts] = useState<Record<string, number>>({});

  // Track current offset for cursor pagination
  const offsetRef = useRef(0);
  const prefetchedRef = useRef<WisdomFeedItem[] | null>(null);
  const isFetchingRef = useRef(false);

  // Fetch total count (lightweight HEAD request)
  const fetchCount = useCallback(async () => {
    // Try cache first
    const cached = await getCachedCount(table);
    if (cached !== null) setTotalCount(cached);

    const { count, error } = await supabase
      .from(table)
      .select('id', { count: 'exact', head: true });
    
    if (!error && count !== null) {
      setTotalCount(count);
      setCachedCount(table, count);
    }
  }, [table]);

  // Fetch subcategory counts efficiently
  const fetchSubcategoryCounts = useCallback(async () => {
    // Try cache first
    const cached = await getCachedSubcategoryCounts(table);
    if (cached) setSubcategoryCounts(cached);

    // Fetch all subcategories with count
    const { data, error } = await supabase
      .from(table)
      .select('subcategory');

    if (!error && data) {
      const counts: Record<string, number> = {};
      data.forEach((item: { subcategory: string }) => {
        const sub = item.subcategory?.trim() || 'Uncategorized';
        counts[sub] = (counts[sub] || 0) + 1;
      });
      setSubcategoryCounts(counts);
      setCachedSubcategoryCounts(table, counts);
    }
  }, [table]);

  // Fetch a page of items
  const fetchPage = useCallback(async (offset: number, isBackground = false): Promise<WisdomFeedItem[]> => {
    let query = supabase
      .from(table)
      .select(SELECT_FIELDS)
      .order('created_at', { ascending: false });

    // Apply subcategory filter at DB level
    if (subcategoryFilter !== 'all') {
      query = query.ilike('subcategory', subcategoryFilter);
    }

    // Apply search filter at DB level  
    if (searchTerm.trim()) {
      query = query.or(`text.ilike.%${searchTerm}%,origin.ilike.%${searchTerm}%,subcategory.ilike.%${searchTerm}%`);
    }

    query = query.range(offset, offset + PAGE_SIZE - 1);

    const { data, error: fetchError } = await query;

    if (fetchError) {
      if (!isBackground) setError(fetchError.message);
      return [];
    }

    const items = (data || []) as WisdomFeedItem[];
    
    // Cache items in background
    if (items.length > 0) {
      setCachedItems(items as CachedWisdomItem[]);
    }

    return items;
  }, [table, subcategoryFilter, searchTerm]);

  // Prefetch next page in background
  const prefetchNext = useCallback(async (currentOffset: number) => {
    if (prefetchedRef.current !== null) return;
    const nextItems = await fetchPage(currentOffset + PAGE_SIZE, true);
    if (nextItems.length > 0) {
      prefetchedRef.current = nextItems;
    }
  }, [fetchPage]);

  // Initial load
  const loadInitial = useCallback(async () => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    setLoading(true);
    setError(null);
    offsetRef.current = 0;
    prefetchedRef.current = null;

    try {
      // Try showing cached data instantly
      if (!searchTerm.trim() && subcategoryFilter === 'all') {
        const cached = await getCachedItems(table.slice(0, -1), 0, PAGE_SIZE);
        if (cached && cached.length > 0) {
          setItems(cached as WisdomFeedItem[]);
          setLoading(false);
        }
      }

      // Fetch fresh data
      const freshItems = await fetchPage(0);
      setItems(freshItems);
      setHasMore(freshItems.length >= PAGE_SIZE);
      offsetRef.current = freshItems.length;

      // Prefetch next page in background
      if (freshItems.length >= PAGE_SIZE) {
        prefetchNext(0);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load');
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [table, searchTerm, subcategoryFilter, fetchPage, prefetchNext]);

  // Load more (infinite scroll)
  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore || isFetchingRef.current) return;
    isFetchingRef.current = true;
    setLoadingMore(true);

    try {
      let newItems: WisdomFeedItem[];

      // Use prefetched data if available
      if (prefetchedRef.current) {
        newItems = prefetchedRef.current;
        prefetchedRef.current = null;
      } else {
        newItems = await fetchPage(offsetRef.current);
      }

      if (newItems.length > 0) {
        setItems(prev => [...prev, ...newItems]);
        offsetRef.current += newItems.length;
        setHasMore(newItems.length >= PAGE_SIZE);

        // Prefetch next page
        if (newItems.length >= PAGE_SIZE) {
          prefetchNext(offsetRef.current);
        }
      } else {
        setHasMore(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load more');
    } finally {
      setLoadingMore(false);
      isFetchingRef.current = false;
    }
  }, [loadingMore, hasMore, fetchPage, prefetchNext]);

  // Reset and reload when filters change
  useEffect(() => {
    loadInitial();
  }, [loadInitial]);

  // Fetch counts on mount
  useEffect(() => {
    fetchCount();
    fetchSubcategoryCounts();
  }, [fetchCount, fetchSubcategoryCounts]);

  return {
    items,
    loading,
    loadingMore,
    error,
    hasMore,
    totalCount,
    subcategoryCounts,
    loadMore,
    refetch: loadInitial,
  };
}
