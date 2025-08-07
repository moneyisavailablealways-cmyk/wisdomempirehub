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

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch data from all tables
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

      // Check for errors
      if (proverbsError || quotesError || idiomsError || similesError) {
        throw new Error('Failed to fetch wisdom data');
      }

      // Combine all data with proper typing
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