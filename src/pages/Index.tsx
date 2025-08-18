import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WisdomCard } from '@/components/WisdomCard';
import { useWisdomData } from '@/hooks/useWisdomData';
import { Search, BookOpen, Quote, MessageSquare, Sparkles } from 'lucide-react';
import heroImage from '@/assets/wisdom-hero.jpg';
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  const { items, loading, error } = useWisdomData();
  const [searchTerm, setSearchTerm] = useState('');
  const [totalIdioms, setTotalIdioms] = useState<number | null>(null);
  const [totalProverbs, setTotalProverbs] = useState<number | null>(null);
  const [quotesCount, setQuotesCount] = useState<number | null>(null);
  const [similesCount, setSimilesCount] = useState<number | null>(null);

  // New app-level loading state (3s delay)
  const [pageLoading, setPageLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setPageLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  // Fetch live counts from Supabase
  useEffect(() => {
    const fetchSimilesCount = async () => {
      const { count } = await supabase.from("similes").select("*", { count: "exact", head: true });
      setSimilesCount(count ?? 0);
    };
    fetchSimilesCount();
  }, []);

  useEffect(() => {
    const fetchQuotesCount = async () => {
      const { count } = await supabase.from("quotes").select("*", { count: "exact", head: true });
      setQuotesCount(count ?? 0);
    };
    fetchQuotesCount();
  }, []);

  useEffect(() => {
    const fetchIdiomsCount = async () => {
      const { count } = await supabase.from("idioms").select("*", { count: "exact", head: true });
      setTotalIdioms(count ?? 0);
    };
    fetchIdiomsCount();
  }, []);

  useEffect(() => {
    const fetchProverbsCount = async () => {
      const { count } = await supabase.from("proverbs").select("*", { count: "exact", head: true });
      setTotalProverbs(count ?? 0);
    };
    fetchProverbsCount();
  }, []);

  // Daily Wisdom logic
  const today = new Date().toDateString();
  const dateHash = today.split('').reduce((a, b) => a + b.charCodeAt(0), 0);

  const proverbs = items.filter(item => item.type === 'proverb');
  const quotes = items.filter(item => item.type === 'quote');
  const idioms = items.filter(item => item.type === 'idiom');
  const similes = items.filter(item => item.type === 'simile');

  const proverbOfDay = proverbs[dateHash % proverbs.length];
  const quoteOfDay = quotes[(dateHash + 1) % quotes.length];
  const idiomOfDay = idioms[(dateHash + 2) % idioms.length];

  // Search
  const filteredItems = items.filter(item => {
    if (!searchTerm.trim()) return false;
    const searchLower = searchTerm.toLowerCase();
    return (
      item.text.toLowerCase().includes(searchLower) ||
      item.origin.toLowerCase().includes(searchLower) ||
      item.subcategory.toLowerCase().includes(searchLower)
    );
  });

  // Most Viewed & Recently Added
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

  // Show loading screen for 3s
  if (pageLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        {/* Spinner */}
        <div className="h-12 w-12 border-4 border-wisdom-blue border-t-transparent rounded-full animate-spin mb-4"></div>
        <div className="text-center animate-pulse">
          <h1 className="text-3xl font-bold text-wisdom-blue">Wisdom Empire</h1>
          <p className="text-muted-foreground mt-2">Loading wisdom...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-[400px] flex items-center justify-center text-center text-white">
        <img src={heroImage} alt="Wisdom background" className="absolute inset-0 w-full h-full object-cover brightness-50" />
        <div className="relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Wisdom Empire</h1>
          <p className="text-xl">Discover Proverbs, Quotes, Idioms & Similes</p>
        </div>
      </div>

      {/* Daily Wisdom */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6 text-center">Daily Wisdom</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {proverbOfDay && (
            <Card>
              <CardHeader>
                <CardTitle>Proverb of the Day</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg italic">"{proverbOfDay.text}"</p>
                <p className="text-sm text-muted-foreground mt-2">Origin: {proverbOfDay.origin}</p>
              </CardContent>
            </Card>
          )}
          {quoteOfDay && (
            <Card>
              <CardHeader>
                <CardTitle>Quote of the Day</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg italic">"{quoteOfDay.text}"</p>
                <p className="text-sm text-muted-foreground mt-2">— {quoteOfDay.origin}</p>
              </CardContent>
            </Card>
          )}
          {idiomOfDay && (
            <Card>
              <CardHeader>
                <CardTitle>Idiom of the Day</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg italic">"{idiomOfDay.text}"</p>
                <p className="text-sm text-muted-foreground mt-2">Origin: {idiomOfDay.origin}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex gap-2">
          <Input
            placeholder="Search wisdom..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button><Search className="h-4 w-4" /></Button>
        </div>
        {searchTerm && (
          <div className="mt-6 grid gap-4">
            {filteredItems.map((item) => (
              <WisdomCard key={item.id} item={item} />
            ))}
            {filteredItems.length === 0 && (
              <p className="text-center text-muted-foreground">No results found</p>
            )}
          </div>
        )}
      </div>

      {/* Quick Navigation with Live Counts */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6 text-center">Explore Wisdom</h2>
        <div className="grid md:grid-cols-4 gap-4">
          <Button variant="outline" className="h-24 flex-col gap-2" asChild>
            <a href="/proverbs">
              <BookOpen className="h-6 w-6" />
              <span>Proverbs</span>
              <span className="text-xs text-muted-foreground">{totalProverbs ?? 0} items</span>
            </a>
          </Button>
          <Button variant="outline" className="h-24 flex-col gap-2" asChild>
            <a href="/quotes">
              <Quote className="h-6 w-6" />
              <span>Quotes</span>
              <span className="text-xs text-muted-foreground">{quotesCount ?? 0} items</span>
            </a>
          </Button>
          <Button variant="outline" className="h-24 flex-col gap-2" asChild>
            <a href="/idioms">
              <MessageSquare className="h-6 w-6" />
              <span>Idioms</span>
              <span className="text-xs text-muted-foreground">{totalIdioms ?? 0} items</span>
            </a>
          </Button>
          <Button variant="outline" className="h-24 flex-col gap-2" asChild>
            <a href="/similes">
              <Sparkles className="h-6 w-6" />
              <span>Similes</span>
              <span className="text-xs text-muted-foreground">{similesCount ?? 0} items</span>
            </a>
          </Button>
        </div>
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
    </div>
  );
};

export default Index;
