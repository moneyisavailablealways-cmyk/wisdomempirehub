"use client";

import React, { useState, useEffect } from 'react';
import { SEOHead } from '@/components/SEOHead';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WisdomCard } from '@/components/WisdomCard';
import { useWisdomData } from '@/hooks/useWisdomData';
import { Search, BookOpen, Quote, MessageSquare, Sparkles } from 'lucide-react';
import heroImage from '@/assets/wisdom-hero-optimized.webp';
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  const { items, loading, error } = useWisdomData();
  const [searchTerm, setSearchTerm] = useState('');
  const [totalIdioms, setTotalIdioms] = useState<number | null>(null);
  const [totalProverbs, setTotalProverbs] = useState<number | null>(null);
  const [quotesCount, setQuotesCount] = useState<number | null>(null);
  const [similesCount, setSimilesCount] = useState<number | null>(null);

  // --- Page loading for 3 seconds with spinner ---
  const [pageLoading, setPageLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setPageLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  // --- Fetch live counts from Supabase ---
  useEffect(() => {
    const fetchAllCounts = async () => {
      // Fetch all counts in parallel to reduce request chains
      const [similesResult, quotesResult, idiomsResult, proverbsResult] = await Promise.all([
        supabase.from("similes").select("*", { count: "exact", head: true }),
        supabase.from("quotes").select("*", { count: "exact", head: true }),
        supabase.from("idioms").select("*", { count: "exact", head: true }),
        supabase.from("proverbs").select("*", { count: "exact", head: true })
      ]);
      
      setSimilesCount(similesResult.count ?? 0);
      setQuotesCount(quotesResult.count ?? 0);
      setTotalIdioms(idiomsResult.count ?? 0);
      setTotalProverbs(proverbsResult.count ?? 0);
    };
    
    fetchAllCounts();
  }, []);
  // --- Daily Wisdom logic ---
  const today = new Date().toDateString();
  const dateHash = today.split('').reduce((a, b) => a + b.charCodeAt(0), 0);

  const proverbs = items.filter(item => item.type === 'proverb');
  const quotes = items.filter(item => item.type === 'quote');
  const idioms = items.filter(item => item.type === 'idiom');
  const similes = items.filter(item => item.type === 'simile');

  const proverbOfDay = proverbs[dateHash % proverbs.length];
  const quoteOfDay = quotes[(dateHash + 1) % quotes.length];
  const idiomOfDay = idioms[(dateHash + 2) % idioms.length];

  // --- Search filter ---
  const filteredItems = items.filter(item => {
    if (!searchTerm.trim()) return false;
    const searchLower = searchTerm.toLowerCase();
    return (
      item.text.toLowerCase().includes(searchLower) ||
      item.origin.toLowerCase().includes(searchLower) ||
      item.subcategory.toLowerCase().includes(searchLower)
    );
  });

  // --- Most Viewed & Recently Added ---
  const mostViewed = [...items].reverse().slice(0, 6);
  const recentlyAdded = [...items].slice(-6);

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

  // --- Show page-level loading first with spinner ---
  // --- Show page-level loading first with golden spinner ---
  if (pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          {/* Golden spinning loader */}
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
          {/* Golden text */}
          <h1 className="text-2xl font-bold text-yellow-400">Wisdom Empire</h1>
          <p className="text-yellow-300 mt-2">Loading wisdom...</p>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Wisdom Empire Hub - Cultural Knowledge & Timeless Wisdom"
        description="Discover timeless wisdom through proverbs, quotes, idioms, and similes from cultures around the world. Educational platform preserving global cultural heritage."
        keywords="proverbs, quotes, idioms, similes, cultural wisdom, education, heritage, global cultures, sayings, expressions, wisdom empire"
        canonical={typeof window !== 'undefined' ? window.location.href : ''}
        preloadImage="/src/assets/wisdom-hero-optimized.webp"
      />
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero text-primary-foreground py-16">
        <div className="absolute inset-0">
          <img src={heroImage} alt="Wisdom Empire - Cultural Knowledge Hub" className="w-full h-full object-cover opacity-20" fetchPriority="high" />
        </div>

        {/* Logo Background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <img src="/lovable-uploads/logo-optimized.webp" alt="Wisdom Empire Background Logo" className="w-96 h-96 md:w-[500px] md:h-[500px] lg:w-[600px] lg:h-[600px] object-contain opacity-20" loading="lazy" />
        </div>

        <div className="relative container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl font-wisdom tracking-tight text-white font-bold lg:text-6xl">Wisdom Empire Hub</h1>
              <p className="text-lg lg:text-xl font-cultural opacity-90 max-w-2xl mx-auto text-violet-100">
                Discover timeless wisdom from cultures around the world
              </p>
            </div>

            {/* Search Bar */}
            <div className="w-full max-w-2xl mx-auto px-4 sm:px-0">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search any proverb, quote, idiom, simile..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-12 h-14 text-base sm:text-lg backdrop-blur border-2 border-primary-foreground/20 focus:border-wisdom-gold bg-slate-100"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Results or Daily Content Sections */}
      <section className="container mx-auto px-4 py-12">
        {searchTerm.trim() ? (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold font-wisdom mb-2">Search Results</h2>
              <p className="text-muted-foreground text-lg">
                {filteredItems.length} {filteredItems.length === 1 ? 'result' : 'results'} found for "{searchTerm}"
              </p>
            </div>

            {filteredItems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map(item => <WisdomCard key={item.id} item={item} />)}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="max-w-md mx-auto space-y-4">
                  <Search className="h-16 w-16 text-muted-foreground mx-auto" />
                  <h3 className="text-xl font-semibold">No Results Found</h3>
                  <p className="text-muted-foreground">Try different keywords or browse our categories below.</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-12 bg-slate-600">
            {/* Daily Items */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {proverbOfDay && <Card className="border-wisdom-blue/20 bg-gray-900">
                <CardHeader className="bg-zinc-300">
                  <CardTitle className="flex items-center gap-2 bg-zinc-300 text-gray-950">
                    <BookOpen className="h-5 w-5" />
                    Proverb of the Day
                  </CardTitle>
                </CardHeader>
                <CardContent className="bg-slate-900 rounded-xl">
                  <WisdomCard item={proverbOfDay} />
                </CardContent>
              </Card>}

              {quoteOfDay && <Card className="border-wisdom-gold/20 bg-gray-900">
                <CardHeader className="bg-slate-100">
                  <CardTitle className="flex items-center gap-2 text-zinc-950">
                    <Quote className="h-5 w-5" />
                    Quote of the Day
                  </CardTitle>
                </CardHeader>
                <CardContent className="bg-slate-900 rounded-xl">
                  <WisdomCard item={quoteOfDay} />
                </CardContent>
              </Card>}

              {idiomOfDay && <Card className="border-wisdom-cultural/20 bg-gray-900">
                <CardHeader className="bg-white">
                  <CardTitle className="flex items-center gap-2 text-zinc-950">
                    <MessageSquare className="h-5 w-5" />
                    Idiom of the Day
                  </CardTitle>
                </CardHeader>
                <CardContent className="bg-slate-950">
                  <WisdomCard item={idiomOfDay} />
                </CardContent>
              </Card>}
            </div>

            {/* Most Viewed */}
            <div className="max-w-6xl mx-auto px-4 py-12">
              <h2 className="text-2xl font-bold mb-6 text-center">Most Viewed</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {mostViewed.map((item) => (
                  <WisdomCard key={item.id} item={item} />
                ))}
              </div>
            </div>

            {/* Recently Added */}
            <div className="max-w-6xl mx-auto px-4 py-12">
              <h2 className="text-2xl font-bold mb-6 text-center">Recently Added</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {recentlyAdded.map((item) => (
                  <WisdomCard key={item.id} item={item} />
                ))}
              </div>
            </div>

            {/* --- Explore by Category (moved below Recently Added) --- */}
            <Card className="bg-gradient-to-r from-wisdom-blue/5 to-wisdom-gold/5 border-wisdom-gold/20 max-w-6xl mx-auto px-4 py-12">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold font-wisdom text-center mb-6">Explore by Category</h3>
                <div className="grid md:grid-cols-4 gap-4">
                  <Button variant="outline" className="h-20 flex-col gap-2" asChild>
                    <a href="/proverbs">
                      <BookOpen className="h-6 w-6" />
                      <span>Proverbs</span>
                      <span className="text-xs text-muted-foreground">{totalProverbs ?? "Loading..."} items</span>
                    </a>
                  </Button>

                  <Button variant="outline" className="h-20 flex-col gap-2" asChild>
                    <a href="/quotes">
                      <Quote className="h-6 w-6" />
                      <span>Quotes</span>
                      <span className="text-xs text-muted-foreground">{quotesCount ?? "Loading..."} items</span>
                    </a>
                  </Button>

                  <Button variant="outline" className="h-20 flex-col gap-2" asChild>
                    <a href="/idioms">
                      <MessageSquare className="h-6 w-6" />
                      <span>Idioms</span>
                      <span className="text-xs text-muted-foreground">{totalIdioms ?? "Loading..."} items</span>
                    </a>
                  </Button>

                  <Button variant="outline" className="h-20 flex-col gap-2" asChild>
                    <a href="/similes">
                      <Sparkles className="h-6 w-6" />
                      <span>Similes</span>
                      <span className="text-xs text-muted-foreground">{similesCount ?? "Loading..."} items</span>
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>

          </div>
        )}
      </section>
    </div>
  );
};

export default Index;
