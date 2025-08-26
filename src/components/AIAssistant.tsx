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
  const [isVisible, setIsVisible] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const responseRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { isPlaying: isPlayingAudio, togglePlayback } = useTTS();

  useEffect(() => {
    const savedVisible = localStorage.getItem('ai-assistant-visible');
    const savedCollapsed = localStorage.getItem('ai-assistant-collapsed');
    if (savedVisible) setIsVisible(JSON.parse(savedVisible));
    if (savedCollapsed) setIsCollapsed(JSON.parse(savedCollapsed));
  }, []);

  useEffect(() => {
    localStorage.setItem('ai-assistant-visible', JSON.stringify(isVisible));
  }, [isVisible]);

  useEffect(() => {
    localStorage.setItem('ai-assistant-collapsed', JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  // --- Improved Speech Recognition ---
  useEffect(() => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognitionInstance = new SpeechRecognition();
    recognitionInstance.continuous = true;
    recognitionInstance.interimResults = true;
    recognitionInstance.lang = 'en-US';
    recognitionInstance.maxAlternatives = 5;

    let finalTranscript = '';
    let debounceTimer: number | null = null;

    recognitionInstance.onstart = () => setIsListening(true);

    recognitionInstance.onresult = (event: any) => {
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptChunk = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcriptChunk + ' ';
        } else {
          interimTranscript += transcriptChunk;
        }
      }

      setInput(finalTranscript + interimTranscript);

      if (debounceTimer) clearTimeout(debounceTimer);

      debounceTimer = window.setTimeout(() => {
        if (finalTranscript.trim()) {
          handleAIResponse(finalTranscript.trim());
          finalTranscript = '';
          setInput('');
        }
      }, 1000);
    };

    recognitionInstance.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      toast({ title: "Voice Input Error", description: "Could not process voice input.", variant: "destructive" });
    };

    recognitionInstance.onend = () => setIsListening(false);

    setRecognition(recognitionInstance);
  }, [category, toast]);

  const handleVoiceInput = () => {
    if (!recognition) {
      toast({ title: "Voice Not Supported", description: "Your browser doesn't support voice input.", variant: "destructive" });
      return;
    }
    isListening ? recognition.stop() : recognition.start();
  };

  // --- Unified function for AI + TTS ---
  const handleAIResponse = async (message: string) => {
    setIsLoading(true);
    try {
      const { data } = await supabase.functions.invoke('voice-assistant', { body: { message, category } });
      const textResponse = data.text || message;
      setResponse(textResponse);

      // Call your TTS endpoint
      const ttsRes = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: data.audio || textResponse })
      });
      const ttsData = await ttsRes.json();
      if (ttsData.audioContent) {
        togglePlayback(ttsData.audioContent);
      }

    } catch (err) {
      console.error('AI/TTS error:', err);
      toast({ title: "Error", description: "Failed to get AI response or generate audio.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    handleAIResponse(input.trim());
    setInput('');
  };

  const handlePlayResponseAudio = async () => {
    if (!response) return;
    try {
      const ttsRes = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: response })
      });
      const ttsData = await ttsRes.json();
      if (ttsData.audioContent) togglePlayback(ttsData.audioContent);
    } catch {
      togglePlayback(response);
    }
  };

  const handleClose = () => setIsVisible(false);
  const handleToggleCollapse = () => setIsCollapsed(!isCollapsed);
  const handleShow = () => setIsVisible(true);

  if (!isVisible) {
    return <Button onClick={handleShow} variant="outline" className="mb-4">
      <Bot className="h-4 w-4 mr-2" /> Wisdom AI Assistant
    </Button>;
  }

  return (
    <div ref={responseRef}>
      <Card className="border-wisdom-gold/20 bg-violet-300">
        <CardContent className="p-6 bg-emerald-600 rounded-3xl relative">
          <div className="flex items-center gap-2 mb-4">
            <Bot className="h-5 w-5 text-wisdom-gold" />
            <h3 className="font-semibold text-slate-50">Lovable AI Assistant</h3>
          </div>

          <div className={`transition-all ${isCollapsed ? 'max-h-0 opacity-0' : 'max-h-[1000px] opacity-100'}`}>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex justify-center mb-4">
                <Button type="button" onClick={handleVoiceInput} disabled={isLoading} className={`flex items-center gap-2 px-6 py-3 rounded-full ${isListening ? 'bg-red-600 animate-pulse' : 'bg-gradient-to-r from-blue-600 to-purple-600'}`}>
                  {isListening ? <><MicOff className="h-5 w-5" /><span>Listening...</span></> : <><Mic className="h-5 w-5" /><span>Start Voice Conversation</span></>}
                </Button>
              </div>

              <div className="relative">
                <Input placeholder="Type your question" value={input} onChange={e => setInput(e.target.value)} disabled={isLoading || isListening} />
                <Button type="submit" size="sm" disabled={isLoading || !input.trim() || isListening} className="absolute right-1 top-1">
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </div>

              {response && (
                <div className="mt-4 p-4 bg-background/50 rounded-lg border">
                  <div className="flex justify-between mb-2">
                    <p className="text-sm text-muted-foreground">Lovable Response:</p>
                    <Button variant="ghost" size="sm" onClick={handlePlayResponseAudio} disabled={isPlayingAudio}>
                      {isPlayingAudio ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    </Button>
                  </div>
                  <p>{response}</p>
                </div>
              )}
            </form>
          </div>

          <div className="absolute bottom-2 right-2 flex gap-1">
            <Button variant="ghost" size="sm" onClick={handleToggleCollapse}><Minus className="h-4 w-4" /></Button>
            <Button variant="ghost" size="sm" onClick={handleClose}><X className="h-4 w-4" /></Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
