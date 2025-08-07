import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { WisdomCard } from '@/components/WisdomCard';
import { useWisdomData } from '@/hooks/useWisdomData';
import { Search, Zap } from 'lucide-react';

const Similes = () => {
  const { items, loading, error } = useWisdomData();
  const [searchTerm, setSearchTerm] = useState('');

  const similes = items.filter(item => item.type === 'simile');
  const filteredSimiles = similes.filter(item =>
    item.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.subcategory.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-4">Error Loading Similes</h1>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold font-wisdom text-foreground mb-4">Similes</h1>
          <p className="text-muted-foreground text-lg mb-6">
            Comparative phrases that use "like" or "as" to create vivid descriptions
          </p>
          
          <div className="max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search similes..."
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
        ) : filteredSimiles.length > 0 ? (
          <>
            <div className="text-center mb-8">
              <p className="text-muted-foreground">
                {filteredSimiles.length} {filteredSimiles.length === 1 ? 'simile' : 'similes'} found
                {searchTerm && ` for "${searchTerm}"`}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSimiles.map((item) => (
                <WisdomCard key={item.id} item={item} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto space-y-4">
              <Zap className="h-16 w-16 text-muted-foreground mx-auto" />
              <h3 className="text-xl font-semibold text-foreground">No Similes Found</h3>
              <p className="text-muted-foreground">
                {searchTerm 
                  ? `No results found for "${searchTerm}". Try a different search term.`
                  : 'No similes available yet.'
                }
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Similes;