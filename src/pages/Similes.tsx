import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { WisdomCard } from '@/components/WisdomCard';
import { AIAssistant } from '@/components/AIAssistant';
import { DownloadButton } from '@/components/DownloadButton';
import { supabase } from '@/lib/supabaseClient';
import { Search, Zap } from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

const subcategories = [
  'Emotion',
  'People',
  'Animals',
  'Nature',
  'Behavior',
  'Appearance',
];

const ITEMS_PER_PAGE = 12;

const Similes = () => {
  const [similes, setSimiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSubcategory, setActiveSubcategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // --- Fetch similes from Supabase with server-side pagination ---
  const fetchSimiles = async () => {
    setLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('wisdom')
        .select('*', { count: 'exact' })
        .eq('type', 'simile');

      if (activeSubcategory !== 'all') {
        query = query.eq('subcategory', activeSubcategory);
      }

      if (searchTerm) {
        query = query.ilike('text', `%${searchTerm}%`);
      }

      const from = (currentPage - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      const { data, error, count } = await query.range(from, to);

      if (error) throw error;
      setSimiles(data || []);
      setTotalCount(count || 0);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch similes');
    } finally {
      setLoading(false);
    }
  };

  // --- Fetch similes when page, category, or search changes ---
  useEffect(() => {
    fetchSimiles();
  }, [currentPage, activeSubcategory, searchTerm]);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="font-wisdom text-5xl font-bold text-gray-900">Similes</h1>
            <DownloadButton category="similes" />
          </div>
          <p className="text-lg text-center text-muted-foreground mb-6">
            Comparative phrases that use "like" or "as" to create vivid descriptions and imagery.
          </p>

          {/* Search */}
          <div className="w-full max-w-md mx-auto mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search any simile..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 bg-card border-border"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-center">Categories</h3>
            <div className="flex flex-wrap gap-2 justify-center">
              <Button
                variant={activeSubcategory === 'all' ? 'wisdom' : 'outline'}
                size="sm"
                onClick={() => setActiveSubcategory('all')}
              >
                All Similes
                <Badge variant="secondary" className="ml-2">
                  {totalCount}
                </Badge>
              </Button>
              {subcategories.map((subcategory) => (
                <Button
                  key={subcategory}
                  variant={activeSubcategory === subcategory ? 'wisdom' : 'outline'}
                  size="sm"
                  onClick={() => setActiveSubcategory(subcategory)}
                >
                  {subcategory}
                  <Badge variant="secondary" className="ml-2">
                    {/* Optionally, you can show count per subcategory using a separate query */}
                  </Badge>
                </Button>
              ))}
            </div>
          </div>

          {/* AI Assistant */}
          <AIAssistant category="Similes" />
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-muted h-64 rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : similes.length > 0 ? (
          <>
            <div className="text-center mb-8">
              <h2 className="font-bold font-wisdom text-4xl mb-2">
                {activeSubcategory === 'all' ? 'All Similes' : `${activeSubcategory} Similes`}
              </h2>
              <p className="text-muted-foreground">{totalCount} similes found{searchTerm && ` for "${searchTerm}"`}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {similes.map((item) => (
                <WisdomCard key={item.id} item={item} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex flex-col items-center space-y-4">
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
          </>
        ) : (
          <div className="text-center py-16">
            <Zap className="h-16 w-16 text-muted-foreground mx-auto" />
            <h3 className="text-xl font-semibold">No Similes Found</h3>
            <p className="text-muted-foreground">
              {searchTerm || activeSubcategory !== 'all'
                ? 'No results found. Try a different keyword or category.'
                : 'No similes available yet.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Similes;
