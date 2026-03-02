import { useState, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';

export function useTTS() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [_currentAudio, _setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  const stopAudio = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
  }, []);

  const playText = useCallback(async (text: string, _voiceOverride?: string) => {
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
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.pitch = 1.0;
      utterance.rate = 0.95;
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => {
        setIsPlaying(false);
        toast({
          title: "Speech Error",
          description: "Failed to play text using speech synthesis",
          variant: "destructive"
        });
      };
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('TTS Error:', error);
      setIsPlaying(false);
      toast({
        title: "TTS Error",
        description: "Speech synthesis failed",
        variant: "destructive"
      });
    }
  }, [toast, stopAudio]);

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
