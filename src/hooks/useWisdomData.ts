import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface WisdomItem {
  id: string;
  type: 'proverb' | 'quote' | 'idiom' | 'simile';
  subcategory: string;
  text: string;
  origin: string;
  video_url?: string;
  audio_voice_type?: 'child' | 'youth' | 'old';
  created_at: string;
}

export function useWisdomData() {
  const [items, setItems] = useState<WisdomItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock data for testing - remove this when you have real data
  const mockData: WisdomItem[] = [
    {
      id: '1',
      type: 'proverb',
      subcategory: 'Success',
      text: 'A journey of a thousand miles begins with a single step',
      origin: 'Chinese',
      created_at: '2024-01-01T00:00:00Z'
    },
    {
      id: '2',
      type: 'quote',
      subcategory: 'Life Advice',
      text: 'The only way to do great work is to love what you do',
      origin: 'Steve Jobs',
      created_at: '2024-01-02T00:00:00Z'
    },
    {
      id: '3',
      type: 'idiom',
      subcategory: 'Success',
      text: 'Break a leg',
      origin: 'English',
      created_at: '2024-01-03T00:00:00Z'
    },
    {
      id: '4',
      type: 'simile',
      subcategory: 'Emotion',
      text: 'As busy as a bee',
      origin: 'English',
      created_at: '2024-01-04T00:00:00Z'
    },
    {
      id: '5',
      type: 'proverb',
      subcategory: 'Time',
      text: 'Time heals all wounds',
      origin: 'Latin',
      created_at: '2024-01-05T00:00:00Z'
    }
  ];

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Try to fetch data from Supabase tables, fall back to mock data if no tables exist
      try {
        const [
          { data: proverbs, error: proverbsError },
          { data: quotes, error: quotesError },
          { data: idioms, error: idiomsError },
          { data: similes, error: similesError }
        ] = await Promise.all([
          supabase.from('proverbs').select('*').order('created_at', { ascending: false }),
          supabase.from('quotes').select('*').order('created_at', { ascending: false }),
          supabase.from('idioms').select('*').order('created_at', { ascending: false }),
          supabase.from('similes').select('*').order('created_at', { ascending: false })
        ]);

        // If we have any data from Supabase, use it
        if ((proverbs && proverbs.length > 0) || (quotes && quotes.length > 0) || 
            (idioms && idioms.length > 0) || (similes && similes.length > 0)) {
          
          const allItems: WisdomItem[] = [
            ...(proverbs || []).map(item => ({ 
              ...item, 
              type: 'proverb' as const,
              audio_voice_type: item.audio_voice_type as 'child' | 'youth' | 'old' | undefined,
              video_url: item.video_url || undefined
            })),
            ...(quotes || []).map(item => ({ 
              ...item, 
              type: 'quote' as const,
              audio_voice_type: item.audio_voice_type as 'child' | 'youth' | 'old' | undefined,
              video_url: item.video_url || undefined
            })),
            ...(idioms || []).map(item => ({ 
              ...item, 
              type: 'idiom' as const,
              audio_voice_type: item.audio_voice_type as 'child' | 'youth' | 'old' | undefined,
              video_url: item.video_url || undefined
            })),
            ...(similes || []).map(item => ({ 
              ...item, 
              type: 'simile' as const,
              audio_voice_type: item.audio_voice_type as 'child' | 'youth' | 'old' | undefined,
              video_url: item.video_url || undefined
            }))
          ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

          setItems(allItems);
        } else {
          // No real data, use mock data for testing
          setItems(mockData);
        }
      } catch (supabaseError) {
        // If Supabase fails, use mock data
        console.log('Using mock data for testing:', supabaseError);
        setItems(mockData);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const filteredItems = (filter: string) => {
    if (filter === 'all') return items;
    return items.filter(item => item.type === filter);
  };

  const getCounts = () => {
    return {
      proverbs: items.filter(item => item.type === 'proverb').length,
      quotes: items.filter(item => item.type === 'quote').length,
      idioms: items.filter(item => item.type === 'idiom').length,
      similes: items.filter(item => item.type === 'simile').length,
    };
  };

  return {
    items,
    loading,
    error,
    filteredItems,
    getCounts,
    refetch: fetchAllData
  };
}