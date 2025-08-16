import React from 'react';
import { AIAssistant } from '@/components/AIAssistant';
import { DownloadButton } from '@/components/DownloadButton';
import { SubcategoryList } from '@/components/SubcategoryList';

const Similes = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="font-wisdom text-foreground font-bold text-5xl">Similes</h1>
            <DownloadButton category="similes" />
          </div>
          <p className="text-lg mb-6 text-center text-muted-foreground">
            Comparative phrases that use "like" or "as" to create vivid descriptions and imagery
          </p>

          {/* AI Assistant */}
          <AIAssistant category="Similes" />
        </div>

        <SubcategoryList table="similes" />
      </div>
    </div>
  );
};

export default Similes;