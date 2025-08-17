import React, { useEffect, useState } from "react";
import { supabase } from "../integrations/supabase/client";

interface SubcategoryListProps {
  table: string;
}

interface Subcategory {
  name: string;
  count: number;
}

export const SubcategoryList: React.FC<SubcategoryListProps> = ({ table }) => {
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [selectedSub, setSelectedSub] = useState<string | null>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch distinct subcategories + counts
  useEffect(() => {
    const fetchSubcategories = async () => {
      const { data, error } = await supabase
        .from(table)
        .select("subcategory, id");

      if (error) {
        console.error("Error fetching subcategories:", error);
        return;
      }

      // Group counts by subcategory
      const grouped: Record<string, number> = {};
      data?.forEach((row: any) => {
        if (!grouped[row.subcategory]) grouped[row.subcategory] = 0;
        grouped[row.subcategory]++;
      });

      const formatted = Object.keys(grouped).map((key) => ({
        name: key,
        count: grouped[key],
      }));

      setSubcategories(formatted);
      if (formatted.length > 0) {
        setSelectedSub(formatted[0].name); // auto-select first
      }
    };

    fetchSubcategories();
  }, [table]);

  // Fetch items for selected subcategory
  useEffect(() => {
    if (!selectedSub) return;

    const fetchItems = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from(table)
        .select("*")
        .eq("subcategory", selectedSub)
        .limit(20);

      if (error) {
        console.error("Error fetching items:", error);
      } else {
        setItems(data || []);
      }
      setLoading(false);
    };

    fetchItems();
  }, [selectedSub, table]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Categories</h2>
      <div className="flex flex-wrap gap-2 mb-6">
        {subcategories.map((sub) => (
          <button
            key={sub.name}
            onClick={() => setSelectedSub(sub.name)}
            className={`px-4 py-2 rounded-lg border ${
              selectedSub === sub.name
                ? "bg-primary text-white"
                : "bg-background text-foreground"
            }`}
          >
            {sub.name} ({sub.count})
          </button>
        ))}
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="p-4 border rounded-lg shadow-sm bg-card"
            >
              <p className="font-semibold">{item.content}</p>
              {item.meaning && (
                <p className="text-muted-foreground">{item.meaning}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
