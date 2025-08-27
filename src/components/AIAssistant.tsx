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

// Available voices
const VOICES = ['Adams', 'Leo', 'Bella', 'Default'];

// Map frontend names to OpenAI TTS voices
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
  const { isPlaying, togglePlayback, stopAudio } = useTTS();

  // Load visibility & collapsed state from localStorage
  useEffect(() => {
    const savedVisible = localStorage.getItem('ai-assistant-visible');
    const savedCollapsed = localStorage.getItem('ai-assistant-collapsed');
    if (savedVisible !== null) setIsVisible(JSON.parse(savedVisible));
    if (savedCollapsed !== null) setIsCollapsed(JSON.parse(savedCollapsed));
  }, []);

  useEffect(() => { localStorage.setItem('ai-assistant-visible', JSON.stringify(isVisible)); }, [isVisible]);
  useEffect(() => { localStorage.setItem('ai-assistant-collapsed', JSON.stringify(isCollapsed)); }, [isCollapsed]);

  // Initialize Speech Recognition
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
        handleAIResponse(finalTranscript.trim());
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

  // Fetch AI + TTS from Supabase Edge Function
  const handleAIResponse = async (message: string) => {
    if (!message.trim()) return;
    try {
      const { data, error } = await supabase.functions.invoke('voice-assistant', {
        body: { message, category, voice: voiceMapping[selectedVoice] || 'onyx' }
      });

      if (error) throw error;

      const aiText = data?.text || data?.explanation || 'No response available.';
      setResponse(aiText);

      // Scroll to response
      setTimeout(() => responseRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);

      // Play TTS
      togglePlayback(aiText, voiceMapping[selectedVoice] || 'onyx');

    } catch (err) {
      console.error('AI/TTS Error:', err);
      toast({ title: "Error", description: "Failed to get AI response or generate audio.", variant: "destructive" });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAIResponse(input.trim());
    setInput('');
  };

  const handlePlayResponseAudio = () => {
    if (!response) return;
    togglePlayback(response, voiceMapping[selectedVoice] || 'onyx');
  };

  const handleClose = () => setIsVisible(false);
  const handleToggleCollapse = () => setIsCollapsed(!isCollapsed);
  const handleShow = () => setIsVisible(true);

  return (
    <div ref={responseRef}>
      {!isVisible ? (
        <Button onClick={handleShow} variant="outline" className="mb-4 transition-all hover:scale-105">
          <Bot className="h-4 w-4 mr-2" /> Wisdom AI Assistant
        </Button>
      ) : (
        <Card className="border-wisdom-gold/20 bg-violet-300">
          <CardContent className="p-6 bg-emerald-600 rounded-3xl relative">

            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
              <Bot className="h-5 w-5 text-wisdom-gold" />
              <h3 className="font-semibold text-slate-50">Wisdom AI Assistant</h3>
            </div>

            {/* Collapsible Content */}
            <div className={`overflow-hidden transition-all duration-500 ${isCollapsed ? 'max-h-0 opacity-0' : 'max-h-[1000px] opacity-100'}`}>
              <form onSubmit={handleSubmit} className="space-y-4">

                {/* Voice Input */}
                <div className="flex justify-center mb-2">
                  <Button type="button" onClick={handleVoiceInput} disabled={isLi
