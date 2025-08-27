import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Bot, Send, Volume2, VolumeX, Minus, Mic, MicOff, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
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

const VOICES = ['Adams', 'Leo', 'Bella', 'Default'];

const voiceMapping: Record<string, string> = {
  Adams: 'onyx',
  Leo: 'alloy',
  Bella: 'nova',
  Default: 'echo'
};

export function AIAssistant({ category }: AIAssistantProps) {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [isVisible, setIsVisible] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [selectedVoice, setSelectedVoice] = useState('Adams');
  const responseRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { isPlaying, togglePlayback } = useTTS();

  // Load visibility & collapsed state
  useEffect(() => {
    const savedVisible = localStorage.getItem('ai-assistant-visible');
    const savedCollapsed = localStorage.getItem('ai-assistant-collapsed');
    if (savedVisible) setIsVisible(JSON.parse(savedVisible));
    if (savedCollapsed) setIsCollapsed(JSON.parse(savedCollapsed));
  }, []);

  useEffect(() => { localStorage.setItem('ai-assistant-visible', JSON.stringify(isVisible)); }, [isVisible]);
  useEffect(() => { localStorage.setItem('ai-assistant-collapsed', JSON.stringify(isCollapsed)); }, [isCollapsed]);

  // --- Speech Recognition ---
  useEffect(() => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognitionInstance = new SpeechRecognition();
    recognitionInstance.continuous = false;
    recognitionInstance.interimResults = true;
    recognitionInstance.lang = 'en-US';

    let finalTranscript = '';

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
    };

    recognitionInstance.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      toast({ title: "Voice Input Error", description: "Could not process voice input.", variant: "destructive" });
    };

    recognitionInstance.onend = () => {
      setIsListening(false);
      if (finalTranscript.trim()) {
        fetchAIResponse(finalTranscript.trim());
        finalTranscript = '';
        setInput('');
      }
    };

    setRecognition(recognitionInstance);
  }, [toast, category]);

  const handleVoiceInput = () => {
    if (!recognition) return toast({ title: "Voice Not Supported", description: "Your browser doesn't support voice input.", variant: "destructive" });
    isListening ? recognition.stop() : recognition.start();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    fetchAIResponse(input.trim());
    setInput('');
  };

  const fetchAIResponse = async (message: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('voice-assistant', {
        body: { message, category, voice: voiceMapping[selectedVoice] || 'onyx' }
      });

      if (error) throw error;

      const aiText = data?.text || data?.explanation || 'No response available.';
      setResponse(aiText);

      setTimeout(() => responseRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);

      togglePlayback(aiText, voiceMapping[selectedVoice] || 'onyx');

    } catch (err) {
      console.error('AI Assistant Error:', err);
      toast({ title: "AI Assistant Error", description: "Failed to get response.", variant: "destructive" });
    }
  };

  const handlePlayResponseAudio = () => {
    if (!response) return;
    togglePlayback(response, voiceMapping[selectedVoice] || 'onyx');
  };

  const handleClose = () => setIsVisible(false);
  const handleToggleCollapse = () => setIsCollapsed(!isCollapsed);
  const handleShow = () => setIsVisible(true);

  if (!isVisible) {
    return <Button onClick={handleShow} variant="outline" className="mb-4 transition-all hover:scale-105"><Bot className="h-4 w-4 mr-2" />Wisdom AI Assistant</Button>;
  }

  return (
    <div ref={responseRef}>
      <Card className="border-wisdom-gold/20 bg-violet-300">
        <CardContent className="p-6 bg-emerald-600 rounded-3xl relative">

          {/* Header */}
          <div className="flex items-center gap-2 mb-4">
            <Bot className="h-5 w-5 text-wisdom-gold" />
            <h3 className="font-semibold text-slate-50">Lovable AI Assistant</h3>
          </div>

          {/* Collapsible Content */}
          <div className={`overflow-hidden transition-all duration-500 ${isCollapsed ? 'max-h-0 opacity-0' : 'max-h-[1000px] opacity-100'}`}>
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Voice Conversation */}
              <div className="flex justify-center mb-2">
                <Button type="button" onClick={handleVoiceInput} disabled={isListening} className={`flex items-center gap-2 px-6 py-3 rounded-full ${isListening ? 'bg-red-600 animate-pulse' : 'bg-gradient-to-r from-blue-600 to-purple-600'}`}>
                  {isListening ? <><MicOff className="h-5 w-5" />Listening...</> : <><Mic className="h-5 w-5" />Start Voice Conversation</>}
                </Button>
              </div>

              {/* Text Input */}
              <div className="relative">
                <Input placeholder="Type your question or use voice" value={input} onChange={e => setInput(e.target.value)} className="pr-12 bg-slate-950" />
                <Button type="submit" size="sm" className="absolute right-1 top-1 h-8 w-8 p-0">
                  <Send className="h-4 w-4" />
                </Button>
              </div>

              {/* Voice Selection */}
              <div className="flex gap-2 mt-2">
                {VOICES.map(v => (
                  <Button key={v} size="sm" variant={v === selectedVoice ? "default" : "outline"} onClick={() => setSelectedVoice(v)}>
                    {v}
                  </Button>
                ))}
              </div>

              {/* AI Response */}
              {response && (
                <div className="mt-4 p-4 bg-background/50 rounded-lg border">
                  <div className="flex justify-between mb-2">
                    <p className="text-sm text-muted-foreground">Lovable Response:</p>
                    <Button variant="ghost" size="sm" onClick={handlePlayResponseAudio} disabled={isPlaying}>
                      {isPlaying ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    </Button>
                  </div>
                  <p className="text-foreground leading-relaxed">{response}</p>
                </div>
              )}
            </form>
          </div>

          {/* Bottom-right controls */}
          <div className="absolute bottom-2 right-2 flex gap-1">
            <Button variant="ghost" size="sm" onClick={handleToggleCollapse}><Minus className="h-4 w-4" /></Button>
            <Button variant="ghost" size="sm" onClick={handleClose}><X className="h-4 w-4" /></Button>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
