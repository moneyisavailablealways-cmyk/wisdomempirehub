import React, { useState } from 'react';
import { WisdomCard } from '@/components/WisdomCard';
import { WisdomCardSkeleton } from '@/components/WisdomCardSkeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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

interface PaginatedWisdomGridProps {
  items: WisdomItem[];
  loading: boolean;
  currentPage: number;
  totalPages: number | null;
  onPageChange: (page: number) => void;
  emptyIcon: React.ReactNode;
  emptyTitle: string;
  emptyMessage: string;
}

export const PaginatedWisdomGrid = React.memo(function PaginatedWisdomGrid({
  items,
  loading,
  currentPage,
  totalPages,
  onPageChange,
  emptyIcon,
  emptyTitle,
  emptyMessage,
}: PaginatedWisdomGridProps) {
  const [goToInput, setGoToInput] = useState('');

  const handleGoTo = (e: React.FormEvent) => {
    e.preventDefault();
    const page = parseInt(goToInput, 10);
    if (!isNaN(page) && totalPages && page >= 1 && page <= totalPages) {
      onPageChange(page);
      setGoToInput('');
    }
  };

  // Generate page numbers to show
  const getPageNumbers = (): (number | 'ellipsis')[] => {
    if (!totalPages || totalPages <= 7) {
      return Array.from({ length: totalPages || 0 }, (_, i) => i + 1);
    }
    const pages: (number | 'ellipsis')[] = [1];
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    if (start > 2) pages.push('ellipsis');
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < totalPages - 1) pages.push('ellipsis');
    pages.push(totalPages);
    return pages;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 12 }).map((_, i) => (
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

  const pageNumbers = getPageNumbers();

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-opacity duration-300">
        {items.map((item) => (
          <WisdomCard key={item.id} item={item} />
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages && totalPages > 1 && (
        <div className="flex flex-col items-center gap-4 py-8">
          {/* Page numbers */}
          <div className="flex items-center gap-1 flex-wrap justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Previous</span>
            </Button>

            {pageNumbers.map((page, idx) =>
              page === 'ellipsis' ? (
                <span key={`e-${idx}`} className="px-2 text-muted-foreground">…</span>
              ) : (
                <Button
                  key={page}
                  variant={page === currentPage ? 'wisdom' : 'outline'}
                  size="sm"
                  onClick={() => onPageChange(page)}
                  className="min-w-[36px]"
                >
                  {page}
                </Button>
              )
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="gap-1"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Page info + Go to */}
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span>Page {currentPage} of {totalPages}</span>
            <form onSubmit={handleGoTo} className="flex items-center gap-1">
              <Input
                type="number"
                min={1}
                max={totalPages}
                value={goToInput}
                onChange={(e) => setGoToInput(e.target.value)}
                placeholder="Go to"
                className="w-20 h-8 text-sm bg-card border-border"
              />
              <Button type="submit" variant="outline" size="sm">
                Go
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
});
