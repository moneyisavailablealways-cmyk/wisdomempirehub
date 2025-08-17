import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { WisdomCard } from '@/components/WisdomCard';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';

interface WisdomItem {
  id: string;
  text: string;
  origin: string;
  subcategory: string;
  type: 'proverb' | 'quote' | 'idiom' | 'simile';
  meaning?: string;
  example?: string;
  created_at: string;
  user_id?: string;
}

interface SubcategoryCount {
  subcategory: string;
  count: number;
}

interface SubcategoryListProps {
  table: 'proverbs' | 'quotes' | 'idioms' | 'similes';
}

interface SubcategoryState {
  items: WisdomItem[];
  page: number;
  totalCount: number;
  searchQuery: string;
  loading: boolean;
}

export const SubcategoryList: React.FC<SubcategoryListProps> = ({ table }) => {
  const [counts, setCounts] = useState<SubcategoryCount[]>([]);
  const [subcategoriesState, setSubcategoriesState] = useState<Record<string, SubcategoryState>>({});
  const [countsLoading, setCountsLoading] = useState(true);
  const perPage = 21;

  // Fetch all subcategories and counts
  useEffect(() => {
    async function fetchCounts() {
      try {
        setCountsLoading(true);
        const { data: allData, error } = await supabase.from(table).select('subcategory');
        if (error) throw error;

        const uniqueSubcategories = [...new Set(allData?.map((d: any) => d.subcategory))];
        const countsData: SubcategoryCount[] = uniqueSubcategories.map((sub) => ({
          subcategory: sub,
          count: allData?.filter((d: any) => d.subcategory === sub).length || 0,
        }));

        setCounts(countsData.sort((a, b) => a.subcategory.localeCompare(b.subcategory)));

        // Initialize state per subcategory
        const initialState: Record<string, SubcategoryState> = {};
        countsData.forEach((c) => {
          initialState[c.subcategory] = { items: [], page: 1, totalCount: 0, searchQuery: '', loading: true };
        });
        setSubcategoriesState(initialState);
      } finally {
        setCountsLoading(false);
      }
    }
    fetchCounts();
  }, [table]);

  // Fetch items for a subcategory
  const fetchItems = async (subcategory: string) => {
    const state = subcategoriesState[subcategory];
    if (!state) return;

    setSubcategoriesState((prev) => ({
      ...prev,
      [subcategory]: { ...prev[subcategory], loading: true },
    }));

    try {
      const from = (state.page - 1) * perPage;
      const to = from + perPage - 1;

      let query = supabase.from(table).select('*', { count: 'exact' }).eq('subcategory', subcategory);
      if (state.searchQuery.trim()) {
        query = query.or(
          `text.ilike.%${state.searchQuery}%,origin.ilike.%${state.searchQuery}%,meaning.ilike.%${state.searchQuery}%`
        );
      }

      const { data, count, error } = await query.range(from, to).order('id', { ascending: true });
      if (error) throw error;

      setSubcategoriesState((prev) => ({
        ...prev,
        [subcategory]: { ...prev[subcategory], items: data || [], totalCount: count || 0, loading: false },
      }));
    } catch (err) {
      console.error(`Error fetching items for ${subcategory}:`, err);
      setSubcategoriesState((prev) => ({
        ...prev,
        [subcategory]: { ...prev[subcategory], loading: false },
      }));
    }
  };

  // Fetch items whenever counts are loaded
  useEffect(() => {
    counts.forEach((c) => fetchItems(c.subcategory));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [counts]);

  // Search per subcategory
  const handleSearchChange = (subcategory: string, value: string) => {
    setSubcategoriesState((prev) => ({
      ...prev,
      [subcategory]: { ...prev[subcategory], searchQuery: value, page: 1 },
    }));
    fetchItems(subcategory);
  };

  // Pagination per subcategory
  const handlePageChange = (subcategory: string, page: number) => {
    setSubcategoriesState((prev) => ({
      ...prev,
      [subcategory]: { ...prev[subcategory], page },
    }));
    fetchItems(subcategory);
  };

  if (countsLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {counts.map((c) => {
        const state = subcategoriesState[c.subcategory];
        if (!state) return null;
        const totalPages = Math.ceil(state.totalCount / perPage);

        return (
          <div key={c.subcategory}>
            <h2 className="text-2xl font-bold mb-2">{c.subcategory}</h2>
            <p className="text-muted-foreground mb-4">{state.totalCount} items found</p>

            {/* Search */}
            <div className="max-w-md mb-4">
              <Input
                type="text"
                placeholder={`Search ${c.subcategory}...`}
                value={state.searchQuery}
                onChange={(e) => handleSearchChange(c.subcategory, e.target.value)}
              />
            </div>

            {/* Items */}
            {state.loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : state.items.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {state.items.map((item) => (
                  <WisdomCard key={item.id} item={item} />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No items found.</p>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-4 flex justify-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    className={`px-3 py-1 rounded ${state.page === p ? 'bg-primary text-white' : 'bg-gray-200'}`}
                    onClick={() => handlePageChange(c.subcategory, p)}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
