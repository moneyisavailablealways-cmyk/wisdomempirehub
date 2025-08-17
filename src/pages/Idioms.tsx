import React from 'react';
import { AIAssistant } from '@/components/AIAssistant';
import { DownloadButton } from '@/components/DownloadButton';
import { SubcategoryList } from '@/components/SubcategoryList';

const Idioms = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="font-wisdom text-foreground font-bold text-5xl">Idioms</h1>
            <DownloadButton category="idioms" />
          </div>
          <p className="text-lg mb-6 text-center text-muted-foreground">
            Cultural expressions with meanings that differ from literal interpretation
          </p>

          {/* AI Assistant */}
          <AIAssistant category="Idioms" />
        </div>

        <SubcategoryList table="idioms" />
      </div>
    </div>
  );
};

export default Idioms;
