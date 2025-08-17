import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
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

  const capitalize = (word: string) => word.charAt(0).toUpperCase() + word.slice(1);

  return (
    <div className="min-h-screen bg-gray-700 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="font-wisdom text-5xl font-bold mb-2">Proverbs</h1>
          <p className="text-gray-300 text-lg mb-6">
            Traditional sayings that convey wisdom through generations
          </p>

          {/* AI Assistant */}
          <div className="mb-6">
            <AIAssistant category="Proverbs" />
          </div>
        </div>

        {/* Subcategory Buttons */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {counts.map((c) => (
            <button
              key={c.subcategory}
              onClick={() => {
                setSelectedSub(c.subcategory);
                setPage(1);
              }}
              className={`px-4 py-2 rounded-full border ${
                selectedSub === c.subcategory
                  ? 'bg-yellow-500 text-black font-bold'
                  : 'bg-gray-800 text-gray-300'
              }`}
            >
              {capitalize(c.subcategory)} ({c.count})
            </button>
          ))}
        </div>

        {/* All Proverbs Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold">All Proverbs</h2>
          <p className="text-yellow-400">{totalCount} proverbs found</p>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-gray-800 rounded-xl p-4 shadow-lg flex flex-col justify-between"
            >
              {/* Tag */}
              <div className="flex justify-between text-xs text-gray-400 mb-2">
                <span>PROVERB • {capitalize(item.subcategory)}</span>
                {item.region && (
                  <span className="bg-blue-600 px-2 py-0.5 rounded-full">{item.region}</span>
                )}
              </div>

              {/* Proverb Text */}
              <p className="text-yellow-300 text-lg font-medium mb-4">"{item.text}"</p>

              {/* Action Buttons */}
              <div className="flex justify-between text-gray-400 text-sm">
                <button>♡</button>
                <button>🔊</button>
                <button>Meaning</button>
                <button>🔖</button>
                <button>⤴</button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalCount > perPage && (
          <div className="flex gap-2 justify-center mt-8">
            {Array.from({ length: Math.ceil(totalCount / perPage) }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-3 py-1 rounded-full ${
                  page === i + 1 ? 'bg-yellow-500 text-black' : 'bg-gray-800 text-gray-300'
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
