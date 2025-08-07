import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { WisdomCard } from '@/components/WisdomCard';
import { useWisdomData } from '@/hooks/useWisdomData';
import { Search, Quote } from 'lucide-react';

const Quotes = () => {
  const { items, loading, error } = useWisdomData();
  const [searchTerm, setSearchTerm] = useState('');

  const quotes = items.filter(item => item.type === 'quote');
  const filteredQuotes = quotes.filter(item =>
    item.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.subcategory.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-4">Error Loading Quotes</h1>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold font-wisdom text-foreground mb-4">Quotes</h1>
          <p className="text-muted-foreground text-lg mb-6">
            Inspiring words from notable figures and thinkers
          </p>
          
          <div className="max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search quotes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-card border-border"
              />
            </div>
          </div>
        </div>

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
              <p className="text-muted-foreground">
                {filteredQuotes.length} {filteredQuotes.length === 1 ? 'quote' : 'quotes'} found
                {searchTerm && ` for "${searchTerm}"`}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredQuotes.map((item) => (
                <WisdomCard key={item.id} item={item} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto space-y-4">
              <Quote className="h-16 w-16 text-muted-foreground mx-auto" />
              <h3 className="text-xl font-semibold text-foreground">No Quotes Found</h3>
              <p className="text-muted-foreground">
                {searchTerm 
                  ? `No results found for "${searchTerm}". Try a different search term.`
                  : 'No quotes available yet.'
                }
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quotes;