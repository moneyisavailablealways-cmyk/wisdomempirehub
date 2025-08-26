import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Bot, Send, Loader2, X, Volume2, VolumeX, Minus, Mic, MicOff } from 'lucide-react';
import { useTTS } from '@/hooks/useTTS';

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface AIAssistantProps {
  category: string;
}

export function AIAssistant({ category }: AIAssistantProps) {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const responseRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { isPlaying: isPlayingAudio, togglePlayback } = useTTS();

  // Load visibility & collapse state
  useEffect(() => {
    const savedVisible = localStorage.getItem('ai-assistant-visible');
    const savedCollapsed = localStorage.getItem('ai-assistant-collapsed');
    if (savedVisible !== null) setIsVisible(JSON.parse(savedVisible));
    if (savedCollapsed !== null) setIsCollapsed(JSON.parse(savedCollapsed));
  }, []);

  useEffect(() => {
    localStorage.setItem('ai-assistant-visible', JSON.stringify(isVisible));
  }, [isVisible]);

  useEffect(() => {
    localStorage.setItem('ai-assistant-collapsed', JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';
      recognitionInstance.onstart = () => setIsListening(true);
      recognitionInstance.onresult = async (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
        await handleVoiceQuery(transcript); // Auto-send transcript to AI and play voice
      };
      recognitionInstance.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast({ title: "Voice Input Error", description: "Could not process voice input.", variant: "destructive" });
      };
      recognitionInstance.onend = () => setIsListening(false);
      setRecognition(recognitionInstance);
    }
  }, [toast]);

  const handleVoiceQuery = async (voiceText: string) => {
    if (!voiceText.trim()) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('voice-assistant', {
        body: { message: voiceText, category }
      });
      if (error) throw error;

      const textResponse = data.text || data.explanation || 'No response available.';
      const audioResponse = data.audio || textResponse;

      setResponse(textResponse);
      togglePlayback(audioResponse); // Auto-play AI voice
      scrollToResponse();

    } catch (err) {
      console.error('AI voice query error:', err);
      toast({ title: "Error", description: "Failed to get AI voice response.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleVoiceQuery(input);
  };

  const handlePlayResponseAudio = () => {
    if (!response) return;
    togglePlayback(response);
  };

  const handleVoiceInput = () => {
    if (!recognition) return toast({ title: "Voice Not Supported", description: "Your browser doesn't support voice input.", variant: "destructive" });
    isListening ? recognition.stop() : recognition.start();
  };

  const scrollToResponse = () => {
    setTimeout(() => {
      responseRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleClose = () => setIsVisible(false);
  const handleToggleCollapse = () => setIsCollapsed(!isCollapsed);
  const handleShow = () => setIsVisible(true);

  if (!isVisible) {
    return <Button onClick={handleShow} variant="outline" className="mb-4 flex items-center gap-2"><Bot className="h-4 w-4"/> AI Assistant</Button>;
  }

  return (
    <div ref={responseRef} className={`transition-all duration-500 ${isVisible ? 'opacity-100 animate-fade-in' : 'opacity-0'}`}>
      <Card className="border-wisdom-gold/20 bg-violet-300">
        <CardContent className="p-6 bg-emerald-600 rounded-3xl relative">
          <div className="flex items-center gap-2 mb-4">
            <Bot className="h-5 w-5 text-wisdom-gold"/>
            <h3 className="text-slate-50 font-semibold">Lovable AI Assistant</h3>
          </div>

          <div className={`overflow-hidden transition-all duration-500 ${isCollapsed ? 'max-h-0 opacity-0' : 'max-h-[1000px] opacity-100'}`}>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Voice-to-Voice Conversation */}
              <Button type="button" onClick={handleVoiceInput} disabled={isLoading} className={`flex items-center gap-2 px-6 py-3 rounded-full ${isListening ? 'bg-red-600 animate-pulse' : 'bg-blue-600'} text-white`}>
                {isListening ? <><MicOff className="h-5 w-5"/> Listening...</> : <><Mic className="h-5 w-5"/> Start Voice Conversation</>}
              </Button>

              {/* Text Input */}
              <div className="relative">
                <Input placeholder="Type your question" value={input} onChange={e => setInput(e.target.value)} disabled={isLoading || isListening}/>
                <Button type="submit" size="sm" disabled={isLoading || !input.trim() || isListening} className="absolute right-1 top-1 h-8 w-8 p-0">
                  {isLoading ? <Loader2 className="animate-spin h-4 w-4"/> : <Send className="h-4 w-4"/>}
                </Button>
              </div>

              {/* AI Response & Text-to-Speech Button */}
              {response && (
                <div className="mt-4 p-4 bg-background/50 rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-muted-foreground">Lovable Response:</p>
                    <Button size="sm" variant="ghost" onClick={handlePlayResponseAudio} disabled={isPlayingAudio} className="h-8 w-8 p-0">
                      {isPlayingAudio ? <VolumeX className="h-4 w-4"/> : <Volume2 className="h-4 w-4"/>}
                    </Button>
                  </div>
                  <p>{response}</p>
                </div>
              )}
            </form>
          </div>

          {/* Bottom-right controls */}
          <div className="absolute bottom-2 right-2 flex gap-1">
            <Button variant="ghost" size="sm" onClick={handleToggleCollapse}><Minus className="h-4 w-4"/></Button>
            <Button variant="ghost" size="sm" onClick={handleClose}><X className="h-4 w-4"/></Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
