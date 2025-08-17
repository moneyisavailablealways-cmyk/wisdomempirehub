"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabaseClient"; // adjust path to your Supabase client

type WisdomItem = {
  id: string;
  type: string;         // idiom, proverb, simile, quote
  text: string;
  origin: string;
  subcategory: string;
};

interface SubcategoryListProps {
  category: "idioms" | "proverbs" | "quotes" | "similes"; // specify table/category
  activeSubcategory: string;
  setActiveSubcategory: (subcategory: string) => void;
}

const SubcategoryList: React.FC<SubcategoryListProps> = ({
  category,
  activeSubcategory,
  setActiveSubcategory,
}) => {
  const [subcategoryCounts, setSubcategoryCounts] = useState<Record<string, number>>({});
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  // Fetch all rows from Supabase without 1000 row limit
  const fetchAllItems = async () => {
    setLoading(true);

    let allItems: WisdomItem[] = [];
    let from = 0;
    const limit = 1000;
    let finished = false;

    while (!finished) {
      const { data, error } = await supabase
        .from(category) // your table name matches category
        .select("*")
        .range(from, from + limit - 1);

      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }

      if (data && data.length > 0) {
        allItems = [...allItems, ...data];
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

    setSubcategoryCounts(counts);
    setTotalCount(allItems.length);
    setLoading(false);
  };

  useEffect(() => {
    fetchAllItems();
  }, [category]);

  if (loading) {
    return <div className="text-muted-foreground">Loading categories...</div>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {/* All Items Button */}
      <Button
        variant={activeSubcategory === "all" ? "wisdom" : "outline"}
        size="sm"
        onClick={() => setActiveSubcategory("all")}
      >
        All {category}
        <Badge variant="secondary" className="ml-2">
          {totalCount}
        </Badge>
      </Button>

      {/* Subcategory Buttons */}
      {Object.entries(subcategoryCounts).map(([subcategory, count]) => (
        <Button
          key={subcategory}
          variant={activeSubcategory === subcategory ? "wisdom" : "outline"}
          size="sm"
          onClick={() => setActiveSubcategory(subcategory)}
        >
          {subcategory}
          <Badge variant="secondary" className="ml-2">
            {count}
          </Badge>
        </Button>
      ))}
    </div>
  );
};

export default SubcategoryList;
