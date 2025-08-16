import React from 'react';
import { AIAssistant } from '@/components/AIAssistant';
import { DownloadButton } from '@/components/DownloadButton';
import { SubcategoryList } from '@/components/SubcategoryList';

const Proverbs = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="font-wisdom text-foreground font-bold text-5xl">Proverbs</h1>
            <DownloadButton category="proverbs" />
          </div>
          <p className="text-lg mb-6 text-center text-muted-foreground">
            Traditional sayings that convey wisdom through generations
          </p>

          {/* AI Assistant */}
          <AIAssistant category="Proverbs" />
        </div>

        <SubcategoryList table="proverbs" />
      </div>
    </div>
  );
};
export default Proverbs;