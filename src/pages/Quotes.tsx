import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { WisdomCard } from '@/components/WisdomCard';
import { AIAssistant } from '@/components/AIAssistant';
import { useWisdomData } from '@/hooks/useWisdomData';
import { Search, Quote } from 'lucide-react';
const subcategories = ['Life Advice', 'Motivation', 'Work & Business', 'Famous People'];
const Quotes = () => {
  const {
    items,
    loading,
    error
  } = useWisdomData();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSubcategory, setActiveSubcategory] = useState('all');
  const quotes = items.filter(item => item.type === 'quote');
  const filteredQuotes = quotes.filter(item => {
    const matchesSearch = item.text.toLowerCase().includes(searchTerm.toLowerCase()) || item.origin.toLowerCase().includes(searchTerm.toLowerCase()) || item.subcategory.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubcategory = activeSubcategory === 'all' || item.subcategory.toLowerCase() === activeSubcategory.toLowerCase();
    return matchesSearch && matchesSubcategory;
  });
  if (error) {
    return <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-4">Error Loading Quotes</h1>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 bg-slate-500">
        <div className="mb-8">
          <h1 className="text-4xl font-wisdom mb-4 text-center font-extrabold text-slate-950">Quotes</h1>
          <p className="text-lg mb-6 text-center text-slate-300">
            Inspiring words from notable figures and thinkers
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
                All Quotes
                <Badge variant="secondary" className="ml-2">
                  {quotes.length}
                </Badge>
              </Button>
              {subcategories.map(subcategory => {
              const count = quotes.filter(item => item.subcategory.toLowerCase() === subcategory.toLowerCase()).length;
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
          <AIAssistant category="Quotes" />
        </div>

        {loading ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <div key={i} className="animate-pulse">
                <div className="bg-muted h-64 rounded-lg"></div>
              </div>)}
          </div> : filteredQuotes.length > 0 ? <>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold font-wisdom mb-2 text-zinc-950">
                {activeSubcategory === 'all' ? 'All Quotes' : `${activeSubcategory} Quotes`}
              </h2>
              <p className="text-muted-foreground">
                {filteredQuotes.length} {filteredQuotes.length === 1 ? 'quote' : 'quotes'} found
                {searchTerm && ` for "${searchTerm}"`}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredQuotes.map(item => <WisdomCard key={item.id} item={item} />)}
            </div>
          </> : <div className="text-center py-16">
            <div className="max-w-md mx-auto space-y-4">
              <Quote className="h-16 w-16 text-muted-foreground mx-auto" />
              <h3 className="text-xl font-semibold text-foreground">No Quotes Found</h3>
              <p className="text-muted-foreground">
                {searchTerm ? `No results found for "${searchTerm}". Try a different search term.` : 'No quotes available yet.'}
              </p>
            </div>
          </div>}
      </div>
    </div>;
};
export default Quotes;