import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { WisdomCard } from '@/components/WisdomCard';
import { useWisdomData } from '@/hooks/useWisdomData';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Search, Bot, Send, Loader2 } from 'lucide-react';
interface AIAssistantProps {
  category: string;
}
export function AIAssistant({
  category
}: AIAssistantProps) {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState('');
  const {
    toast
  } = useToast();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setIsLoading(true);
    try {
      const {
        data,
        error
      } = await supabase.functions.invoke('explain-wisdom', {
        body: {
          text: input,
          type: 'user_query',
          origin: `${category} category`
        }
      });
      if (error) throw error;
      setResponse(data.explanation);
      toast({
        description: "AI assistant response ready! 🤖",
        duration: 3000
      });
    } catch (error) {
      console.error('Error getting AI response:', error);
      toast({
        title: "AI Assistant Error",
        description: "Failed to get response from AI assistant",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  return <Card className="border-wisdom-gold/20 bg-wisdom-gold/5">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4 bg-gray-200">
          <Bot className="h-5 w-5 text-wisdom-gold bg-zinc-950" />
          <h3 className="font-semibold text-zinc-950">AI Assistant</h3>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Input placeholder="Ask for meaning, or submit a missing proverb, quote, idiom, or simile" value={input} onChange={e => setInput(e.target.value)} className="pr-12" disabled={isLoading} />
            <Button type="submit" size="sm" className="absolute right-1 top-1 h-8 w-8 p-0" disabled={isLoading || !input.trim()}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
          
          {response && <div className="mt-4 p-4 bg-background/50 rounded-lg border border-border">
              <p className="text-sm text-muted-foreground mb-2">AI Assistant Response:</p>
              <p className="text-foreground">{response}</p>
            </div>}
        </form>
      </CardContent>
    </Card>;
}