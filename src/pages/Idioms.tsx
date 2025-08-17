import React, { useEffect, useState } from 'react';
import { AIAssistant } from '@/components/AIAssistant';
import { DownloadButton } from '@/components/DownloadButton';
import { supabase } from '../integration/supabase/client';

interface SubcategoryCount {
  name: string;
  count: number;
}

const Idioms = () => {
  const [subcategories, setSubcategories] = useState<SubcategoryCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubcategoryCounts = async () => {
      setLoading(true);
      setError(null);

      try {
        const categories = ['Success', 'Relationship', 'Emotions', 'Work', 'Time', 'Life', 'Friendship'];
        const results: SubcategoryCount[] = [];

        for (const category of categories) {
          const { count, error } = await supabase
            .from('idioms')
            .select('id', { count: 'exact' })
            .eq('subcategory', category);

          if (error) throw error;

          results.push({ name: category, count });
        }

        setSubcategories(results);
      } catch (err: any) {
        console.error(err);
        setError('Failed to fetch subcategory counts.');
      } finally {
        setLoading(false);
      }
    };

    fetchSubcategoryCounts();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="font-wisdom text-foreground font-bold text-5xl">Idioms</h1>
            <DownloadButton category="idioms" />
          </div>
          <p className="text-lg mb-6 text-center text-muted-foreground">
            Cultural expressions with meanings that differ from literal interpretation
          </p>

          {/* AI Assistant */}
          <AIAssistant category="Idioms" />
        </div>

        {/* Subcategory Buttons */}
        <div className="flex flex-wrap gap-4 mb-6 justify-center">
          {loading && <p>Loading subcategories...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {!loading && !error &&
            subcategories.map((sub) => (
              <button
                key={sub.name}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition"
              >
                {sub.name} {sub.count}
              </button>
            ))
          }
        </div>
      </div>
    </div>
  );
};

export default Idioms;
