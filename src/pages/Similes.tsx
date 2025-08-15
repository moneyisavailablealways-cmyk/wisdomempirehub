import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { WisdomCard } from '@/components/WisdomCard';
import { AIAssistant } from '@/components/AIAssistant';
import { DownloadButton } from '@/components/DownloadButton';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
interface SimileItem {
  id: string;
  text: string;
  origin: string;
  subcategory: string;
  meaning?: string;
  example?: string;
  type: "simile";
  video_url?: string;
  audio_voice_type?: "child" | "youth" | "old";
  bg_style?: string;
  created_at: string;
  user_id?: string;
}
const categories = [{
  key: 'all',
  label: 'All Similes'
}, {
  key: 'emotions',
  label: 'Emotion'
}, {
  key: 'people',
  label: 'People'
}, {
  key: 'animals',
  label: 'Animals'
}, {
  key: 'nature',
  label: 'Nature'
}, {
  key: 'behavior',
  label: 'Behavior'
}, {
  key: 'appearance',
  label: 'Appearance'
}];
const ITEMS_PER_PAGE = 15;
const Similes = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [similes, setSimiles] = useState<SimileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
  const fetchSimiles = async (category: string, page: number) => {
    try {
      setLoading(true);
      setError(null);
      const start = (page - 1) * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE - 1;
      let query = supabase.from('similes').select('*', {
        count: 'exact'
      }).range(start, end);
      if (category !== 'all') {
        query = query.eq('subcategory', category);
      }
      const {
        data,
        error: queryError,
        count
      } = await query;
      if (queryError) {
        throw queryError;
      }
      setSimiles((data || []) as SimileItem[]);
      setTotalCount(count || 0);
    } catch (err) {
      console.error('Error fetching similes:', err);
      setError(err instanceof Error ? err.message : 'Failed to load similes');
    } finally {
      setLoading(false);
    }
  };
  const fetchCategoryCounts = async () => {
    try {
      const counts: Record<string, number> = {};
      
      // Fetch total count for 'all'
      const { count: totalCount } = await supabase
        .from('similes')
        .select('*', { count: 'exact', head: true });
      counts['all'] = totalCount || 0;
      
      // Fetch counts for each specific category
      for (const category of categories.slice(1)) { // Skip 'all' category
        const { count } = await supabase
          .from('similes')
          .select('*', { count: 'exact', head: true })
          .eq('subcategory', category.key);
        counts[category.key] = count || 0;
      }
      
      setCategoryCounts(counts);
    } catch (err) {
      console.error('Error fetching category counts:', err);
    }
  };

  const getCategoryCount = (categoryKey: string): number => {
    return categoryCounts[categoryKey] || 0;
  };

  useEffect(() => {
    fetchCategoryCounts();
  }, []);

  useEffect(() => {
    fetchSimiles(selectedCategory, currentPage);
  }, [selectedCategory, currentPage]);
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Reset to first page when category changes
  };
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  if (error) {
    return <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-4">Error Loading Similes</h1>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 bg-slate-700">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="font-wisdom text-foreground font-bold text-5xl">Similes</h1>
            <DownloadButton category="similes" />
          </div>
          <p className="text-lg mb-6 text-center text-muted-foreground">
            Comparative phrases that use "like" or "as" to create vivid descriptions and imagery
          </p>

          {/* Category Buttons */}
          <div className="flex flex-wrap gap-2 mb-6 justify-center">
            {categories.map(category => (
              <Button 
                key={category.key} 
                variant={selectedCategory === category.key ? "default" : "outline"} 
                onClick={() => handleCategoryChange(category.key)} 
                className="px-4 py-2 flex items-center gap-2"
              >
                {category.label}
                <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-primary-foreground bg-primary/20 rounded-full border border-primary/30">
                  {getCategoryCount(category.key)}
                </span>
              </Button>
            ))}
          </div>

          {/* AI Assistant */}
          <AIAssistant category="Similes" />
        </div>

        {loading ? <div className="flex justify-center items-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div> : <>
            {/* Similes Grid */}
            {similes.length > 0 ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {similes.map(simile => <WisdomCard key={simile.id} item={simile} />)}
              </div> : <div className="text-center py-16">
                <div className="max-w-md mx-auto space-y-4">
                  <h3 className="text-xl font-semibold text-foreground">No Similes Found</h3>
                  <p className="text-muted-foreground">
                    No similes found for the selected category.
                  </p>
                </div>
              </div>}

            {/* Pagination */}
            {totalPages > 1 && <div className="flex flex-col items-center space-y-4">
                <p className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages} ({totalCount} total similes)
                </p>
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={handlePreviousPage} disabled={currentPage === 1} className="px-4 py-2">
                    Previous
                  </Button>
                  <Button variant="outline" onClick={handleNextPage} disabled={currentPage === totalPages} className="px-4 py-2">
                    Next
                  </Button>
                </div>
              </div>}
          </>}
      </div>
    </div>;
};
export default Similes;