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
  PaginationLink,
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

  // ✅ Only idioms
  const idioms = items.filter((item) => item.type === 'idiom');

  // ✅ Filtering logic
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

  // ✅ Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeSubcategory]);

  // ✅ Pagination
  const totalPages = Math.ceil(filteredIdioms.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentIdioms = filteredIdioms.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // ✅ Error state
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
        {/* ✅ Header */}
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

          {/* ✅ Search Bar */}
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

          {/* ✅ Category Filters */}
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
                  (item) =>
                    item.subcategory?.toLowerCase() === subcategory.toLowerCase()
                ).length;
                return (
                  <Button
                    key={subcategory}
                    variant={
                      activeSubcategory === subcategory ? 'wisdom' : 'outline'
                    }
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

          {/* ✅ AI Assistant */}
          <AIAssistant category="Idioms" />
        </div>

        {/* ✅ Content */}
        {loading ? (
          // Skeleton loading
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
                {activeSubcategory === 'all'
                  ? 'All Idioms'
                  : `${activeSubcategory} Idioms`}
              </h2>
              <p className="text-muted-foreground">
                {filteredIdioms.length}{' '}
                {filteredIdioms.length === 1 ? 'idiom' : 'idioms'} found
                {searchTerm && ` for "${searchTerm}"`}
              </p>
            </div>

            {/* Idioms Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentIdioms.map((item) => (
                <WisdomCard key={item.id} item={item} />
              ))}
            </div>

            {/* ✅ Pagination with numbers */}
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
                          if (currentPage > 1) setCurrentPage((p) => p - 1);
                        }}
                        className={
                          currentPage === 1
                            ? 'pointer-events-none opacity-50'
                            : 'cursor-pointer'
                        }
                      />
                    </PaginationItem>

                    {[...Array(totalPages)].map((_, i) => (
                      <PaginationItem key={i}>
                        <PaginationLink
                          href="#"
                          isActive={currentPage === i + 1}
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(i + 1);
                          }}
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage < totalPages) setCurrentPage((p) => p + 1);
                        }}
                        className={
                          currentPage === totalPages
                            ? 'pointer-events-none opacity-50'
                            : 'cursor-pointer'
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        ) : (
          // Empty state
          <div className="text-center py-16">
            <div className="max-w-md mx-auto space-y-4">
              <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto" />
              <h3 className="text-xl font-semibold text-foreground">
                No Idioms Found
              </h3>
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
