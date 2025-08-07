import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { WisdomCard } from '@/components/WisdomCard';
import { WisdomNavigation } from '@/components/WisdomNavigation';
import { SettingsMenu } from '@/components/SettingsMenu';
import { useWisdomData } from '@/hooks/useWisdomData';
import { Search, BookOpen, Heart, Globe, Sparkles } from 'lucide-react';
import heroImage from '@/assets/wisdom-hero.jpg';

const Index = () => {
  const { items, loading, error, filteredItems, getCounts } = useWisdomData();
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const displayItems = filteredItems(activeFilter).filter(item =>
    item.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.subcategory.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-4">Error Loading Content</h1>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero text-primary-foreground">
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Wisdom Empire - Cultural Knowledge Hub" 
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        
        <div className="relative container mx-auto px-4 py-24 lg:py-32">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-7xl font-bold font-wisdom tracking-tight">
                Wisdom Empire
              </h1>
              <p className="text-xl lg:text-2xl font-cultural opacity-90 max-w-2xl mx-auto">
                Discover timeless wisdom through proverbs, quotes, idioms, and similes from cultures around the world
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center gap-2 bg-primary-foreground/10 rounded-full px-4 py-2">
                <Globe className="h-4 w-4" />
                <span>Global Cultures</span>
              </div>
              <div className="flex items-center gap-2 bg-primary-foreground/10 rounded-full px-4 py-2">
                <BookOpen className="h-4 w-4" />
                <span>Educational Content</span>
              </div>
              <div className="flex items-center gap-2 bg-primary-foreground/10 rounded-full px-4 py-2">
                <Heart className="h-4 w-4" />
                <span>Cultural Heritage</span>
              </div>
              <div className="flex items-center gap-2 bg-primary-foreground/10 rounded-full px-4 py-2">
                <Sparkles className="h-4 w-4" />
                <span>Audio & Video</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <Button variant="hero" size="lg" className="flex-1">
                Explore Wisdom
              </Button>
              <Button variant="cultural" size="lg" className="flex-1">
                Browse Categories
              </Button>
            </div>
            
            <div className="absolute top-4 right-4">
              <SettingsMenu />
            </div>
          </div>
        </div>
      </section>

      {/* Navigation & Search */}
      <section className="container mx-auto px-4 py-12">
        <div className="space-y-8">
          <WisdomNavigation 
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            counts={getCounts()}
          />
          
          <div className="max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search wisdom by text, origin, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-card border-border"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Content Grid */}
      <section className="container mx-auto px-4 pb-16">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-muted h-64 rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : displayItems.length > 0 ? (
          <>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold font-wisdom text-foreground mb-2">
                {activeFilter === 'all' ? 'All Wisdom' : `${activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)}`}
              </h2>
              <p className="text-muted-foreground">
                {displayItems.length} {displayItems.length === 1 ? 'item' : 'items'} found
                {searchTerm && ` for "${searchTerm}"`}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayItems.map((item) => (
                <WisdomCard key={item.id} item={item} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto space-y-4">
              <BookOpen className="h-16 w-16 text-muted-foreground mx-auto" />
              <h3 className="text-xl font-semibold text-foreground">No Wisdom Found</h3>
              <p className="text-muted-foreground">
                {searchTerm 
                  ? `No results found for "${searchTerm}". Try a different search term.`
                  : 'No content available in this category yet.'
                }
              </p>
              {searchTerm && (
                <Button variant="outline" onClick={() => setSearchTerm('')}>
                  Clear Search
                </Button>
              )}
            </div>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-wisdom-blue text-primary-foreground py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold font-wisdom">Wisdom Empire</h3>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto">
              Preserving and sharing the collective wisdom of humanity through educational content 
              that bridges cultures and generations.
            </p>
            <div className="flex justify-center space-x-6 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-wisdom-gold">{getCounts().proverbs}</div>
                <div className="text-sm text-primary-foreground/70">Proverbs</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-wisdom-gold">{getCounts().quotes}</div>
                <div className="text-sm text-primary-foreground/70">Quotes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-wisdom-gold">{getCounts().idioms}</div>
                <div className="text-sm text-primary-foreground/70">Idioms</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-wisdom-gold">{getCounts().similes}</div>
                <div className="text-sm text-primary-foreground/70">Similes</div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;