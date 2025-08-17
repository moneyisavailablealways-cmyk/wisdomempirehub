"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

type WisdomItem = {
  id: string;
  type: string; // idiom, proverb, simile, quote
  text: string;
  origin: string;
  subcategory: string;
};

interface SubcategoryListProps {
  activeCategory: "idioms" | "proverbs" | "quotes" | "similes" | "all";
  setActiveCategory: (category: string) => void;
  activeSubcategory: string;
  setActiveSubcategory: (subcategory: string) => void;
}

const SubcategoryList: React.FC<SubcategoryListProps> = ({
  activeCategory,
  setActiveCategory,
  activeSubcategory,
  setActiveSubcategory,
}) => {
  const [subcategoryCounts, setSubcategoryCounts] = useState<
    Record<string, Record<string, number>>
  >({});
  const [totalCounts, setTotalCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  // Fetch all items from all tables
  const fetchAllData = async () => {
    setLoading(true);

    const categories = ["idioms", "proverbs", "quotes", "similes"] as const;
    const subcategoryMap: Record<string, Record<string, number>> = {};
    const totalMap: Record<string, number> = {};

    for (const category of categories) {
      let allItems: WisdomItem[] = [];
      let from = 0;
      const limit = 1000;
      let finished = false;

      while (!finished) {
        const { data, error } = await supabase
          .from(category)
          .select("*")
          .range(from, from + limit - 1);

        if (error) {
          console.error(`Error fetching ${category}:`, error);
          finished = true;
          continue;
        }

        if (data && data.length > 0) {
          allItems = [...allItems, ...(data as unknown as WisdomItem[])];
          from += limit;
          if (data.length < limit) finished = true;
        } else {
          finished = true;
        }
      }

      // Count per subcategory
      const counts: Record<string, number> = {};
      allItems.forEach((item) => {
        const sub = item.subcategory?.trim() || "Uncategorized";
        counts[sub] = (counts[sub] || 0) + 1;
      });

      subcategoryMap[category] = counts;
      totalMap[category] = allItems.length;
    }

    setSubcategoryCounts(subcategoryMap);
    setTotalCounts(totalMap);
    setLoading(false);
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  if (loading) {
    return <div className="text-muted-foreground">Loading categories...</div>;
  }

  const categories = ["idioms", "proverbs", "quotes", "similes"];

  return (
    <div className="flex flex-col gap-4">
      {/* Category Selector */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={activeCategory === "all" ? "wisdom" : "outline"}
          size="sm"
          onClick={() => setActiveCategory("all")}
        >
          All Categories
        </Button>
        {categories.map((cat) => (
          <Button
            key={cat}
            variant={activeCategory === cat ? "wisdom" : "outline"}
            size="sm"
            onClick={() => setActiveCategory(cat)}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
            <Badge variant="secondary" className="ml-2">
              {totalCounts[cat] || 0}
            </Badge>
          </Button>
        ))}
      </div>

      {/* Subcategory Selector */}
      {activeCategory !== "all" && (
        <div className="flex flex-wrap gap-2">
          <Button
            variant={activeSubcategory === "all" ? "wisdom" : "outline"}
            size="sm"
            onClick={() => setActiveSubcategory("all")}
          >
            All {activeCategory}
            <Badge variant="secondary" className="ml-2">
              {totalCounts[activeCategory] || 0}
            </Badge>
          </Button>

          {subcategoryCounts[activeCategory] &&
            Object.entries(subcategoryCounts[activeCategory]).map(
              ([sub, count]) => (
                <Button
                  key={sub}
                  variant={activeSubcategory === sub ? "wisdom" : "outline"}
                  size="sm"
                  onClick={() => setActiveSubcategory(sub)}
                >
                  {sub}
                  <Badge variant="secondary" className="ml-2">
                    {count}
                  </Badge>
                </Button>
              )
            )}
        </div>
      )}
    </div>
  );
};

export default SubcategoryList;