import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings, Volume2 } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';

const voiceOptions = [
  { 
    value: 'Adams' as const, 
    label: 'Adams Voice', 
    emoji: '🎭',
    description: 'Deep, authoritative voice'
  },
  { 
    value: 'Leo' as const, 
    label: 'Leo Voice', 
    emoji: '🦁',
    description: 'Strong, confident voice'
  },
  { 
    value: 'Bella' as const, 
    label: 'Bella Voice', 
    emoji: '🌟',
    description: 'Warm, friendly voice'
  },
  { 
    value: 'Default' as const, 
    label: 'Default Voice', 
    emoji: '🎯',
    description: 'Clear, balanced voice'
  }
];

export function SettingsMenu() {
  const { preferredVoice, setPreferredVoice, availableVoices } = useSettings();

  // Filter voice options to only show available voices
  const displayVoiceOptions = voiceOptions.filter(option => 
    availableVoices.includes(option.value)
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Wisdom Empire Settings
          </DialogTitle>
          <DialogDescription>
            Customize your experience with global preferences that apply across all content.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Volume2 className="h-4 w-4" />
              <h3 className="text-sm font-medium">Audio Voice Preference</h3>
            </div>
            
            <p className="text-sm text-muted-foreground">
              Choose your preferred voice for text-to-speech playback across all wisdom content.
            </p>
            
            <div className="grid grid-cols-1 gap-3">
              {displayVoiceOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={preferredVoice === option.value ? "wisdom" : "outline"}
                  onClick={() => setPreferredVoice(option.value)}
                  className="h-auto p-4 justify-start gap-3"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-lg">{option.emoji}</span>
                    <div className="text-left">
                      <div className="font-medium">{option.label}</div>
                      <div className="text-xs text-muted-foreground">
                        {option.description}
                      </div>
                    </div>
                  </div>
                  {preferredVoice === option.value && (
                    <Badge variant="secondary" className="ml-auto">
                      Active
                    </Badge>
                  )}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground">
              Your settings are saved locally and will persist across sessions.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}