"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WisdomCard } from "@/components/WisdomCard";
import { AIAssistant } from "@/components/AIAssistant";
import { DownloadButton } from "@/components/DownloadButton";
import { supabase } from "@/integrations/supabase/client";
import { Search, BookOpen } from "lucide-react";
type WisdomItem = {
  id: string;
  type: 'proverb' | 'quote' | 'idiom' | 'simile';
  text: string;
  origin: string;
  subcategory: string;
  created_at: string;
};
const subcategories = ["success", "Time", "Love", "Money", "Wisdom", "Fear", "Trust", "Friendship"];
const Proverbs = () => {
  const [proverbs, setProverbs] = useState<WisdomItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSubcategory, setActiveSubcategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const [subcategoryCounts, setSubcategoryCounts] = useState<Record<string, number>>({});

  // --- Fetch only proverbs from Supabase ---
  const fetchProverbs = async () => {
    setLoading(true);
    setError(null);
    try {
      let allItems: WisdomItem[] = [];
      let from = 0;
      const limit = 1000; // fetch in batches
      let finished = false;
      while (!finished) {
        const {
          data,
          error
        } = await supabase.from("proverbs").select("*").range(from, from + limit - 1);
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
      setProverbs(allItems);
      setSubcategoryCounts(counts);
      setLoading(false);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchProverbs();
  }, []);

  // --- Filter & search ---
  const filteredProverbs = proverbs.filter(item => activeSubcategory === "all" ? true : (item.subcategory || "").toLowerCase() === activeSubcategory.toLowerCase()).filter(item => {
    if (!searchTerm) return true;
    return item.text.toLowerCase().includes(searchTerm.toLowerCase()) || item.origin.toLowerCase().includes(searchTerm.toLowerCase()) || item.subcategory.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // --- Pagination ---
  const totalPages = Math.ceil(filteredProverbs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProverbs = filteredProverbs.slice(startIndex, startIndex + itemsPerPage);
  useEffect(() => {
    setCurrentPage(1); // reset page when filters change
  }, [searchTerm, activeSubcategory]);
  if (error) {
    return <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-4">Error Loading Proverbs</h1>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 bg-slate-700">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-5xl font-wisdom font-bold mb-2 text-orange-300">Proverbs</h1>
          <p className="text-lg mb-4 text-slate-50">
            Traditional sayings that convey wisdom through generations
          </p>
          <DownloadButton category="proverbs" />

          {/* Search */}
          <div className="w-full max-w-md mx-auto mb-6 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search any proverb..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 bg-card border-border mx-0 my-[11px]" />
          </div>

          {/* Subcategories */}
          <div className="flex flex-wrap gap-2 justify-center mb-4">
            <Button variant={activeSubcategory === "all" ? "wisdom" : "outline"} size="sm" onClick={() => setActiveSubcategory("all")}>
              All
              <Badge variant="secondary" className="ml-2">
                {proverbs.length}
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
          <AIAssistant category="Proverbs" />

          {/* Display total proverbs & subcategory header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold font-wisdom mb-2 text-white">
              {activeSubcategory === "all" ? "All Proverbs" : `${activeSubcategory} Proverbs`}
            </h2>
            <p className="text-amber-500">
              {filteredProverbs.length}{" "}
              {filteredProverbs.length === 1 ? "proverb" : "proverbs"} found
              {searchTerm && ` for "${searchTerm}"`}
            </p>
          </div>
        </div>

        {/* Proverbs Grid */}
        {loading ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <div key={i} className="animate-pulse">
                <div className="bg-muted h-64 rounded-lg"></div>
              </div>)}
          </div> : filteredProverbs.length > 0 ? <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentProverbs.map(item => <WisdomCard key={item.id} item={item} />)}
            </div>

            {/* Pagination */}
            {totalPages > 1 && <div className="mt-8 flex justify-center gap-4">
                <Button onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
                  Prev
                </Button>
                <span className="self-center text-orange-400">
                  Page {currentPage} of {totalPages}
                </span>
                <Button onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
                  Next
                </Button>
              </div>}
          </> : <div className="text-center py-16">
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto" />
            <h3 className="text-xl font-semibold">No Proverbs Found</h3>
            <p className="text-muted-foreground">
              {searchTerm || activeSubcategory !== "all" ? "No results found. Try a different keyword or category." : "No proverbs available yet."}
            </p>
          </div>}
      </div>
    </div>;
};
export default Proverbs;