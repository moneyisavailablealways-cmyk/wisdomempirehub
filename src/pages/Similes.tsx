import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { WisdomCard } from '@/components/WisdomCard';
import { AIAssistant } from '@/components/AIAssistant';
import { useWisdomData } from '@/hooks/useWisdomData';
import { Search, Zap } from 'lucide-react';
const subcategories = ['Emotion'];
const Similes = () => {
  const {
    items,
    loading,
    error
  } = useWisdomData();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSubcategory, setActiveSubcategory] = useState('all');
  const similes = items.filter(item => item.type === 'simile');
  const filteredSimiles = similes.filter(item => {
    const matchesSearch = item.text.toLowerCase().includes(searchTerm.toLowerCase()) || item.origin.toLowerCase().includes(searchTerm.toLowerCase()) || item.subcategory.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubcategory = activeSubcategory === 'all' || item.subcategory.toLowerCase() === activeSubcategory.toLowerCase();
    return matchesSearch && matchesSubcategory;
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
      <div className="container mx-auto px-4 py-8 bg-zinc-200">
        <div className="mb-8">
          <h1 className="font-wisdom mb-4 text-gray-950 font-bold text-5xl text-center">Similes</h1>
          <p className="text-lg mb-6 text-gray-900 text-center">
            Comparative phrases that use "like" or "as" to create vivid descriptions
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
            <h3 className="text-lg font-semibold mb-3 text-zinc-950 text-center">Categories</h3>
            <div className="flex flex-wrap gap-2">
              <Button variant={activeSubcategory === 'all' ? 'wisdom' : 'outline'} size="sm" onClick={() => setActiveSubcategory('all')}>
                All Similes
                <Badge variant="secondary" className="ml-2">
                  {similes.length}
                </Badge>
              </Button>
              {subcategories.map(subcategory => {
              const count = similes.filter(item => item.subcategory.toLowerCase() === subcategory.toLowerCase()).length;
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
          <AIAssistant category="Similes" />
        </div>

        {loading ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <div key={i} className="animate-pulse">
                <div className="bg-muted h-64 rounded-lg"></div>
              </div>)}
          </div> : filteredSimiles.length > 0 ? <>
            <div className="text-center mb-8">
              <h2 className="font-bold font-wisdom mb-2 text-zinc-950 text-4xl">
                {activeSubcategory === 'all' ? 'All Similes' : `${activeSubcategory} Similes`}
              </h2>
              <p className="text-gray-950">
                {filteredSimiles.length} {filteredSimiles.length === 1 ? 'simile' : 'similes'} found
                {searchTerm && ` for "${searchTerm}"`}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSimiles.map(item => <WisdomCard key={item.id} item={item} />)}
            </div>
          </> : <div className="text-center py-16">
            <div className="max-w-md mx-auto space-y-4">
              <Zap className="h-16 w-16 text-muted-foreground mx-auto" />
              <h3 className="text-xl font-semibold text-foreground">No Similes Found</h3>
              <p className="text-muted-foreground">
                {searchTerm ? `No results found for "${searchTerm}". Try a different search term.` : 'No similes available yet.'}
              </p>
            </div>
          </div>}
      </div>
    </div>;
};
export default Similes;