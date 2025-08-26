"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WisdomCard } from "@/components/WisdomCard";
import { AIAssistant } from "@/components/AIAssistant";
import { DownloadButton } from "@/components/DownloadButton";
import { supabase } from "@/integrations/supabase/client";
import { Search, Type } from "lucide-react";
import { SEOHead } from '@/components/SEOHead';
type WisdomItem = {
  id: string;
  type: 'proverb' | 'quote' | 'idiom' | 'simile';
  text: string;
  origin: string;
  subcategory: string;
  created_at: string;
};
const subcategories = ["Behavior", "Nature", "People", "Emotions", "Animals", "Appearance"];
const Similes = () => {
  const [similes, setSimiles] = useState<WisdomItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSubcategory, setActiveSubcategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const [subcategoryCounts, setSubcategoryCounts] = useState<Record<string, number>>({});

  // --- Fetch only similes from Supabase ---
  const fetchSimiles = async () => {
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
        } = await supabase.from("similes").select("*").range(from, from + limit - 1);
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
      setSimiles(allItems);
      setSubcategoryCounts(counts);
      setLoading(false);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchSimiles();
  }, []);

  // --- Filter & search ---
  const filteredSimiles = similes.filter(item => activeSubcategory === "all" ? true : (item.subcategory || "").toLowerCase() === activeSubcategory.toLowerCase()).filter(item => {
    if (!searchTerm) return true;
    return item.text.toLowerCase().includes(searchTerm.toLowerCase()) || item.origin.toLowerCase().includes(searchTerm.toLowerCase()) || item.subcategory.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // --- Pagination ---
  const totalPages = Math.ceil(filteredSimiles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentSimiles = filteredSimiles.slice(startIndex, startIndex + itemsPerPage);
  useEffect(() => {
    setCurrentPage(1); // reset page when filters change
  }, [searchTerm, activeSubcategory]);
  if (error) {
    return <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-4">Error Loading Similes</h1>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-background">
      <SEOHead
        title="Wisdom Empire Hub - Similes That Capture Timeless Wisdom"
        description="Discover similes from around the world that illustrate ideas with wisdom and creativity. Wisdom Empire Hub educates and inspires through cultural expressions."
        keywords="wisdom, similes that capture wisdom, timeless wisdom, comparative expressions, similes, figurative language, wise comparisons"
        canonical={typeof window !== 'undefined' ? window.location.href : ''}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "Wisdom Empire Hub - Similes That Capture Timeless Wisdom",
          "url": "https://wisdomempirehub.com/similes",
          "description": "Discover similes from around the world that illustrate ideas with wisdom and creativity. Wisdom Empire Hub educates and inspires through cultural expressions."
        }}
      />
      <div className="container mx-auto px-4 py-8 bg-slate-700">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-5xl font-wisdom font-bold mb-2 text-orange-200">Similes That Capture Timeless Wisdom</h1>
          <div className="max-w-4xl mx-auto text-lg mb-6 text-slate-50">
            <p className="mb-4">
             Discover our collection of similes that convey timeless wisdom through vivid comparisons. Covering themes like behavior, nature, people, emotions, and appearance, these expressions reveal cultural insights and make complex ideas memorable through familiar imagery.
            </p>
            <p className="mb-4">
              Our wisdom-filled similes span diverse categories including behavior, nature, people, emotions, animals, and appearance. These comparative expressions demonstrate how different cultures use similar patterns of thought to convey wisdom, creating bridges of understanding across linguistic and cultural boundaries. Discover how the wisdom of observation and comparison has been crystallized into these beautiful expressions that continue to enrich our understanding of the world around us.
            </p>
          </div>
          <DownloadButton category="similes" />

          {/* Search */}
          <div className="w-full max-w-md mx-auto mb-6 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search any simile..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 bg-card border-border my-[11px]" />
          </div>

          {/* Subcategories */}
          <div className="flex flex-wrap gap-2 justify-center mb-4">
            <Button variant={activeSubcategory === "all" ? "wisdom" : "outline"} size="sm" onClick={() => setActiveSubcategory("all")}>
              All
              <Badge variant="secondary" className="ml-2">
                {similes.length}
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
          <AIAssistant category="Similes" />

          {/* Display total similes & subcategory header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold font-wisdom mb-2 text-white">
              {activeSubcategory === "all" ? "All Similes" : `${activeSubcategory} Similes`}
            </h2>
            <p className="text-orange-400">
              {filteredSimiles.length} {filteredSimiles.length === 1 ? "simile" : "similes"} found
              {searchTerm && ` for "${searchTerm}"`}
            </p>
          </div>
        </div>

        {/* Similes Grid */}
        {loading ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <div key={i} className="animate-pulse">
                <div className="bg-muted h-64 rounded-lg"></div>
              </div>)}
          </div> : filteredSimiles.length > 0 ? <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentSimiles.map(item => <WisdomCard key={item.id} item={item} />)}
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
            <Type className="h-16 w-16 text-muted-foreground mx-auto" />
            <h3 className="text-xl font-semibold">No Similes Found</h3>
            <p className="text-muted-foreground">
              {searchTerm || activeSubcategory !== "all" ? "No results found. Try a different keyword or category." : "No similes available yet."}
            </p>
          </div>}
      </div>
    </div>;
};
export default Similes;