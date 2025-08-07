import React, { createContext, useContext, useState, useEffect } from 'react';

type VoiceType = 'child' | 'youth' | 'old';
type OpenAIVoice = 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';

interface SettingsContextType {
  preferredVoice: VoiceType;
  setPreferredVoice: (voice: VoiceType) => void;
  openAIVoice: OpenAIVoice;
  setOpenAIVoice: (voice: OpenAIVoice) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const voiceMapping: Record<VoiceType, OpenAIVoice> = {
  child: 'nova',
  youth: 'alloy', 
  old: 'onyx'
};

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [preferredVoice, setPreferredVoice] = useState<VoiceType>('youth');
  const [openAIVoice, setOpenAIVoice] = useState<OpenAIVoice>('alloy');

  // Load settings from localStorage
  useEffect(() => {
    const savedVoice = localStorage.getItem('wisdom-preferred-voice') as VoiceType;
    if (savedVoice && ['child', 'youth', 'old'].includes(savedVoice)) {
      setPreferredVoice(savedVoice);
      setOpenAIVoice(voiceMapping[savedVoice]);
    }
  }, []);

  // Save to localStorage when preference changes
  const updatePreferredVoice = (voice: VoiceType) => {
    setPreferredVoice(voice);
    setOpenAIVoice(voiceMapping[voice]);
    localStorage.setItem('wisdom-preferred-voice', voice);
  };

  return (
    <SettingsContext.Provider value={{
      preferredVoice,
      setPreferredVoice: updatePreferredVoice,
      openAIVoice,
      setOpenAIVoice
    }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}