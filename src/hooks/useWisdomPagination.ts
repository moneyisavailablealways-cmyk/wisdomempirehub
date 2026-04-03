import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

const SELECT_FIELDS = 'id,type,subcategory,text,origin,created_at,video_url,audio_voice_type';
const PAGE_SIZE = 12;

export interface WisdomPaginationItem {
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

export function useWisdomPagination(
  table: TableName,
  searchTerm: string = '',
  subcategoryFilter: string = 'all'
) {
  const [items, setItems] = useState<WisdomPaginationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const cacheRef = useRef<Map<string, WisdomPaginationItem[]>>(new Map());

  const totalPages = totalCount !== null ? Math.max(1, Math.ceil(totalCount / PAGE_SIZE)) : null;

  // Build a cache key from current filters + page
  const getCacheKey = useCallback(
    (page: number) => `${table}:${subcategoryFilter}:${searchTerm}:${page}`,
    [table, subcategoryFilter, searchTerm]
  );

  // Build the base query with filters
  const buildQuery = useCallback(
    (countOnly: boolean) => {
      let query = countOnly
        ? supabase.from(table).select('id', { count: 'exact', head: true })
        : supabase.from(table).select(SELECT_FIELDS).order('created_at', { ascending: false });

      if (subcategoryFilter !== 'all') {
        query = query.ilike('subcategory', subcategoryFilter);
      }
      if (searchTerm.trim()) {
        query = query.or(
          `text.ilike.%${searchTerm}%,origin.ilike.%${searchTerm}%,subcategory.ilike.%${searchTerm}%`
        );
      }
      return query;
    },
    [table, subcategoryFilter, searchTerm]
  );

  // Fetch count for current filters
  const fetchCount = useCallback(async () => {
    const { count, error: countError } = await buildQuery(true);
    if (!countError && count !== null) {
      setTotalCount(count);
    }
  }, [buildQuery]);

  // Fetch a specific page
  const fetchPage = useCallback(
    async (page: number) => {
      const key = getCacheKey(page);
      const cached = cacheRef.current.get(key);
      if (cached) {
        setItems(cached);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      const start = (page - 1) * PAGE_SIZE;
      const end = start + PAGE_SIZE - 1;

      const { data, error: fetchError } = await buildQuery(false).range(start, end);

      if (fetchError) {
        setError(fetchError.message);
        setLoading(false);
        return;
      }

      const result = (data || []) as WisdomPaginationItem[];
      cacheRef.current.set(key, result);
      setItems(result);
      setLoading(false);

      // Prefetch next page in background
      if (result.length >= PAGE_SIZE) {
        const nextKey = getCacheKey(page + 1);
        if (!cacheRef.current.has(nextKey)) {
          const nextStart = page * PAGE_SIZE;
          const nextEnd = nextStart + PAGE_SIZE - 1;
          buildQuery(false)
            .range(nextStart, nextEnd)
            .then(({ data: nextData }) => {
              if (nextData) {
                cacheRef.current.set(nextKey, nextData as WisdomPaginationItem[]);
              }
            });
        }
      }
    },
    [buildQuery, getCacheKey]
  );

  // Reset when filters change
  useEffect(() => {
    cacheRef.current.clear();
    setCurrentPage(1);
    fetchCount();
    fetchPage(1);
  }, [table, searchTerm, subcategoryFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch when page changes (but not on filter change — handled above)
  const goToPage = useCallback(
    (page: number) => {
      if (totalPages && page >= 1 && page <= totalPages) {
        setCurrentPage(page);
        fetchPage(page);
        // Scroll to top of content
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    [totalPages, fetchPage]
  );

  return {
    items,
    loading,
    error,
    currentPage,
    totalPages,
    totalCount,
    goToPage,
    pageSize: PAGE_SIZE,
  };
}
