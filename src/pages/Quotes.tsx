"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WisdomCard } from "@/components/WisdomCard";
import { AIAssistant } from "@/components/AIAssistant";
import { DownloadButton } from "@/components/DownloadButton";
import { supabase } from "@/integrations/supabase/client";
import { Search, Quote } from "lucide-react";
import { SEOHead } from '@/components/SEOHead';
type WisdomItem = {
  id: string;
  type: 'proverb' | 'quote' | 'idiom' | 'simile';
  text: string;
  origin: string;
  subcategory: string;
  created_at: string;
};
const subcategories = ["Life Advice", "Daily Motivation", "Work & Business", "Famous People"];
const Quotes = () => {
  const [quotes, setQuotes] = useState<WisdomItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSubcategory, setActiveSubcategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const [subcategoryCounts, setSubcategoryCounts] = useState<Record<string, number>>({});

  // --- Fetch only quotes from Supabase ---
  const fetchQuotes = async () => {
    setLoading(true);
    setError(null);
    try {
      let allItems: WisdomItem[] = [];
      let from = 0;
      const limit = 1000;
      let finished = false;
      while (!finished) {
        const {
          data,
          error
        } = await supabase.from("quotes").select("*").range(from, from + limit - 1);
        if (error) {
          setError(error.message);
          finished = true;
          continue;
        }
        if (data && data.length > 0) {
          allItems = [...allItems, ...(data as WisdomItem[])];
          from += limit;
          if (data.length < limit) finished = true;
        } else {
          finished = true;
        }
      }

      // Count per subcategory
      const counts: Record<string, number> = {};
      allItems.forEach(item => {
        const sub = item.subcategory?.trim() || "Uncategorized";
        counts[sub] = (counts[sub] || 0) + 1;
      });
      setQuotes(allItems);
      setSubcategoryCounts(counts);
      setLoading(false);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchQuotes();
  }, []);

  // --- Filter & search ---
  const filteredQuotes = quotes.filter(item => activeSubcategory === "all" ? true : (item.subcategory || "").toLowerCase() === activeSubcategory.toLowerCase()).filter(item => {
    if (!searchTerm) return true;
    return item.text.toLowerCase().includes(searchTerm.toLowerCase()) || item.origin.toLowerCase().includes(searchTerm.toLowerCase()) || item.subcategory.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // --- Pagination ---
  const totalPages = Math.ceil(filteredQuotes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentQuotes = filteredQuotes.slice(startIndex, startIndex + itemsPerPage);
  useEffect(() => {
    setCurrentPage(1); // reset page when filters change
  }, [searchTerm, activeSubcategory]);
  if (error) {
    return <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-4">Error Loading Quotes</h1>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-background">
      <SEOHead title="Wisdom Empire Hub - Inspirational Quotes Full of Wisdom" description="Dive into a collection of quotes full of wisdom from around the world. Wisdom Empire Hub helps you learn and apply timeless wisdom in daily life." keywords="wisdom, quotes full of wisdom, inspirational quotes, wisdom quotes, motivational quotes, wise quotes, timeless wisdom" canonical={typeof window !== 'undefined' ? window.location.href : ''} structuredData={{
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Wisdom Empire Hub - Inspirational Quotes Full of Wisdom",
      "url": "https://wisdomempirehub.com/quotes",
      "description": "Dive into a collection of quotes full of wisdom from around the world. Wisdom Empire Hub helps you learn and apply timeless wisdom in daily life."
    }} />
      <div className="container mx-auto px-4 py-8 bg-slate-700">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="font-wisdom mb-2 text-orange-200 font-bold text-4xl">Inspirational Quotes Full of Wisdom</h1>
          <div className="max-w-4xl mx-auto text-lg mb-6 text-slate-50">
            <p className="mb-4 text-sm">
            Explore our collection of inspirational quotes from history’s greatest minds—philosophers, leaders, artists, and thinkers. These timeless words offer guidance on life, motivation, work, and personal growth, providing wisdom that inspires positive change and transcends generations and cultures.
            </p>
            
          </div>
          <DownloadButton category="quotes" />

          {/* Search */}
          <div className="w-full max-w-md mx-auto mb-6 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search any quote..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 bg-card border-border my-[10px]" />
          </div>

          {/* Subcategories */}
          <div className="flex flex-wrap gap-2 justify-center mb-4">
            <Button variant={activeSubcategory === "all" ? "wisdom" : "outline"} size="sm" onClick={() => setActiveSubcategory("all")}>
              All
              <Badge variant="secondary" className="ml-2">
                {quotes.length}
              </Badge>
            </Button>
            {subcategories.map(sub => <Button key={sub} variant={activeSubcategory === sub ? "wisdom" : "outline"} size="sm" onClick={() => setActiveSubcategory(sub)}>
                {sub}
                <Badge variant="secondary" className="ml-2">
                  {subcategoryCounts[sub] || 0}
                </Badge>
              </Button>)}
          </div>

          {/* AI Assistant */}
          <AIAssistant category="Quotes" />

          {/* Display total quotes & subcategory header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold font-wisdom mb-2 text-white">
              {activeSubcategory === "all" ? "All Quotes" : `${activeSubcategory} Quotes`}
            </h2>
            <p className="text-orange-400">
              {filteredQuotes.length} {filteredQuotes.length === 1 ? "quote" : "quotes"} found
              {searchTerm && ` for "${searchTerm}"`}
            </p>
          </div>
        </div>

        {/* Quotes Grid */}
        {loading ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <div key={i} className="animate-pulse">
                <div className="bg-muted h-64 rounded-lg"></div>
              </div>)}
          </div> : filteredQuotes.length > 0 ? <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentQuotes.map(item => <WisdomCard key={item.id} item={item} />)}
            </div>

            {/* Pagination */}
            {totalPages > 1 && <div className="mt-8 flex justify-center gap-4">
                <Button onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
                  Prev
                </Button>
                <span className="self-center text-orange-500">
                  Page {currentPage} of {totalPages}
                </span>
                <Button onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
                  Next
                </Button>
              </div>}
          </> : <div className="text-center py-16">
            <Quote className="h-16 w-16 text-muted-foreground mx-auto" />
            <h3 className="text-xl font-semibold">No Quotes Found</h3>
            <p className="text-muted-foreground">
              {searchTerm || activeSubcategory !== "all" ? "No results found. Try a different keyword or category." : "No quotes available yet."}
            </p>
          </div>}
      </div>
    </div>;
};
export default Quotes;