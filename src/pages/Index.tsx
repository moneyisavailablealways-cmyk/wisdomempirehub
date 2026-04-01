"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { SEOHead } from '@/components/SEOHead';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WisdomCard } from '@/components/WisdomCard';
import { WisdomCardSkeleton } from '@/components/WisdomCardSkeleton';
import { supabase } from '@/integrations/supabase/client';
import { Search, BookOpen, Quote, MessageSquare, Sparkles } from 'lucide-react';
import heroImage from '@/assets/wisdom-hero-responsive.webp';

const SELECT_FIELDS = 'id,type,subcategory,text,origin,created_at,video_url,audio_voice_type';

interface WisdomItem {
  id: string;
  type: 'proverb' | 'quote' | 'idiom' | 'simile';
  subcategory: string;
  text: string;
  origin: string;
  created_at: string;
  video_url?: string;
  audio_voice_type?: 'child' | 'youth' | 'old';
}

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [counts, setCounts] = useState({ proverbs: 0, quotes: 0, idioms: 0, similes: 0 });
  const [dailyItems, setDailyItems] = useState<WisdomItem[]>([]);
  const [recentItems, setRecentItems] = useState<WisdomItem[]>([]);
  const [searchResults, setSearchResults] = useState<WisdomItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);

  const debounceTimer = React.useRef<ReturnType<typeof setTimeout>>();
  const handleSearchChange = React.useCallback((value: string) => {
    setSearchTerm(value);
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => setDebouncedSearch(value), 300);
  }, []);

  // Fetch counts + a small sample for daily wisdom (lightweight)
  useEffect(() => {
    const fetchInitial = async () => {
      setLoading(true);
      const [
        { count: pc },
        { count: qc },
        { count: ic },
        { count: sc },
        { data: recentProverbs },
        { data: recentQuotes },
        { data: recentIdioms },
        { data: recentSimiles },
      ] = await Promise.all([
        supabase.from('proverbs').select('id', { count: 'exact', head: true }),
        supabase.from('quotes').select('id', { count: 'exact', head: true }),
        supabase.from('idioms').select('id', { count: 'exact', head: true }),
        supabase.from('similes').select('id', { count: 'exact', head: true }),
        supabase.from('proverbs').select(SELECT_FIELDS).order('created_at', { ascending: false }).limit(3),
        supabase.from('quotes').select(SELECT_FIELDS).order('created_at', { ascending: false }).limit(3),
        supabase.from('idioms').select(SELECT_FIELDS).order('created_at', { ascending: false }).limit(3),
        supabase.from('similes').select(SELECT_FIELDS).order('created_at', { ascending: false }).limit(3),
      ]);

      setCounts({
        proverbs: pc ?? 0,
        quotes: qc ?? 0,
        idioms: ic ?? 0,
        similes: sc ?? 0,
      });

      const all = [
        ...(recentProverbs || []).map(i => ({ ...i, type: 'proverb' as const })),
        ...(recentQuotes || []).map(i => ({ ...i, type: 'quote' as const })),
        ...(recentIdioms || []).map(i => ({ ...i, type: 'idiom' as const })),
        ...(recentSimiles || []).map(i => ({ ...i, type: 'simile' as const })),
      ] as WisdomItem[];

      setRecentItems(all.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 6));

      // Pick daily items deterministically
      const today = new Date().toDateString();
      const hash = today.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
      const proverbs = (recentProverbs || []) as WisdomItem[];
      const quotes = (recentQuotes || []) as WisdomItem[];
      const idioms = (recentIdioms || []) as WisdomItem[];
      
      const daily: WisdomItem[] = [];
      if (proverbs.length) daily.push({ ...proverbs[hash % proverbs.length], type: 'proverb' });
      if (quotes.length) daily.push({ ...quotes[(hash + 1) % quotes.length], type: 'quote' });
      if (idioms.length) daily.push({ ...idioms[(hash + 2) % idioms.length], type: 'idiom' });
      setDailyItems(daily);
      setLoading(false);
    };

    fetchInitial();
  }, []);

  // Search across tables
  useEffect(() => {
    if (!debouncedSearch.trim()) {
      setSearchResults([]);
      return;
    }

    const search = async () => {
      setSearching(true);
      const term = `%${debouncedSearch}%`;
      const [{ data: p }, { data: q }, { data: i }, { data: s }] = await Promise.all([
        supabase.from('proverbs').select(SELECT_FIELDS).or(`text.ilike.${term},origin.ilike.${term}`).limit(10),
        supabase.from('quotes').select(SELECT_FIELDS).or(`text.ilike.${term},origin.ilike.${term}`).limit(10),
        supabase.from('idioms').select(SELECT_FIELDS).or(`text.ilike.${term},origin.ilike.${term}`).limit(10),
        supabase.from('similes').select(SELECT_FIELDS).or(`text.ilike.${term},origin.ilike.${term}`).limit(10),
      ]);

      setSearchResults([
        ...(p || []).map(x => ({ ...x, type: 'proverb' as const })),
        ...(q || []).map(x => ({ ...x, type: 'quote' as const })),
        ...(i || []).map(x => ({ ...x, type: 'idiom' as const })),
        ...(s || []).map(x => ({ ...x, type: 'simile' as const })),
      ] as WisdomItem[]);
      setSearching(false);
    };

    search();
  }, [debouncedSearch]);

  const totalCount = counts.proverbs + counts.quotes + counts.idioms + counts.similes;

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Wisdom Empire Hub – Explore Wisdom from Cultures Worldwide"
        description="Wisdom Empire Hub brings you timeless wisdom from proverbs, quotes, idioms, and similes across cultures."
        keywords="wisdom, cultural wisdom, proverbs, quotes, idioms, similes"
        canonical={typeof window !== 'undefined' ? window.location.href : ''}
        preloadImage={heroImage}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Wisdom Empire Hub",
          "url": "https://wisdomempirehub.com",
          "description": "Wisdom Empire Hub brings you timeless wisdom from proverbs, quotes, idioms, and similes across cultures.",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://wisdomempirehub.com/?search={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        }}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero text-primary-foreground py-16">
        <div className="absolute inset-0">
          <img src={heroImage} alt="Wisdom Empire - Cultural Knowledge Hub" className="w-full h-full object-cover opacity-20" fetchPriority="high" decoding="async" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <img src="/lovable-uploads/logo-optimized.webp" alt="" className="w-96 h-96 md:w-[500px] md:h-[500px] lg:w-[600px] lg:h-[600px] object-contain opacity-20" loading="lazy" />
        </div>
        <div className="relative container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl font-wisdom tracking-tight text-white font-bold lg:text-4xl">
                Explore Wisdom from Cultures Worldwide
              </h1>
              <p className="text-lg lg:text-xl font-cultural opacity-90 max-w-2xl mx-auto text-violet-100">
                Wisdom Empire Hub brings together timeless proverbs, quotes, idioms, and similes from cultures around the world.
              </p>
            </div>
            <div className="w-full max-w-2xl mx-auto px-4 sm:px-0">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search any proverb, quote, idiom, simile..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full pl-12 h-14 text-base sm:text-lg backdrop-blur border-2 border-primary-foreground/20 focus:border-wisdom-blue bg-slate-100"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-4 py-12">
        {debouncedSearch.trim() ? (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold font-wisdom mb-2">Search Results</h2>
              <p className="text-muted-foreground text-lg">
                {searching ? 'Searching...' : `${searchResults.length} results found for "${debouncedSearch}"`}
              </p>
            </div>
            {searching ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, i) => <WisdomCardSkeleton key={i} />)}
              </div>
            ) : searchResults.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchResults.map((item) => <WisdomCard key={item.id} item={item} />)}
              </div>
            ) : (
              <div className="text-center py-16">
                <Search className="h-16 w-16 text-muted-foreground mx-auto" />
                <h3 className="text-xl font-semibold mt-4">No Results Found</h3>
                <p className="text-muted-foreground">Try different keywords or browse our categories.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-12 bg-slate-600">
            {/* Daily Wisdom */}
            <h2 className="text-3xl font-wisdom font-bold text-center text-white mb-8">Daily Wisdom</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => <WisdomCardSkeleton key={i} />)
              ) : (
                <>
                  {dailyItems[0] && (
                    <Card className="border-wisdom-blue/20 bg-gray-900">
                      <CardHeader className="bg-zinc-300">
                        <CardTitle className="flex items-center gap-2 text-gray-950">
                          <BookOpen className="h-5 w-5" />
                          Proverb of the Day
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="bg-slate-900 rounded-xl">
                        <WisdomCard item={dailyItems[0]} />
                      </CardContent>
                    </Card>
                  )}
                  {dailyItems[1] && (
                    <Card className="border-wisdom-gold/20 bg-gray-900">
                      <CardHeader className="bg-slate-100">
                        <CardTitle className="flex items-center gap-2 text-zinc-950">
                          <Quote className="h-5 w-5" />
                          Quote of the Day
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="bg-slate-900 rounded-xl">
                        <WisdomCard item={dailyItems[1]} />
                      </CardContent>
                    </Card>
                  )}
                  {dailyItems[2] && (
                    <Card className="border-wisdom-cultural/20 bg-gray-900">
                      <CardHeader className="bg-white">
                        <CardTitle className="flex items-center gap-2 text-zinc-950">
                          <MessageSquare className="h-5 w-5" />
                          Idiom of the Day
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="bg-slate-950">
                        <WisdomCard item={dailyItems[2]} />
                      </CardContent>
                    </Card>
                  )}
                </>
              )}
            </div>

            {/* Recently Added */}
            <div className="max-w-6xl mx-auto px-4 py-12">
              <h2 className="text-2xl font-bold mb-6 text-center">Recently Added</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {loading
                  ? Array.from({ length: 6 }).map((_, i) => <WisdomCardSkeleton key={i} />)
                  : recentItems.map((item) => <WisdomCard key={item.id} item={item} />)
                }
              </div>
            </div>

            {/* Explore by Category (hidden on mobile) */}
            <Card className="hidden md:block bg-gradient-to-r from-wisdom-blue/5 to-wisdom-gold/5 border-wisdom-gold/20 max-w-6xl mx-auto px-4 py-12">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold font-wisdom text-center mb-6">Explore by Category</h3>
                <div className="grid md:grid-cols-4 gap-4">
                  <Button variant="outline" className="h-20 flex-col gap-2" asChild>
                    <a href="/proverbs">
                      <BookOpen className="h-6 w-6" />
                      <span>Proverbs</span>
                      <span className="text-xs text-muted-foreground">{counts.proverbs} items</span>
                    </a>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col gap-2" asChild>
                    <a href="/quotes">
                      <Quote className="h-6 w-6" />
                      <span>Quotes</span>
                      <span className="text-xs text-muted-foreground">{counts.quotes} items</span>
                    </a>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col gap-2" asChild>
                    <a href="/idioms">
                      <MessageSquare className="h-6 w-6" />
                      <span>Idioms</span>
                      <span className="text-xs text-muted-foreground">{counts.idioms} items</span>
                    </a>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col gap-2" asChild>
                    <a href="/similes">
                      <Sparkles className="h-6 w-6" />
                      <span>Similes</span>
                      <span className="text-xs text-muted-foreground">{counts.similes} items</span>
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
