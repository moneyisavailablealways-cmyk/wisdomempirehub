import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type Category = 'proverbs' | 'idioms' | 'similes' | 'quotes';

export const useDownload = () => {
  const [isDownloading, setIsDownloading] = useState<{ [key in Category]?: boolean }>({});

  const downloadCategory = async (category: Category) => {
    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error('Please log in to download PDFs');
      // Redirect to login page
      window.location.href = '/auth';
      return;
    }

    setIsDownloading(prev => ({ ...prev, [category]: true }));

    try {
      // Call the generate-pdf edge function via Supabase functions invoke
      const { data, error } = await supabase.functions.invoke('generate-pdf', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // We need to pass the category as a query parameter by manually building the URL
      const { data: userData } = await supabase.auth.getSession();
      const response = await fetch(`https://sxvrqshcqmbmogkwcixe.supabase.co/functions/v1/generate-pdf?category=${category}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${userData.session?.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error generating PDF:', errorText);
        toast.error('Failed to generate PDF');
        return;
      }

      // Get signed URL for download
      const { data: signedUrlData, error: urlError } = await supabase.storage
        .from('downloads')
        .createSignedUrl(`${category}/${category}.pdf`, 60); // 60 seconds

      if (urlError) {
        console.error('Error creating signed URL:', urlError);
        toast.error('Failed to create download link');
        return;
      }

      // Trigger download
      const link = document.createElement('a');
      link.href = signedUrlData.signedUrl;
      link.download = `${category}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(`${category.charAt(0).toUpperCase() + category.slice(1)} PDF downloaded successfully!`);

    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download PDF');
    } finally {
      setIsDownloading(prev => ({ ...prev, [category]: false }));
    }
  };

  return {
    downloadCategory,
    isDownloading,
  };
};