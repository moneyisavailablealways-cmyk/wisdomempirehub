"use client";

import React, { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AIAssistant } from "@/components/AIAssistant";
import { DownloadButton } from "@/components/DownloadButton";
import { PaginatedWisdomGrid } from "@/components/PaginatedWisdomGrid";
import { useWisdomPagination } from "@/hooks/useWisdomPagination";
import { Search, Type } from "lucide-react";
import { SEOHead } from '@/components/SEOHead';

const subcategories = ["Emotions", "Success", "Time", "Friendship", "Relationship", "Work", "Life"];

const Idioms = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSubcategory, setActiveSubcategory] = useState("all");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const debounceTimer = React.useRef<ReturnType<typeof setTimeout>>();
  const handleSearchChange = React.useCallback((value: string) => {
    setSearchTerm(value);
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => setDebouncedSearch(value), 300);
  }, []);

  const { items, loading, error, currentPage, totalPages, totalCount, goToPage } =
    useWisdomPagination('idioms', debouncedSearch, activeSubcategory);

  const emptyMessage = useMemo(() => {
    if (debouncedSearch || activeSubcategory !== "all")
      return "No results found. Try a different keyword or category.";
    return "No idioms available yet.";
  }, [debouncedSearch, activeSubcategory]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-4">Error Loading Idioms</h1>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Wisdom Empire Hub - Idioms Rich in Cultural Wisdom"
        description="Understand idioms from different cultures, packed with wisdom."
        keywords="wisdom, idioms rich in wisdom, cultural wisdom, cultural expressions"
        canonical={typeof window !== 'undefined' ? window.location.href : ''}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "Wisdom Empire Hub - Idioms Rich in Cultural Wisdom",
          "url": "https://wisdomempirehub.com/idioms",
          "description": "Understand idioms from different cultures, packed with wisdom."
        }}
      />
      <div className="container mx-auto px-4 py-8 bg-slate-700">
        <div className="mb-8 text-center">
          <h1 className="font-wisdom mb-2 text-orange-200 text-4xl font-bold">
            Idioms Rich in Cultural Wisdom
          </h1>
          <div className="max-w-4xl mx-auto text-lg mb-6 text-slate-50">
            <p className="mb-4">
              Explore our collection of idioms from cultures worldwide, each carrying deep wisdom beyond literal meaning.
            </p>
          </div>
          <DownloadButton category="idioms" />

          <div className="w-full max-w-md mx-auto mb-6 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search any idiom..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 bg-card border-border my-[11px]"
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
              </Button>
            ))}
          </div>

          <AIAssistant category="Idioms" />

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold font-wisdom mb-2 text-white">
              {activeSubcategory === "all" ? "All Idioms" : `${activeSubcategory} Idioms`}
            </h2>
            <p className="text-orange-400">
              {totalCount !== null ? `${totalCount} idioms` : 'Loading...'}
              {debouncedSearch && ` matching "${debouncedSearch}"`}
            </p>
          </div>
        </div>

        <PaginatedWisdomGrid
          items={items}
          loading={loading}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={goToPage}
          emptyIcon={<Type className="h-16 w-16 text-muted-foreground mx-auto" />}
          emptyTitle="No Idioms Found"
          emptyMessage={emptyMessage}
        />
      </div>
    </div>
  );
};

export default Idioms;
