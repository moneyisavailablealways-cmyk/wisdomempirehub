import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { WisdomCard } from '@/components/WisdomCard';
import { useWisdomData } from '@/hooks/useWisdomData';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Search, Bot, Send, Loader2, X, Volume2, VolumeX, Minus } from 'lucide-react';
interface AIAssistantProps {
  category: string;
}
export function AIAssistant({
  category
}: AIAssistantProps) {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState('');
  const [isVisible, setIsVisible] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const responseRef = useRef<HTMLDivElement>(null);
  const {
    toast
  } = useToast();

  // Load visibility and collapsed state from localStorage on mount
  useEffect(() => {
    const savedVisible = localStorage.getItem('ai-assistant-visible');
    const savedCollapsed = localStorage.getItem('ai-assistant-collapsed');
    if (savedVisible !== null) {
      setIsVisible(JSON.parse(savedVisible));
    }
    if (savedCollapsed !== null) {
      setIsCollapsed(JSON.parse(savedCollapsed));
    }
  }, []);

  // Save visibility state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('ai-assistant-visible', JSON.stringify(isVisible));
  }, [isVisible]);

  // Save collapsed state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('ai-assistant-collapsed', JSON.stringify(isCollapsed));
  }, [isCollapsed]);
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

      // Auto-scroll to response after a brief delay
      setTimeout(() => {
        if (responseRef.current) {
          responseRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }, 100);
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
  const handlePlayResponseAudio = () => {
    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }
    if (!response) return;
    try {
      setIsPlayingAudio(true);
      const utterance = new SpeechSynthesisUtterance(response);

      // Medium speed for consistency with cards
      utterance.pitch = 1.0;
      utterance.rate = 0.95;
      utterance.onend = () => {
        setIsPlayingAudio(false);
      };
      utterance.onerror = () => {
        setIsPlayingAudio(false);
        toast({
          title: "Audio Error",
          description: "Failed to play response audio",
          variant: "destructive"
        });
      };
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('Error playing response audio:', error);
      setIsPlayingAudio(false);
      toast({
        title: "Audio Error",
        description: "Failed to play response audio",
        variant: "destructive"
      });
    }
  };
  const handleClose = () => {
    setIsVisible(false);
  };
  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };
  const handleShow = () => {
    setIsVisible(true);
    // Auto-scroll to top when showing
    setTimeout(() => {
      if (responseRef.current) {
        responseRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 600); // Wait for fade-in animation
  };
  if (!isVisible) {
    return <Button onClick={handleShow} variant="outline" className="mb-4 transition-all duration-300 hover:scale-105">
        <Bot className="h-4 w-4 mr-2" />
        Show AI Assistant
      </Button>;
  }
  return <div className={`transition-all duration-500 ease-in-out ${isVisible ? 'opacity-100 animate-fade-in' : 'opacity-0'}`} ref={responseRef}>
      <Card className="border-wisdom-gold/20 bg-violet-300">
        <CardContent className="p-6 bg-emerald-600 rounded-3xl my-0 py-0 px-0 relative">
          <div className="flex items-center justify-between mb-4 my-[15px] mx-[26px] rounded-none bg-emerald-600">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-wisdom-gold px-0 mx-[3px] my-0 py-0 bg-emerald-600" />
              <h3 className="font-semibold text-slate-50 px-0 text-left mx-0">AI Assistant</h3>
            </div>
          </div>
          
          <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isCollapsed ? 'max-h-0 opacity-0' : 'max-h-[1000px] opacity-100'}`}>
            <form onSubmit={handleSubmit} className="space-y-4 mx-[26px] mb-4">
              <div className="relative">
                <Input placeholder="Ask for meaning, or submit a missing proverb, quote, idiom, or simile" value={input} onChange={e => setInput(e.target.value)} disabled={isLoading} className="pr-12 bg-slate-950" />
                <Button type="submit" size="sm" disabled={isLoading || !input.trim()} className="absolute right-1 top-1 h-8 w-8 p-0 text-zinc-950">
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </div>
              
              {response && <div className="mt-4 p-4 bg-background/50 rounded-lg border border-border animate-fade-in">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <p className="text-sm text-muted-foreground">AI Assistant Response:</p>
                    <Button variant="ghost" size="sm" onClick={handlePlayResponseAudio} disabled={isPlayingAudio} title={isPlayingAudio ? 'Stop audio' : 'Play response audio'} className="shrink-0 h-6 w-6 p-0">
                      {isPlayingAudio ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
                    </Button>
                  </div>
                  <p className="text-foreground leading-relaxed">{response}</p>
                </div>}
            </form>
          </div>

          {/* Bottom-right buttons */}
          <div className="absolute bottom-2 right-2 flex gap-1">
            <Button variant="ghost" size="sm" onClick={handleToggleCollapse} className="text-slate-50 hover:bg-emerald-700 h-6 w-6 p-0" title={isCollapsed ? 'Expand AI Assistant' : 'Collapse AI Assistant'}>
              <Minus className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleClose} className="text-slate-50 hover:bg-emerald-700 h-6 w-6 p-0" title="Close AI Assistant">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>;
}