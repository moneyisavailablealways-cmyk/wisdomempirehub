"use client";

import React, { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AIAssistant } from "@/components/AIAssistant";
import { DownloadButton } from "@/components/DownloadButton";
import { InfiniteWisdomGrid } from "@/components/InfiniteWisdomGrid";
import { useWisdomFeed } from "@/hooks/useWisdomFeed";
import { Search, Quote } from "lucide-react";
import { SEOHead } from '@/components/SEOHead';

const subcategories = ["Life Advice", "Daily Motivation", "Work & Business", "Famous People"];

const Quotes = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSubcategory, setActiveSubcategory] = useState("all");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const debounceTimer = React.useRef<ReturnType<typeof setTimeout>>();
  const handleSearchChange = React.useCallback((value: string) => {
    setSearchTerm(value);
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => setDebouncedSearch(value), 300);
  }, []);

  const { items, loading, loadingMore, error, hasMore, totalCount, subcategoryCounts, loadMore } =
    useWisdomFeed('quotes', debouncedSearch, activeSubcategory);

  const emptyMessage = useMemo(() => {
    if (debouncedSearch || activeSubcategory !== "all")
      return "No results found. Try a different keyword or category.";
    return "No quotes available yet.";
  }, [debouncedSearch, activeSubcategory]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-4">Error Loading Quotes</h1>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Wisdom Empire Hub - Inspirational Quotes Full of Wisdom"
        description="Dive into a collection of quotes full of wisdom from around the world."
        keywords="wisdom, quotes full of wisdom, inspirational quotes, motivational quotes"
        canonical={typeof window !== 'undefined' ? window.location.href : ''}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "Wisdom Empire Hub - Inspirational Quotes Full of Wisdom",
          "url": "https://wisdomempirehub.com/quotes",
          "description": "Dive into a collection of quotes full of wisdom from around the world."
        }}
      />
      <div className="container mx-auto px-4 py-8 bg-slate-700">
        <div className="mb-8 text-center">
          <h1 className="font-wisdom mb-2 text-orange-200 font-bold text-4xl">
            Inspirational Quotes Full of Wisdom
          </h1>
          <div className="max-w-4xl mx-auto text-lg mb-6 text-slate-50">
            <p className="mb-4 text-sm">
              Explore our collection of inspirational quotes from history's greatest minds—philosophers, leaders, artists, and thinkers.
            </p>
          </div>
          <DownloadButton category="quotes" />

          <div className="w-full max-w-md mx-auto mb-6 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search any quote..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 bg-card border-border my-[10px]"
            />
          </div>

          <div className="flex flex-wrap gap-2 justify-center mb-4">
            <Button variant={activeSubcategory === "all" ? "wisdom" : "outline"} size="sm" onClick={() => setActiveSubcategory("all")}>
              All
              <Badge variant="secondary" className="ml-2">{totalCount ?? '...'}</Badge>
            </Button>
            {subcategories.map((sub) => (
              <Button key={sub} variant={activeSubcategory === sub ? "wisdom" : "outline"} size="sm" onClick={() => setActiveSubcategory(sub)}>
                {sub}
                <Badge variant="secondary" className="ml-2">{subcategoryCounts[sub] || 0}</Badge>
              </Button>
            ))}
          </div>

          <AIAssistant category="Quotes" />

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold font-wisdom mb-2 text-white">
              {activeSubcategory === "all" ? "All Quotes" : `${activeSubcategory} Quotes`}
            </h2>
            <p className="text-orange-400">
              {totalCount !== null ? `${totalCount} quotes` : 'Loading...'}
              {debouncedSearch && ` matching "${debouncedSearch}"`}
            </p>
          </div>
        </div>

        <InfiniteWisdomGrid
          items={items}
          loading={loading}
          loadingMore={loadingMore}
          hasMore={hasMore}
          onLoadMore={loadMore}
          emptyIcon={<Quote className="h-16 w-16 text-muted-foreground mx-auto" />}
          emptyTitle="No Quotes Found"
          emptyMessage={emptyMessage}
        />
      </div>
    </div>
  );
};

export default Quotes;
