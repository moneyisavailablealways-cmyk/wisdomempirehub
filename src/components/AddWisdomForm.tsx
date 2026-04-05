import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, Send, AlertCircle, CheckCircle2, X } from 'lucide-react';

const TYPES = [
  { value: 'proverb', label: 'Proverb', table: 'proverbs' },
  { value: 'quote', label: 'Quote', table: 'quotes' },
  { value: 'idiom', label: 'Idiom', table: 'idioms' },
  { value: 'simile', label: 'Simile', table: 'similes' },
] as const;

const CATEGORIES = [
  'Love', 'Life', 'Wisdom', 'Success', 'Time', 'Money', 'Fear',
  'Trust', 'Friendship', 'Animals', 'Family', 'Health', 'Education',
  'Courage', 'Patience', 'Hard Work', 'Unity', 'Justice', 'Faith', 'Nature',
];

const REGIONS = [
  'Africa', 'Europe', 'Asia', 'North America', 'South America',
  'Middle East', 'Oceania', 'Caribbean', 'Universal',
];

type TableName = 'proverbs' | 'quotes' | 'idioms' | 'similes';

interface AddWisdomFormProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export function AddWisdomForm({ onClose, onSuccess }: AddWisdomFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();

  const [type, setType] = useState('');
  const [category, setCategory] = useState('');
  const [region, setRegion] = useState('');
  const [text, setText] = useState('');
  const [meaning, setMeaning] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);
  const [duplicateMessage, setDuplicateMessage] = useState('');

  const checkDuplicate = async (table: TableName, wisdomText: string): Promise<boolean> => {
    const trimmed = wisdomText.trim().toLowerCase();
    // Check for exact or very similar match
    const { data } = await supabase
      .from(table)
      .select('id, text')
      .ilike('text', `%${trimmed.slice(0, 50)}%`)
      .limit(10);

    if (data && data.length > 0) {
      // Check for close match
      const match = data.find(item =>
        item.text.toLowerCase().trim() === trimmed ||
        item.text.toLowerCase().trim().includes(trimmed) ||
        trimmed.includes(item.text.toLowerCase().trim())
      );
      return !!match;
    }
    return false;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setDuplicateMessage('');
    setLoading(true);

    try {
      const typeConfig = TYPES.find(t => t.value === type);
      if (!typeConfig) return;

      const table = typeConfig.table;

      // Check for duplicates
      const isDuplicate = await checkDuplicate(table, text);
      if (isDuplicate) {
        setDuplicateMessage(
          '✨ This wisdom already lives in our collection. Try sharing a new one!'
        );
        setLoading(false);
        return;
      }

      const { error } = await supabase.from(table).insert({
        text: text.trim(),
        meaning: meaning.trim() || null,
        subcategory: category,
        origin: region,
        type: typeConfig.value,
        user_id: user.id,
      });

      if (error) throw error;

      toast({
        title: '🌟 Wisdom Added!',
        description: 'Your contribution has been saved. Thank you for sharing your wisdom!',
      });

      // Reset form
      setType('');
      setCategory('');
      setRegion('');
      setText('');
      setMeaning('');
      setTags('');
      onSuccess?.();
      onClose();
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to submit. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const isValid = type && category && region && text.trim().length >= 10;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto animate-in fade-in-0 zoom-in-95 duration-300">
        <CardHeader className="relative pb-4">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-primary/10">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl font-wisdom">Share Your Wisdom</CardTitle>
              <CardDescription>
                Contribute to our growing library of cultural wisdom
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Type */}
            <div className="space-y-2">
              <Label htmlFor="type">Type *</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {TYPES.map(t => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(c => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Region */}
            <div className="space-y-2">
              <Label htmlFor="region">Region / Origin *</Label>
              <Select value={region} onValueChange={setRegion}>
                <SelectTrigger>
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  {REGIONS.map(r => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Main Text */}
            <div className="space-y-2">
              <Label htmlFor="text">Wisdom Text *</Label>
              <Textarea
                id="text"
                placeholder="Enter the proverb, quote, idiom, or simile..."
                value={text}
                onChange={e => { setText(e.target.value); setDuplicateMessage(''); }}
                className="min-h-[100px]"
                maxLength={500}
                required
              />
              <p className="text-xs text-muted-foreground text-right">{text.length}/500</p>
            </div>

            {/* Meaning */}
            <div className="space-y-2">
              <Label htmlFor="meaning">Meaning / Explanation</Label>
              <Textarea
                id="meaning"
                placeholder="Explain the meaning or context of this wisdom..."
                value={meaning}
                onChange={e => setMeaning(e.target.value)}
                className="min-h-[80px]"
                maxLength={1000}
              />
            </div>

            {/* Tags (optional) */}
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (optional)</Label>
              <Input
                id="tags"
                placeholder="e.g., inspirational, ancient, motivational"
                value={tags}
                onChange={e => setTags(e.target.value)}
                maxLength={200}
              />
            </div>

            {/* Duplicate Warning */}
            {duplicateMessage && (
              <div className="flex items-start gap-3 p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
                <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                <p className="text-sm text-destructive">{duplicateMessage}</p>
              </div>
            )}

            {/* Submit */}
            <Button
              type="submit"
              className="w-full h-12 text-base gap-2"
              variant="wisdom"
              disabled={!isValid || loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Checking & Saving...
                </span>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Contribute Wisdom
                </>
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              Your submission helps grow a diverse collection of cultural wisdom. Thank you! 🌍
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
