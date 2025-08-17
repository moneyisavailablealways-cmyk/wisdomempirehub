import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { WisdomCard } from '@/components/WisdomCard';
import { supabase } from '../integrations/supabase/client';
import { Loader2, Search } from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface SubcategoryCount {
  subcategory: string;
  count: number;
}

interface WisdomItem {
  id: string;
  text: string;
  origin: string;
  subcategory: string;
  type: 'proverb' | 'quote' | 'idiom' | 'simile';
  meaning?: string;
  example?: string;
  bg_style?: string;
  audio_voice_type?: 'child' | 'youth' | 'old';
  video_url?: string;
  created_at: string;
  user_id?: string;
}

interface SubcategoryListProps {
  table: 'proverbs' | 'quotes' | 'idioms' | 'similes';
}

export const SubcategoryList: React.FC<SubcategoryListProps> = ({ table }) => {
  const [counts, setCounts] = useState<SubcategoryCount[]>([]);
  const [items, setItems] = useState<WisdomItem[]>([]);
  const [selectedSub, setSelectedSub] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [countsLoading, setCountsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const perPage = 21;
  const [totalCount, setTotalCount] = useState(0);

  // Load subcategory counts using proper aggregation to avoid 1000-row limit
  useEffect(() => {
    async function fetchCounts() {
      try {
        setCountsLoading(true);
        setError(null);
        
        // Get all subcategories to find unique ones
        const { data: allSubcategories, error: subcatError } = await supabase
          .from(table)
          .select('subcategory');

        if (subcatError) throw subcatError;

        // Get unique subcategories
        const uniqueSubcategories = [...new Set((allSubcategories || []).map(item => item.subcategory))];

        // Get count for each subcategory using exact count
        const countPromises = uniqueSubcategories.map(async (subcategory) => {
          const { count, error } = await supabase
            .from(table)
            .select('*', { count: 'exact', head: true })
            .eq('subcategory', subcategory);
          
          if (error) throw error;
          return { subcategory, count: count || 0 };
        });

        const countsData = await Promise.all(countPromises);
        setCounts(countsData.sort((a, b) => a.subcategory.localeCompare(b.subcategory)));
      } catch (err) {
        console.error('Error fetching counts:', err);
        setError(err instanceof Error ? err.message : 'Failed to load categories');
      } finally {
        setCountsLoading(false);
      }
    }
    
    fetchCounts();
  }, [table]);

  // Load items when subcategory/page/search changes
  useEffect(() => {
    if (!selectedSub) return;
    
    async function fetchItems() {
      try {
        setLoading(true);
        setError(null);
        
        const from = (page - 1) * perPage;
        const to = from + perPage - 1;

        let query = supabase
          .from(table)
          .select('*', { count: 'exact' })
          .eq('subcategory', selectedSub);

        // Add search filter if search query exists
        if (searchQuery.trim()) {
          query = query.or(`text.ilike.%${searchQuery}%,origin.ilike.%${searchQuery}%,meaning.ilike.%${searchQuery}%`);
        }

        const { data, count, error } = await query
          .range(from, to)
          .order('id', { ascending: true });

        if (error) throw error;
        
        setItems((data || []) as WisdomItem[]);
        setTotalCount(count || 0);
      } catch (err) {
        console.error('Error fetching items:', err);
        setError(err instanceof Error ? err.message : 'Failed to load items');
      } finally {
        setLoading(false);
      }
    }
    
    fetchItems();
  }, [selectedSub, page, table, searchQuery]);

  const handleSubcategoryClick = useCallback((subcategory: string) => {
    setSelectedSub(subcategory);
    setPage(1);
    setSearchQuery(''); // Reset search when changing subcategory
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    setPage(1); // Reset to first page when searching
  }, []);

  const totalPages = Math.ceil(totalCount / perPage);

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Subcategory Buttons */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold mb-3 text-center text-foreground">Categories</h3>
        {countsLoading ? (
          <div className="flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 justify-center">
            {counts.map((c) => (
              <Button
                key={c.subcategory}
                variant={selectedSub === c.subcategory ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleSubcategoryClick(c.subcategory)}
                className="gap-2"
              >
                {c.subcategory}
                <Badge variant="secondary">
                  {c.count}
                </Badge>
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* Items Display */}
      {selectedSub && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold font-wisdom mb-2 text-foreground">
              {selectedSub} {table.charAt(0).toUpperCase() + table.slice(1)}
            </h2>
            <p className="text-muted-foreground">
              {totalCount} {totalCount === 1 ? 'item' : 'items'} found
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder={`Search ${selectedSub.toLowerCase()} ${table}...`}
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : items.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item) => (
                  <WisdomCard key={item.id} item={item} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 flex flex-col items-center space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Page {page} of {totalPages}
                  </p>
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (page > 1) setPage(page - 1);
                          }}
                          className={page === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                      </PaginationItem>
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const pageNum = i + 1;
                        return (
                          <PaginationItem key={pageNum}>
                            <PaginationLink
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                setPage(pageNum);
                              }}
                              isActive={page === pageNum}
                              className="cursor-pointer"
                            >
                              {pageNum}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      })}
                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (page < totalPages) setPage(page + 1);
                          }}
                          className={page === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No items found for this category.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};