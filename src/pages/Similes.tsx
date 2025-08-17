"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WisdomCard } from "@/components/WisdomCard";
import { AIAssistant } from "@/components/AIAssistant";
import { DownloadButton } from "@/components/DownloadButton";
import { supabase } from "@/integrations/supabase/client";
import { Search, Zap } from "lucide-react";

const subcategories = ["Emotion", "People", "Animals", "Nature", "Behavior", "Appearance"];

const itemsPerPage = 12;

const Similes = () => {
  const [similes, setSimiles] = useState<any[]>([]);
  const [subcategoryCounts, setSubcategoryCounts] = useState<Record<string, number>>({});
  const [totalCount, setTotalCount] = useState(0);
  const [activeSubcategory, setActiveSubcategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchSimiles = async () => {
    setLoading(true);

    // Build Supabase filters
    let query = supabase.from("similes").select("*", { count: "exact" });

    if (activeSubcategory !== "all") {
      query = query.eq("subcategory", activeSubcategory);
    }

    if (searchTerm.trim()) {
      query = query.ilike("text", `%${searchTerm}%`);
    }

    // Pagination
    const from = (currentPage - 1) * itemsPerPage;
    const to = from + itemsPerPage - 1;
    const { data, count, error } = await query.range(from, to);

    if (error) {
      console.error("Error fetching similes:", error);
      setSimiles([]);
      setTotalCount(0);
    } else {
      setSimiles(data || []);
      setTotalCount(count || 0);
    }

    setLoading(false);
  };

  const fetchSubcategoryCounts = async () => {
    // Fetch counts for each subcategory
    const counts: Record<string, number> = {};
    for (const sub of subcategories) {
      const { count, error } = await supabase
        .from("similes")
        .select("*", { count: "exact" })
        .eq("subcategory", sub);
      if (!error) counts[sub] = count || 0;
    }
    setSubcategoryCounts(counts);
  };

  useEffect(() => {
    fetchSubcategoryCounts();
  }, []);

  useEffect(() => {
    setCurrentPage(1); // Reset page when filters change
  }, [activeSubcategory, searchTerm]);

  useEffect(() => {
    fetchSimiles();
  }, [activeSubcategory, searchTerm, currentPage]);

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="font-wisdom text-5xl font-bold text-gray-900">Similes</h1>
            <DownloadButton category="similes" />
          </div>
          <p className="text-lg text-center text-muted-foreground mb-6">
            Comparative phrases that use "like" or "as" to create vivid descriptions and imagery.
          </p>

          {/* Search */}
          <div className="w-full max-w-md mx-auto mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search any simile..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 bg-card border-border"
              />
            </div>
          </div>

          {/* Subcategory Buttons */}
          <div className="mb-6 flex flex-wrap gap-2 justify-center">
            <Button
              variant={activeSubcategory === "all" ? "wisdom" : "outline"}
              size="sm"
              onClick={() => setActiveSubcategory("all")}
            >
              All Similes
              <Badge variant="secondary" className="ml-2">{totalCount}</Badge>
            </Button>
            {subcategories.map((sub) => (
              <Button
                key={sub}
                variant={activeSubcategory === sub ? "wisdom" : "outline"}
                size="sm"
                onClick={() => setActiveSubcategory(sub)}
              >
                {sub}
                <Badge variant="secondary" className="ml-2">
                  {subcategoryCounts[sub] || 0}
                </Badge>
              </Button>
            ))}
          </div>

          {/* AI Assistant */}
          <AIAssistant category="Similes" />
        </div>

        {/* Similes Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-muted h-64 rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : similes.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {similes.map((item) => (
                <WisdomCard key={item.id} item={item} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center gap-2">
                <Button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </Button>
                <span className="flex items-center px-2">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <Zap className="h-16 w-16 text-muted-foreground mx-auto" />
            <h3 className="text-xl font-semibold">No Similes Found</h3>
            <p className="text-muted-foreground">
              {searchTerm || activeSubcategory !== "all"
                ? "No results found. Try a different keyword or category."
                : "No similes available yet."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Similes;
