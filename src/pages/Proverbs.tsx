import React, { useEffect, useState } from 'react';
import { supabase } from '..integrations/supabaseClient';
import { AIAssistant } from '@/components/AIAssistant';
import { DownloadButton } from '@/components/DownloadButton';

const subcategoryMap: Record<string, string[]> = {
  proverbs: ['Fear', 'Success', 'Time', 'Love', 'Money', 'Wisdom', 'Trust', 'Friendship'],
};

const Proverbs = () => {
  const table = 'proverbs';
  const [counts, setCounts] = useState<{ subcategory: string; count: number }[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [selectedSub, setSelectedSub] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const perPage = 21;
  const [totalCount, setTotalCount] = useState(0);

  // ✅ Load subcategory counts
  useEffect(() => {
    async function fetchCounts() {
      const subs = subcategoryMap[table];
      const results: { subcategory: string; count: number }[] = [];
      for (const sub of subs) {
        const { count } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true })
          .eq('subcategory', sub);
        results.push({ subcategory: sub, count: count || 0 });
      }
      setCounts(results);
    }
    fetchCounts();
  }, [table]);

  // ✅ Load items when subcategory/page changes
  useEffect(() => {
    if (!selectedSub) return;
    async function fetchItems() {
      const from = (page - 1) * perPage;
      const to = from + perPage - 1;

      const { data, count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact' })
        .eq('subcategory', selectedSub)
        .range(from, to)
        .order('id', { ascending: true });

      if (!error && data) {
        setItems(data);
        setTotalCount(count || 0);
      }
    }
    fetchItems();
  }, [selectedSub, page, table]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="font-wisdom text-foreground font-bold text-5xl">Proverbs</h1>
            <DownloadButton category="proverbs" />
          </div>
          <p className="text-lg mb-6 text-center text-muted-foreground">
            Traditional sayings that convey wisdom through generations
          </p>

          {/* AI Assistant */}
          <AIAssistant category="Proverbs" />
        </div>

        {/* Subcategory Buttons */}
        <div className="flex flex-wrap gap-2 mb-6">
          {counts.map((c) => (
            <button
              key={c.subcategory}
              onClick={() => {
                setSelectedSub(c.subcategory);
                setPage(1);
              }}
              className={`px-4 py-2 rounded-xl border ${
                selectedSub === c.subcategory ? 'bg-primary text-white' : 'bg-card'
              }`}
            >
              {c.subcategory} ({c.count})
            </button>
          ))}
        </div>

        {/* Items List */}
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <li key={item.id} className="p-4 rounded-xl shadow bg-card">
              {item.text}
            </li>
          ))}
        </ul>

        {/* Pagination */}
        {totalCount > perPage && (
          <div className="flex gap-2 justify-center mt-6">
            {Array.from({ length: Math.ceil(totalCount / perPage) }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-3 py-1 rounded ${
                  page === i + 1 ? 'bg-primary text-white' : 'bg-card'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Proverbs;
