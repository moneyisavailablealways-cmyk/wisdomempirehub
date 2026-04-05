import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { WisdomCard } from '@/components/WisdomCard';
import { WisdomCardSkeleton } from '@/components/WisdomCardSkeleton';
import { AddWisdomForm } from '@/components/AddWisdomForm';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Plus, BookOpen, Quote, MessageSquare, Sparkles, LogOut } from 'lucide-react';

const SELECT_FIELDS = 'id,type,subcategory,text,origin,created_at,video_url,audio_voice_type';

interface WisdomItem {
  id: string;
  type: 'proverb' | 'quote' | 'idiom' | 'simile';
  subcategory: string;
  text: string;
  origin: string;
  created_at: string;
  video_url?: string;
  audio_voice_type?: 'child' | 'youth' | 'old';
}

export default function Profile() {
  const { user, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [contributions, setContributions] = useState<WisdomItem[]>([]);
  const [loadingContributions, setLoadingContributions] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth?returnTo=/profile');
    }
  }, [user, authLoading, navigate]);

  const fetchContributions = async () => {
    if (!user) return;
    setLoadingContributions(true);

    const [{ data: p }, { data: q }, { data: i }, { data: s }] = await Promise.all([
      supabase.from('proverbs').select(SELECT_FIELDS).eq('user_id', user.id).order('created_at', { ascending: false }).limit(20),
      supabase.from('quotes').select(SELECT_FIELDS).eq('user_id', user.id).order('created_at', { ascending: false }).limit(20),
      supabase.from('idioms').select(SELECT_FIELDS).eq('user_id', user.id).order('created_at', { ascending: false }).limit(20),
      supabase.from('similes').select(SELECT_FIELDS).eq('user_id', user.id).order('created_at', { ascending: false }).limit(20),
    ]);

    const all = [
      ...(p || []).map(x => ({ ...x, type: 'proverb' as const })),
      ...(q || []).map(x => ({ ...x, type: 'quote' as const })),
      ...(i || []).map(x => ({ ...x, type: 'idiom' as const })),
      ...(s || []).map(x => ({ ...x, type: 'simile' as const })),
    ] as WisdomItem[];

    setContributions(all.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
    setLoadingContributions(false);
  };

  useEffect(() => {
    if (user) fetchContributions();
  }, [user]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const userInitials = user.user_metadata?.name
    ? user.user_metadata.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()
    : user.email?.[0]?.toUpperCase() || 'U';

  const stats = {
    proverbs: contributions.filter(c => c.type === 'proverb').length,
    quotes: contributions.filter(c => c.type === 'quote').length,
    idioms: contributions.filter(c => c.type === 'idiom').length,
    similes: contributions.filter(c => c.type === 'simile').length,
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl space-y-8">
        {/* Profile Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user.user_metadata?.avatar_url} />
                <AvatarFallback className="text-2xl bg-primary/10 text-primary font-bold">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div className="text-center sm:text-left flex-1 space-y-1">
                <h1 className="text-2xl font-bold font-wisdom">
                  {user.user_metadata?.name || 'Wisdom Contributor'}
                </h1>
                <p className="text-muted-foreground">{user.email}</p>
                <p className="text-sm text-muted-foreground">
                  {contributions.length} contribution{contributions.length !== 1 ? 's' : ''} to the wisdom library
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={signOut}>
                  <LogOut className="h-4 w-4 mr-1" />
                  Log Out
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Proverbs', count: stats.proverbs, icon: BookOpen },
            { label: 'Quotes', count: stats.quotes, icon: Quote },
            { label: 'Idioms', count: stats.idioms, icon: MessageSquare },
            { label: 'Similes', count: stats.similes, icon: Sparkles },
          ].map(s => (
            <Card key={s.label} className="text-center">
              <CardContent className="p-4">
                <s.icon className="h-5 w-5 mx-auto mb-2 text-primary" />
                <p className="text-2xl font-bold">{s.count}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Add Wisdom Button */}
        <div className="flex justify-center">
          <Button
            variant="wisdom"
            size="lg"
            className="gap-2 text-base px-8 h-14 rounded-full shadow-lg hover:shadow-xl transition-all"
            onClick={() => setShowForm(true)}
          >
            <Plus className="h-5 w-5" />
            Add Wisdom
          </Button>
        </div>

        {/* Contributions */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold font-wisdom">Your Contributions</h2>
          {loadingContributions ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => <WisdomCardSkeleton key={i} />)}
            </div>
          ) : contributions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {contributions.map(item => <WisdomCard key={item.id} item={item} />)}
            </div>
          ) : (
            <Card className="text-center py-12">
              <CardContent className="space-y-4">
                <Sparkles className="h-12 w-12 mx-auto text-muted-foreground" />
                <CardTitle className="text-lg">No contributions yet</CardTitle>
                <CardDescription>
                  Be the first to share your wisdom with the world. Your voice matters!
                </CardDescription>
                <Button variant="wisdom" onClick={() => setShowForm(true)} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Share Your First Wisdom
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Add Wisdom Modal */}
      {showForm && (
        <AddWisdomForm
          onClose={() => setShowForm(false)}
          onSuccess={fetchContributions}
        />
      )}
    </div>
  );
}
