import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Loader2, Lock } from 'lucide-react';
import { useDownload, type Category } from '@/hooks/useDownload';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

interface DownloadButtonProps {
  category: Category;
  className?: string;
}

export const DownloadButton: React.FC<DownloadButtonProps> = ({ 
  category, 
  className = "" 
}) => {
  const { downloadCategory, isDownloading } = useDownload();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleDownload = () => {
    if (!user) {
      navigate(`/auth?returnTo=${encodeURIComponent(location.pathname)}`);
      return;
    }
    downloadCategory(category);
  };

  const isLoading = isDownloading[category];

  if (!user) {
    return (
      <Button
        onClick={handleDownload}
        variant="outline"
        size="sm"
        className={`gap-2 ${className}`}
      >
        <Lock className="h-4 w-4" />
        Sign In to Download
      </Button>
    );
  }

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