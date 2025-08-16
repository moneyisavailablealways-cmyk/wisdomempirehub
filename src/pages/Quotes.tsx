import React from 'react';
import { AIAssistant } from '@/components/AIAssistant';
import { DownloadButton } from '@/components/DownloadButton';
import { SubcategoryList } from '@/components/SubcategoryList';

const Quotes = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="font-wisdom text-foreground font-bold text-5xl">Quotes</h1>
            <DownloadButton category="quotes" />
          </div>
          <p className="text-lg mb-6 text-center text-muted-foreground">
            Inspiring words from notable figures and thinkers
          </p>

          {/* AI Assistant */}
          <AIAssistant category="Quotes" />
        </div>

        <SubcategoryList table="quotes" />
      </div>
    </div>
  );
};
export default Quotes;