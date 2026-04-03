"use client";

import React, { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AIAssistant } from "@/components/AIAssistant";
import { DownloadButton } from "@/components/DownloadButton";
import { InfiniteWisdomGrid } from "@/components/InfiniteWisdomGrid";
import { useWisdomFeed } from "@/hooks/useWisdomFeed";
import { Search, BookOpen } from "lucide-react";
import { SEOHead } from '@/components/SEOHead';

const subcategories = ["success", "Time", "Love", "Money", "Wisdom", "Fear", "Trust", "Friendship"];

const Proverbs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSubcategory, setActiveSubcategory] = useState("all");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search input
  const debounceTimer = React.useRef<ReturnType<typeof setTimeout>>();
  const handleSearchChange = React.useCallback((value: string) => {
    setSearchTerm(value);
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => setDebouncedSearch(value), 300);
  }, []);

  const { items, loading, loadingMore, error, hasMore, totalCount, subcategoryCounts, loadMore } =
    useWisdomFeed('proverbs', debouncedSearch, activeSubcategory);

  const emptyMessage = useMemo(() => {
    if (debouncedSearch || activeSubcategory !== "all")
      return "No results found. Try a different keyword or category.";
    return "No proverbs available yet.";
  }, [debouncedSearch, activeSubcategory]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-4">Error Loading Proverbs</h1>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Wisdom Empire Hub - Proverbs of Wisdom from Cultures Worldwide"
        description="Explore proverbs that teach valuable life lessons and share cultural wisdom."
        keywords="wisdom, proverbs of wisdom, cultural wisdom, traditional proverbs"
        canonical={typeof window !== 'undefined' ? window.location.href : ''}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "Wisdom Empire Hub - Proverbs of Wisdom from Cultures Worldwide",
          "url": "https://wisdomempirehub.com/proverbs",
          "description": "Explore proverbs that teach valuable life lessons and share cultural wisdom."
        }}
      />
      <div className="container mx-auto px-4 py-8 bg-slate-700">
        <div className="mb-8 text-center">
          <h1 className="font-wisdom font-bold mb-2 text-orange-200 text-4xl">
            Proverbs of Wisdom from Cultures Worldwide
          </h1>
          <div className="max-w-4xl mx-auto text-lg mb-6 text-slate-50">
            <p className="mb-4 text-sm">
              Explore our collection of proverbs from cultures around the world, offering timeless wisdom on life, love, friendship, success, and more.
            </p>
          </div>
          <DownloadButton category="proverbs" />

          <div className="w-full max-w-md mx-auto mb-6 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search any proverb..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 bg-card border-border mx-0 my-[11px]"
            />
          </div>

          <div className="flex flex-wrap gap-2 justify-center mb-4">
            <Button
              variant={activeSubcategory === "all" ? "wisdom" : "outline"}
              size="sm"
              onClick={() => setActiveSubcategory("all")}
            >
              All
              <Badge variant="secondary" className="ml-2">
                {totalCount ?? '...'}
              </Badge>
            </Button>
            {subcategories.map((sub) => (
              <Button
                key={sub}
                variant={activeSubcategory === sub ? "wisdom" : "outline"}
                size="sm"
                onClick={() => setActiveSubcategory(sub)}
              >
                {sub}
              </Button>
            ))}
          </div>

          <AIAssistant category="Proverbs" />

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold font-wisdom mb-2 text-white">
              {activeSubcategory === "all" ? "All Proverbs" : `${activeSubcategory} Proverbs`}
            </h2>
            <p className="text-amber-500">
              {totalCount !== null ? `${totalCount} proverbs` : 'Loading...'}
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
          emptyIcon={<BookOpen className="h-16 w-16 text-muted-foreground mx-auto" />}
          emptyTitle="No Proverbs Found"
          emptyMessage={emptyMessage}
        />
      </div>
    </div>
  );
};

export default Proverbs;
