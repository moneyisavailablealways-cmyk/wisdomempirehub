import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { useDownload, type Category } from '@/hooks/useDownload';

interface DownloadButtonProps {
  category: Category;
  className?: string;
}

export const DownloadButton: React.FC<DownloadButtonProps> = ({ 
  category, 
  className = "" 
}) => {
  const { downloadCategory, isDownloading } = useDownload();

  const handleDownload = () => {
    downloadCategory(category);
  };

  const isLoading = isDownloading[category];

  return (
    <Button
      onClick={handleDownload}
      disabled={isLoading}
      variant="cultural"
      size="sm"
      className={`gap-2 ${className}`}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Download className="h-4 w-4" />
      )}
      {isLoading ? 'Generating...' : 'Download PDF'}
    </Button>
  );
};