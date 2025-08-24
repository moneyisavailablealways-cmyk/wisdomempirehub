import React, { createContext, useContext, useState, useEffect } from 'react';

type VoiceType = 'Adams' | 'Leo' | 'Bella' | 'Default';
type OpenAIVoice = 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';

interface SettingsContextType {
  preferredVoice: VoiceType;
  setPreferredVoice: (voice: VoiceType) => void;
  openAIVoice: OpenAIVoice;
  setOpenAIVoice: (voice: OpenAIVoice) => void;
  availableVoices: VoiceType[];
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const voiceMapping: Record<VoiceType, OpenAIVoice> = {
  Adams: 'onyx',
  Leo: 'alloy',
  Bella: 'nova',
  Default: 'echo'
};

const availableVoices: VoiceType[] = ['Adams', 'Leo', 'Bella', 'Default'];

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [preferredVoice, setPreferredVoice] = useState<VoiceType>('Default');
  const [openAIVoice, setOpenAIVoice] = useState<OpenAIVoice>('echo');

  // Load settings from localStorage
  useEffect(() => {
    const savedVoice = localStorage.getItem('wisdom-preferred-voice') as VoiceType;
    if (savedVoice && availableVoices.includes(savedVoice)) {
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
      setOpenAIVoice,
      availableVoices
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