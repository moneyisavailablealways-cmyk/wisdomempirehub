import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { WisdomCard } from '@/components/WisdomCard';
import { AIAssistant } from '@/components/AIAssistant';
import { DownloadButton } from '@/components/DownloadButton';
import { useWisdomData } from '@/hooks/useWisdomData';
import { Search, Quote } from 'lucide-react';

const subcategories = ['Life Advice', 'Daily Motivation', 'Work & Business', 'Famous People'];

const Quotes = () => {
  const { items, loading, error } = useWisdomData();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSubcategory, setActiveSubcategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const quotes = items.filter((item) => item.type === 'quote');

  const filteredQuotes = quotes
    .filter((item) => {
      const sub = item.subcategory?.toLowerCase() || '';
      return activeSubcategory === 'all' || sub === activeSubcategory.toLowerCase();
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

  const totalPages = Math.ceil(filteredQuotes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentQuotes = filteredQuotes.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeSubcategory]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-4">
            Error Loading Quotes
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
            <h1 className="text-4xl font-wisdom font-extrabold text-slate-950 text-center">
              Quotes
            </h1>
            <DownloadButton category="quotes" />
          </div>
          <p className="text-lg mb-6 text-center text-slate-300">
            Inspiring words from notable figures and thinkers
          </p>

          {/* Search */}
          <div className="w-full max-w-md mb-6 mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search any quote..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 bg-card border-border"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-center text-zinc-50">
              Categories
            </h3>
            <div className="flex flex-wrap gap-2 justify-center">
              <Button
                variant={activeSubcategory === 'all' ? 'wisdom' : 'outline'}
                size="sm"
                onClick={() => setActiveSubcategory('all')}
              >
                All Quotes
                <Badge variant="secondary" className="ml-2">
                  {quotes.length}
                </Badge>
              </Button>
              {subcategories.map((subcategory) => {
                const count = quotes.filter(
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
                    <Badge variant="secondary" className="ml-2">{count}</Badge>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* AI Assistant */}
          <AIAssistant category="Quotes" />
        </div>

        {/* Quotes Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-muted h-64 rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : filteredQuotes.length > 0 ? (
          <>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold font-wisdom mb-2 text-zinc-950">
                {activeSubcategory === 'all'
                  ? 'All Quotes'
                  : `${activeSubcategory} Quotes`}
              </h2>
              <p className="text-muted-foreground">
                {filteredQuotes.length} {filteredQuotes.length === 1 ? 'quote' : 'quotes'} found
                {searchTerm && ` for "${searchTerm}"`}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentQuotes.map((item) => (
                <WisdomCard key={item.id} item={item} />
              ))}
            </div>

            {/* Prev / Next Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center gap-4 items-center">
                <Button
                  variant="outline"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                >
                  Previous
                </Button>
                <span className="text-muted-foreground">
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
          <div className="text-center py-16">
            <Quote className="h-16 w-16 text-muted-foreground mx-auto" />
            <h3 className="text-xl font-semibold">No Quotes Found</h3>
            <p className="text-muted-foreground">
              {searchTerm || activeSubcategory !== 'all'
                ? 'No results found. Try a different keyword or category.'
                : 'No quotes available yet.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quotes;
v