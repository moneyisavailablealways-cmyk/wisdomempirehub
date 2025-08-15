import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { WisdomCard } from '@/components/WisdomCard';
import { AIAssistant } from '@/components/AIAssistant';
import { DownloadButton } from '@/components/DownloadButton';
import { useWisdomData } from '@/hooks/useWisdomData';
import { Search, Zap } from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
const predefinedCategories = ['animals', 'nature', 'emotions', 'people', 'behavior', 'appearance'];

const Similes = () => {
  const {
    items,
    loading,
    error
  } = useWisdomData();
  const [searchTerm, setSearchTerm] = useState('');

  const similes = items.filter(item => item.type === 'simile');
  
  // Group similes by predefined categories
  const groupedSimiles = predefinedCategories.reduce((acc, category) => {
    acc[category] = similes.filter(item => 
      item.subcategory.toLowerCase().includes(category.toLowerCase()) ||
      item.text.toLowerCase().includes(category.toLowerCase())
    );
    return acc;
  }, {} as Record<string, typeof similes>);

  // Apply search filter to all similes
  const filteredSimiles = similes.filter(item => {
    if (!searchTerm) return true;
    return item.text.toLowerCase().includes(searchTerm.toLowerCase()) || 
           item.origin.toLowerCase().includes(searchTerm.toLowerCase()) || 
           item.subcategory.toLowerCase().includes(searchTerm.toLowerCase());
  });
  if (error) {
    return <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-4">Error Loading Similes</h1>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 bg-slate-500">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="font-wisdom text-gray-950 font-bold text-5xl mx-[17px] text-center">Similes</h1>
            <DownloadButton category="similes" />
          </div>
          <p className="text-lg mb-6 text-center text-gray-50">Comparative phrases that use "like" or "as" to create vivid descriptions and imagery</p>
          
          {/* Search Bar */}
          <div className="w-full max-w-md mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search any proverb, idiom, quote, or simile..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 bg-card border-border" />
            </div>
          </div>

          {/* Search Results Summary */}
          {searchTerm && (
            <div className="mb-6 text-center">
              <p className="text-zinc-50">
                Found {filteredSimiles.length} similes matching "{searchTerm}"
              </p>
            </div>
          )}

          {/* AI Assistant */}
          <AIAssistant category="Similes" />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-muted h-64 rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : searchTerm ? (
          // Show search results
          filteredSimiles.length > 0 ? (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="font-bold font-wisdom mb-2 text-zinc-950 text-4xl">
                  Search Results
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSimiles.map(item => (
                  <WisdomCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto space-y-4">
                <Zap className="h-16 w-16 text-muted-foreground mx-auto" />
                <h3 className="text-xl font-semibold text-foreground">No Similes Found</h3>
                <p className="text-muted-foreground">
                  No results found for "{searchTerm}". Try a different keyword.
                </p>
              </div>
            </div>
          )
        ) : (
          // Show grouped categories
          <div className="space-y-12">
            {predefinedCategories.map(category => {
              const categorySimiles = groupedSimiles[category];
              if (categorySimiles.length === 0) return null;
              
              return (
                <div key={category} className="space-y-6">
                  <div className="text-center">
                    <h2 className="font-bold font-wisdom mb-2 text-zinc-950 text-4xl capitalize">
                      {category} Similes
                    </h2>
                    <p className="text-gray-950">
                      {categorySimiles.length} {categorySimiles.length === 1 ? 'simile' : 'similes'}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categorySimiles.map(item => (
                      <WisdomCard key={item.id} item={item} />
                    ))}
                  </div>
                </div>
              );
            })}
            
            {similes.length === 0 && (
              <div className="text-center py-16">
                <div className="max-w-md mx-auto space-y-4">
                  <Zap className="h-16 w-16 text-muted-foreground mx-auto" />
                  <h3 className="text-xl font-semibold text-foreground">No Similes Available</h3>
                  <p className="text-muted-foreground">
                    No similes have been added yet.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>;
};
export default Similes;