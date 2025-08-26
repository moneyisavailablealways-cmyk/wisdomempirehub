import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { WisdomCard } from '@/components/WisdomCard';
import { useWisdomData } from '@/hooks/useWisdomData';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Search, Bot, Send, Loader2, X, Volume2, VolumeX, Minus, Mic, MicOff } from 'lucide-react';
import { useTTS } from '@/hooks/useTTS';

// Add type declarations for Speech Recognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}
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
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const responseRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { isPlaying: isPlayingAudio, togglePlayback } = useTTS();

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

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';
      recognitionInstance.onstart = () => {
        setIsListening(true);
      };
      recognitionInstance.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };
      recognitionInstance.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast({
          title: "Voice Input Error",
          description: "Could not process voice input. Please try again.",
          variant: "destructive"
        });
      };
      recognitionInstance.onend = () => {
        setIsListening(false);
      };
      setRecognition(recognitionInstance);
    }
  }, [toast]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('voice-assistant', {
        body: {
          message: input,
          category: category
        }
      });
      
      if (error) throw error;
      
      // Handle the new JSON response format
      if (data.text) {
        setResponse(data.text);
      } else {
        // Fallback for older response format
        setResponse(data.explanation || data || 'No response available.');
      }

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
  const handlePlayResponseAudio = async () => {
    if (!response) return;
    
    // Try to get the audio version from the last AI response
    try {
      const { data } = await supabase.functions.invoke('voice-assistant', {
        body: {
          message: input,
          category: category
        }
      });
      
      // Use the audio field if available, otherwise fall back to text response
      const audioText = data?.audio || response;
      togglePlayback(audioText);
    } catch (error) {
      // Fallback to regular response text
      togglePlayback(response);
    }
  };
  const handleVoiceInput = () => {
    if (!recognition) {
      toast({
        title: "Voice Not Supported",
        description: "Your browser doesn't support voice input.",
        variant: "destructive"
      });
      return;
    }
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
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
        Show Lovable AI Assistant
      </Button>;
  }
  return <div className={`transition-all duration-500 ease-in-out ${isVisible ? 'opacity-100 animate-fade-in' : 'opacity-0'}`} ref={responseRef}>
      <Card className="border-wisdom-gold/20 bg-violet-300">
        <CardContent className="p-6 bg-emerald-600 rounded-3xl my-0 py-0 px-0 relative">
          <div className="flex items-center justify-between mb-4 my-[15px] mx-[26px] rounded-none bg-emerald-600">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-wisdom-gold px-0 mx-[3px] my-0 py-0 bg-emerald-600" />
              <h3 className="font-semibold text-slate-50 px-0 text-left mx-0">Lovable AI Assistant</h3>
            </div>
          </div>
          
          <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isCollapsed ? 'max-h-0 opacity-0' : 'max-h-[1000px] opacity-100'}`}>
            <form onSubmit={handleSubmit} className="space-y-4 mx-[26px] mb-4">
              {/* Voice conversation button */}
              <div className="flex justify-center mb-4">
                <Button type="button" onClick={handleVoiceInput} disabled={isLoading} className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 ${isListening ? 'bg-red-600 hover:bg-red-700 animate-pulse' : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'} text-white shadow-lg hover:shadow-xl transform hover:scale-105`}>
                  {isListening ? <>
                      <MicOff className="h-5 w-5" />
                      <span>Listening... Tap to stop</span>
                    </> : <>
                      <Mic className="h-5 w-5" />
                      <span>Start Voice Conversation</span>
                    </>}
                </Button>
              </div>
              
              <div className="relative">
                <Input placeholder="Type your question or click the voice button above" value={input} onChange={e => setInput(e.target.value)} disabled={isLoading || isListening} className="pr-12 bg-slate-950" />
                <Button type="submit" size="sm" disabled={isLoading || !input.trim() || isListening} className="absolute right-1 top-1 h-8 w-8 p-0 text-zinc-950">
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </div>
              
              {response && <div className="mt-4 p-4 bg-background/50 rounded-lg border border-border animate-fade-in">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <p className="text-sm text-muted-foreground">Lovable Response:</p>
                    <Button variant="ghost" size="sm" onClick={handlePlayResponseAudio} disabled={isPlayingAudio} title={isPlayingAudio ? 'Stop audio' : 'Listen to response'} className={`shrink-0 h-8 w-8 p-0 transition-all duration-200 ${isPlayingAudio ? 'bg-green-100 text-green-700' : 'hover:bg-blue-100 hover:text-blue-700'}`}>
                      {isPlayingAudio ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    </Button>
                  </div>
                  <p className="text-foreground leading-relaxed">{response}</p>
                </div>}
            </form>
          </div>

          {/* Bottom-right buttons */}
          <div className="absolute bottom-2 right-2 flex gap-1">
            <Button variant="ghost" size="sm" onClick={handleToggleCollapse} title={isCollapsed ? 'Expand AI Assistant' : 'Collapse AI Assistant'} className="text-slate-50 h-6 w-6 p-0 bg-stone-950 hover:bg-stone-800">
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