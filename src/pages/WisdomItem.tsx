import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { SEOHead } from '@/components/SEOHead';
import { WisdomCard } from '@/components/WisdomCard';
import { generateWisdomTitle, generateWisdomDescription, generateWisdomKeywords } from '@/utils/seoUtils';
import { Loader2 } from 'lucide-react';

interface WisdomItemData {
  id: string;
  type: 'proverb' | 'quote' | 'idiom' | 'simile';
  text: string;
  origin: string;
  subcategory: string;
  video_url?: string;
  audio_voice_type?: 'child' | 'youth' | 'old';
  created_at: string;
}

// Convert to WisdomCard compatible format
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

export default function WisdomItemPage() {
  const { type, id } = useParams<{ type: string; id: string }>();
  const [item, setItem] = useState<WisdomItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchItem() {
      if (!type || !id) return;

      const validTypes = ['proverbs', 'quotes', 'idioms', 'similes'] as const;
      const tableName = validTypes.find(t => t === type) as typeof validTypes[number] | undefined;
      
      if (!tableName) {
        setError('Invalid item type');
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;

        if (data) {
          const wisdomType = tableName.slice(0, -1) as WisdomItem['type'];
          setItem({
            id: data.id,
            type: wisdomType,
            text: data.text,
            origin: data.origin,
            subcategory: data.subcategory,
            video_url: data.video_url,
            audio_voice_type: data.audio_voice_type as 'child' | 'youth' | 'old' | undefined,
            created_at: data.created_at
          });
        } else {
          setError('Item not found');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load item');
      } finally {
        setLoading(false);
      }
    }

    fetchItem();
  }, [type, id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-amber-400" />
      </div>
    );
  }

  if (error || !item) {
    return <Navigate to="/404" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900">
      <SEOHead
        title={generateWisdomTitle(item)}
        description={generateWisdomDescription(item)}
        keywords={generateWisdomKeywords(item)}
        type="article"
        canonical={`${window.location.origin}/${type}/${id}`}
      />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <WisdomCard
            item={item}
          />
        </div>
      </div>
    </div>
  );
}