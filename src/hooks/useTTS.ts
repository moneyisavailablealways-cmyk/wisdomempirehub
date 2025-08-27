import { useState, useCallback } from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export function useTTS() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const { openAIVoice } = useSettings();
  const { toast } = useToast();

  const stopAudio = useCallback(() => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.src = '';
      setCurrentAudio(null);
    }
    setIsPlaying(false);
  }, [currentAudio]);

  const playText = useCallback(async (text: string, voiceOverride?: string) => {
    // Stop any currently playing audio
    stopAudio();

    if (!text.trim()) {
      toast({
        title: "TTS Error",
        description: "No text provided for speech synthesis",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsPlaying(true);
      
      // Call the text-to-speech edge function
      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: {
          text: text,
          voice: voiceOverride || openAIVoice
        }
      });

      if (error) {
        throw new Error(error.message || 'Failed to generate speech');
      }

      if (!data?.audioContent) {
        throw new Error('No audio content received');
      }

      // Create audio from base64 data
      const audioData = `data:audio/mp3;base64,${data.audioContent}`;
      const audio = new Audio(audioData);
      
      audio.onended = () => {
        setIsPlaying(false);
        setCurrentAudio(null);
      };

      audio.onerror = () => {
        setIsPlaying(false);
        setCurrentAudio(null);
        toast({
          title: "Audio Playback Error",
          description: "Failed to play generated audio",
          variant: "destructive"
        });
      };

      setCurrentAudio(audio);
      await audio.play();

    } catch (error) {
      console.error('TTS Error:', error);
      setIsPlaying(false);
      
      // Fallback to Web Speech API if edge function fails
      try {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.pitch = 1.0;
        utterance.rate = 0.95;
        utterance.onend = () => setIsPlaying(false);
        utterance.onerror = () => {
          setIsPlaying(false);
          toast({
            title: "Speech Synthesis Error",
            description: "Failed to play text using speech synthesis",
            variant: "destructive"
          });
        };
        
        window.speechSynthesis.speak(utterance);
        
        toast({
          description: "Using fallback voice (OpenAI TTS unavailable)",
          duration: 3000
        });
      } catch (fallbackError) {
        toast({
          title: "TTS Error",
          description: "Both primary and fallback speech systems failed",
          variant: "destructive"
        });
      }
    }
  }, [openAIVoice, toast, stopAudio, currentAudio]);

  const togglePlayback = useCallback((text: string, voiceOverride?: string) => {
    if (isPlaying) {
      stopAudio();
    } else {
      playText(text, voiceOverride);
    }
  }, [isPlaying, stopAudio, playText]);

  return {
    isPlaying,
    playText,
    stopAudio,
    togglePlayback
  };
}