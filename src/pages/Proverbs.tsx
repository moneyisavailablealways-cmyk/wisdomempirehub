import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { WisdomCard } from '@/components/WisdomCard';
import { AIAssistant } from '@/components/AIAssistant';
import { useWisdomData } from '@/hooks/useWisdomData';
import { Search, BookOpen } from 'lucide-react';
const subcategories = ['Success', 'Time', 'Love', 'Money', 'Wisdom', 'Fear', 'Trust', 'Friendship'];
const Proverbs = () => {
  const {
    items,
    loading,
    error
  } = useWisdomData();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSubcategory, setActiveSubcategory] = useState('all');
  const proverbs = items.filter(item => item.type === 'proverb');
  const filteredProverbs = proverbs.filter(item => {
    const matchesSearch = item.text.toLowerCase().includes(searchTerm.toLowerCase()) || item.origin.toLowerCase().includes(searchTerm.toLowerCase()) || item.subcategory.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubcategory = activeSubcategory === 'all' || item.subcategory.toLowerCase() === activeSubcategory.toLowerCase();
    return matchesSearch && matchesSubcategory;
  });
  if (error) {
    return <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-4">Error Loading Proverbs</h1>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 bg-gray-200">
        <div className="mb-8 bg-gray-800">
          <h1 className="text-4xl font-bold font-wisdom text-foreground mb-4">Proverbs</h1>
          <p className="text-muted-foreground text-lg mb-6">
            Traditional sayings that convey wisdom through generations
          </p>
          
          {/* Search Bar */}
          <div className="max-w-md mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search any proverb, idiom, quote, or simile..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10 bg-card border-border" />
            </div>
          </div>

          {/* Subcategory Navigation */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Categories</h3>
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
              <h2 className="text-2xl font-bold font-wisdom text-foreground mb-2">
                {activeSubcategory === 'all' ? 'All Proverbs' : `${activeSubcategory} Proverbs`}
              </h2>
              <p className="text-muted-foreground">
                {filteredProverbs.length} {filteredProverbs.length === 1 ? 'proverb' : 'proverbs'} found
                {searchTerm && ` for "${searchTerm}"`}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProverbs.map(item => <WisdomCard key={item.id} item={item} />)}
            </div>
          </> : <div className="text-center py-16">
            <div className="max-w-md mx-auto space-y-4">
              <BookOpen className="h-16 w-16 text-muted-foreground mx-auto" />
              <h3 className="text-xl font-semibold text-foreground">No Proverbs Found</h3>
              <p className="text-muted-foreground">
                {searchTerm ? `No results found for "${searchTerm}". Try a different search term.` : 'No proverbs available yet.'}
              </p>
            </div>
          </div>}
      </div>
    </div>;
};
export default Proverbs;