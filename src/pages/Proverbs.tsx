import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { WisdomCard } from '@/components/WisdomCard';
import { AIAssistant } from '@/components/AIAssistant';
import { DownloadButton } from '@/components/DownloadButton';
import { useWisdomData } from '@/hooks/useWisdomData';
import { supabase } from '@/integrations/supabase/client';
import { Search, BookOpen } from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface ProverbItem {
  id: string;
  text: string;
  origin: string;
  subcategory: string;
  type: 'proverb';
  meaning?: string;
  example?: string;
  bg_style?: string;
  audio_voice_type?: 'child' | 'youth' | 'old';
  video_url?: string;
  created_at: string;
}

const subcategories = ['Success', 'Time', 'Love', 'Money', 'Wisdom', 'Fear', 'Trust', 'Friendship'];

const Proverbs = () => {
  // State
  const [proverbs, setProverbs] = useState<ProverbItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  
  const ITEMS_PER_PAGE = 50; // Adjust as needed
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
  
  // Fetch function
  const fetchProverbs = async (category: string, page: number) => {
    try {
      setLoading(true);
      setError(null);
  
      const start = (page - 1) * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE - 1;
  
      let query = supabase
        .from("proverbs")
        .select("*", { count: "exact" })
        .order("id", { ascending: true }) // keep pagination consistent
        .range(start, end);
  
      if (category.toLowerCase() !== "all") {
        query = query.eq("subcategory", category);
      }
  
      const { data, error: queryError, count } = await query;
  
      if (queryError) throw queryError;
  
      setProverbs((data || []) as ProverbItem[]);
      setTotalCount(count || 0);
    } catch (err) {
      console.error("Error fetching proverbs:", err);
      setError(err instanceof Error ? err.message : "Failed to load proverbs");
    } finally {
      setLoading(false);
    }
  };
  
  // Effects
  useEffect(() => {
    fetchProverbs(selectedCategory, currentPage);
  }, [selectedCategory, currentPage]);
  
  // Handlers
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Reset to first page
  };
  
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };
  
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  if (error) {
    return <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-4">Error Loading Proverbs</h1>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 bg-slate-500">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="font-wisdom mx-[28px] text-center font-bold text-5xl text-gray-950">Proverbs</h1>
            <DownloadButton category="proverbs" />
          </div>
          <p className="text-lg mb-6 text-center text-zinc-50">
            Traditional sayings that convey wisdom through generations
          </p>
          
          {/* Search Bar */}
          <div className="w-full max-w-md mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search any proverb, idiom, quote, or simile..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 bg-card border-border" />
            </div>
          </div>

          {/* Subcategory Navigation */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-center text-zinc-50">Categories</h3>
            <div className="flex flex-wrap gap-2">
              <Button variant={activeSubcategory === 'all' ? 'wisdom' : 'outline'} size="sm" onClick={() => setActiveSubcategory('all')}>
                All Proverbs
                <Badge variant="secondary" className="ml-2">
                  {proverbs.length}
                </Badge>
              </Button>
              {subcategories.map(subcategory => {
              const count = proverbs.filter(item => item.subcategory.toLowerCase() === subcategory.toLowerCase()).length;
              return <Button key={subcategory} variant={activeSubcategory === subcategory ? 'wisdom' : 'outline'} size="sm" onClick={() => setActiveSubcategory(subcategory)}>
                    {subcategory}
                    <Badge variant="secondary" className="ml-2">
                      {count}
                    </Badge>
                  </Button>;
            })}
            </div>
          </div>

          {/* AI Assistant */}
          <AIAssistant category="Proverbs" />
        </div>

        {loading ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <div key={i} className="animate-pulse">
                <div className="bg-muted h-64 rounded-lg"></div>
              </div>)}
          </div> : filteredProverbs.length > 0 ? <>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold font-wisdom mb-2 text-zinc-950">
                {activeSubcategory === 'all' ? 'All Proverbs' : `${activeSubcategory} Proverbs`}
              </h2>
              <p className="text-muted-foreground">
                {filteredProverbs.length} {filteredProverbs.length === 1 ? 'proverb' : 'proverbs'} found
                {searchTerm && ` for "${searchTerm}"`}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentProverbs.map(item => <WisdomCard key={item.id} item={item} />)}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex flex-col items-center space-y-4 md:relative md:bottom-auto fixed bottom-4 left-0 right-0 z-10 md:z-auto bg-background/95 md:bg-transparent backdrop-blur-sm md:backdrop-blur-none p-4 md:p-0 border-t md:border-t-0">
                <p className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </p>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage > 1) setCurrentPage(currentPage - 1);
                        }}
                        className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                        }}
                        className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </> : <div className="text-center py-16">
            <div className="max-w-md mx-auto space-y-4">
              <BookOpen className="h-16 w-16 text-muted-foreground mx-auto" />
              <h3 className="text-xl font-semibold text-foreground">No Proverbs Found</h3>
              <p className="text-muted-foreground">
                {searchTerm || activeSubcategory !== 'all' 
                  ? `No results found. Try a different keyword or category.`
                  : 'No proverbs available yet.'}
              </p>
            </div>
          </div>}
      </div>
    </div>;
};
export default Proverbs;