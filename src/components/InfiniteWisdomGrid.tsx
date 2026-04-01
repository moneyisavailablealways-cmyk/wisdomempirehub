import React, { useEffect, useRef, useCallback } from 'react';
import { WisdomCard } from '@/components/WisdomCard';
import { WisdomCardSkeleton } from '@/components/WisdomCardSkeleton';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface WisdomItem {
  id: string;
  type: 'proverb' | 'quote' | 'idiom' | 'simile';
  subcategory: string;
  text: string;
  origin: string;
  created_at: string;
  video_url?: string;
  audio_voice_type?: 'child' | 'youth' | 'old';
}

interface InfiniteWisdomGridProps {
  items: WisdomItem[];
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  emptyIcon: React.ReactNode;
  emptyTitle: string;
  emptyMessage: string;
}

export const InfiniteWisdomGrid = React.memo(function InfiniteWisdomGrid({
  items,
  loading,
  loadingMore,
  hasMore,
  onLoadMore,
  emptyIcon,
  emptyTitle,
  emptyMessage,
}: InfiniteWisdomGridProps) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Infinite scroll with IntersectionObserver
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMore && !loadingMore && !loading) {
        onLoadMore();
      }
    },
    [hasMore, loadingMore, loading, onLoadMore]
  );

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(handleObserver, {
      rootMargin: '400px', // Start loading before user reaches bottom
    });

    if (sentinelRef.current) {
      observerRef.current.observe(sentinelRef.current);
    }

    return () => observerRef.current?.disconnect();
  }, [handleObserver]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <WisdomCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        {emptyIcon}
        <h3 className="text-xl font-semibold mt-4">{emptyTitle}</h3>
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <WisdomCard key={item.id} item={item} />
        ))}
      </div>

      {/* Sentinel for infinite scroll */}
      <div ref={sentinelRef} className="h-4" />

      {loadingMore && (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}

      {!hasMore && items.length > 0 && (
        <p className="text-center text-muted-foreground py-8">
          You've reached the end — {items.length} items loaded
        </p>
      )}
    </>
  );
});
