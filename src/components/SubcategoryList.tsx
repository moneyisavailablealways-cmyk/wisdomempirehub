"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabaseClient";

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
  const [subcategoryCounts, setSubcategoryCounts] = useState<Record<string, number>>({});
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const fetchSubcategories = async () => {
    if (activeCategory === "all") return;

    setLoading(true);

    const { data, error, count } = await supabase
      .from(activeCategory)
      .select("subcategory", { count: "exact" });

    if (error) {
      console.error(`Error fetching ${activeCategory}:`, error);
      setLoading(false);
      return;
    }

    // Count per subcategory
    const counts: Record<string, number> = {};
    data?.forEach((item: any) => {
      const sub = item.subcategory?.trim() || "Uncategorized";
      counts[sub] = (counts[sub] || 0) + 1;
    });

    setSubcategoryCounts(counts);
    setTotalCount(count || 0);
    setLoading(false);
  };

  useEffect(() => {
    fetchSubcategories();
  }, [activeCategory]);

  if (loading) return <div className="text-muted-foreground">Loading categories...</div>;

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
              {activeCategory === cat ? totalCount : "-"}
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
              {totalCount}
            </Badge>
          </Button>

          {Object.entries(subcategoryCounts).map(([sub, count]) => (
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
          ))}
        </div>
      )}
    </div>
  );
};

export default SubcategoryList;
