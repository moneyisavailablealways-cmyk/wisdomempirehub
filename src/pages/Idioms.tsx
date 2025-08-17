import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { WisdomCard } from '@/components/WisdomCard';
import { AIAssistant } from '@/components/AIAssistant';
import { DownloadButton } from '@/components/DownloadButton';
import { useWisdomData } from '@/hooks/useWisdomData';
import { Search, MessageSquare } from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

const subcategories = [
  'Success',
  'Relationship',
  'Emotions',
  'Work',
  'Time',
  'Friendship',
  'Life',
];

const Idioms = () => {
  const { items, loading, error } = useWisdomData();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSubcategory, setActiveSubcategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const idioms = items.filter((item) => item.type === 'idiom');

  const filteredIdioms = idioms
    .filter((item) => {
      const matchesCategory =
        activeSubcategory === 'all' ||
        item.subcategory?.toLowerCase() === activeSubcategory.toLowerCase();
      return matchesCategory;
    })
    .filter((item) => {
      if (!searchTerm) return true;
      const lowerSearch = searchTerm.toLowerCase();
      return (
        item.text.toLowerCase().includes(lowerSearch) ||
        item.origin.toLowerCase().includes(lowerSearch) ||
        item.subcategory?.toLowerCase().includes(lowerSearch)
      );
    })
    .sort((a, b) => a.id.localeCompare(b.id));

  const totalPages = Math.ceil(filteredIdioms.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentIdioms = filteredIdioms.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeSubcategory]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-4">
            Error Loading Idioms
          </h1>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="font-bold font-wisdom text-zinc-900 text-5xl text-center">
              Idioms
            </h1>
            <DownloadButton category="idioms" />
          </div>
          <p className="text-lg mb-6 text-center text-muted-foreground">
            Cultural expressions with meanings that differ from literal interpretation
          </p>

          {/* Search */}
          <div className="w-full max-w-md mx-auto mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search idioms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 bg-card border-border"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-center text-zinc-800">
              Categories
            </h3>
            <div className="flex flex-wrap gap-2 justify-center">
              <Button
                variant={activeSubcategory === 'all' ? 'wisdom' : 'outline'}
                size="sm"
                onClick={() => setActiveSubcategory('all')}
              >
                All Idioms
                <Badge variant="secondary" className="ml-2">
                  {idioms.length}
                </Badge>
              </Button>
              {subcategories.map((subcategory) => {
                const count = idioms.filter(
                  (item) => item.subcategory?.toLowerCase() === subcategory.toLowerCase()
                ).length;
                return (
                  <Button
                    key={subcategory}
                    variant={activeSubcategory === subcategory ? 'wisdom' : 'outline'}
                    size="sm"
                    onClick={() => setActiveSubcategory(subcategory)}
                  >
                    {subcategory}
                    <Badge variant="secondary" className="ml-2">
                      {count}
                    </Badge>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* AI Assistant */}
          <AIAssistant category="Idioms" />
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
        ) : filteredIdioms.length > 0 ? (
          <>
            {/* Results Header */}
            <div className="text-center mb-8">
              <h2 className="font-bold font-wisdom mb-2 text-zinc-900 text-3xl">
                {activeSubcategory === 'all' ? 'All Idioms' : `${activeSubcategory} Idioms`}
              </h2>
              <p className="text-muted-foreground">
                {filteredIdioms.length} {filteredIdioms.length === 1 ? 'idiom' : 'idioms'} found
                {searchTerm && ` for "${searchTerm}"`}
              </p>
            </div>

            {/* Idioms Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentIdioms.map((item) => (
                <WisdomCard key={item.id} item={item} />
              ))}
            </div>

            {/* Prev / Next Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center gap-4">
                <Button
                  variant="outline"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                >
                  Previous
                </Button>
                <span className="text-muted-foreground flex items-center">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        ) : (
          // Empty state
          <div className="text-center py-16">
            <div className="max-w-md mx-auto space-y-4">
              <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto" />
              <h3 className="text-xl font-semibold text-foreground">No Idioms Found</h3>
              <p className="text-muted-foreground">
                {searchTerm || activeSubcategory !== 'all'
                  ? `No results found. Try a different keyword or category.`
                  : 'No idioms available yet.'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Idioms;
