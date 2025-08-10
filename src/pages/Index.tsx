import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WisdomCard } from '@/components/WisdomCard';
import { useWisdomData } from '@/hooks/useWisdomData';
import { Search, BookOpen, Quote, MessageSquare, Zap, TrendingUp, Clock, Star } from 'lucide-react';
import heroImage from '@/assets/wisdom-hero.jpg';
const Index = () => {
  const {
    items,
    loading,
    error
  } = useWisdomData();
  const [searchTerm, setSearchTerm] = useState('');

  // Get daily items (using a simple hash based on date)
  const today = new Date().toDateString();
  const dateHash = today.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  const proverbs = items.filter(item => item.type === 'proverb');
  const quotes = items.filter(item => item.type === 'quote');
  const idioms = items.filter(item => item.type === 'idiom');
  const similes = items.filter(item => item.type === 'simile');
  const proverbOfDay = proverbs[dateHash % proverbs.length];
  const quoteOfDay = quotes[(dateHash + 1) % quotes.length];
  const idiomOfDay = idioms[(dateHash + 2) % idioms.length];

  // Most viewed (simulate with reverse chronological order)
  const mostViewed = [...items].reverse().slice(0, 6);

  // Recently added (latest items)
  const recentlyAdded = [...items].slice(-6);
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // For now, we'll filter and show results here
      // In a real app, this would navigate to a search results page
    }
  };
  if (error) {
    return <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-4">Error Loading Content</h1>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero text-primary-foreground py-16">
        <div className="absolute inset-0">
          <img src={heroImage} alt="Wisdom Empire - Cultural Knowledge Hub" className="w-full h-full object-cover opacity-20" />
        </div>
        
        <div className="relative container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold font-wisdom tracking-tight">
                Wisdom Empire
              </h1>
              <p className="text-lg lg:text-xl font-cultural opacity-90 max-w-2xl mx-auto">
                Discover timeless wisdom from cultures around the world
              </p>
            </div>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="w-full max-w-2xl mx-auto px-4 sm:px-0">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input placeholder="Search any proverb, quote, idiom, simile..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-12 h-14 text-base sm:text-lg backdrop-blur border-2 border-primary-foreground/20 focus:border-wisdom-gold bg-green-50" />
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Daily Content Sections */}
      <section className="container mx-auto px-4 py-12">
        <div className="space-y-12 bg-slate-600">
          
          {/* Daily Items */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Proverb of the Day */}
            {proverbOfDay && <Card className="border-wisdom-blue/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-wisdom-blue bg-zinc-300">
                    <BookOpen className="h-5 w-5" />
                    Proverb of the Day
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <WisdomCard item={proverbOfDay} />
                </CardContent>
              </Card>}

            {/* Quote of the Day */}
            {quoteOfDay && <Card className="border-wisdom-gold/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-wisdom-gold">
                    <Quote className="h-5 w-5" />
                    Quote of the Day
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <WisdomCard item={quoteOfDay} />
                </CardContent>
              </Card>}

            {/* Idiom of the Day */}
            {idiomOfDay && <Card className="border-wisdom-cultural/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-wisdom-cultural">
                    <MessageSquare className="h-5 w-5" />
                    Idiom of the Day
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <WisdomCard item={idiomOfDay} />
                </CardContent>
              </Card>}
          </div>

          {/* Most Viewed Section */}
          {mostViewed.length > 0 && <div>
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="h-6 w-6 text-wisdom-blue" />
                <h2 className="text-2xl font-bold font-wisdom text-foreground">Most Viewed</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mostViewed.map(item => <WisdomCard key={item.id} item={item} />)}
              </div>
            </div>}

          {/* Recently Added Section */}
          {recentlyAdded.length > 0 && <div>
              <div className="flex items-center gap-2 mb-6">
                <Clock className="h-6 w-6 text-wisdom-gold" />
                <h2 className="text-2xl font-bold font-wisdom text-foreground">Recently Added</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentlyAdded.map(item => <WisdomCard key={item.id} item={item} />)}
              </div>
            </div>}

          {/* Quick Navigation */}
          <Card className="bg-gradient-to-r from-wisdom-blue/5 to-wisdom-gold/5 border-wisdom-gold/20">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold font-wisdom text-center mb-6">Explore by Category</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="outline" className="h-20 flex-col gap-2" asChild>
                  <a href="/proverbs">
                    <BookOpen className="h-6 w-6" />
                    <span>Proverbs</span>
                    <span className="text-xs text-muted-foreground">{proverbs.length} items</span>
                  </a>
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2" asChild>
                  <a href="/quotes">
                    <Quote className="h-6 w-6" />
                    <span>Quotes</span>
                    <span className="text-xs text-muted-foreground">{quotes.length} items</span>
                  </a>
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2" asChild>
                  <a href="/idioms">
                    <MessageSquare className="h-6 w-6" />
                    <span>Idioms</span>
                    <span className="text-xs text-muted-foreground">{idioms.length} items</span>
                  </a>
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2" asChild>
                  <a href="/similes">
                    <Zap className="h-6 w-6" />
                    <span>Similes</span>
                    <span className="text-xs text-muted-foreground">{similes.length} items</span>
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>;
};
export default Index;