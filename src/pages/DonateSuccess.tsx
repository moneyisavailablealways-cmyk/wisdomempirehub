import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Download, Home } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const DonateSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [donation, setDonation] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const donationId = searchParams.get('donation_id');

  useEffect(() => {
    const completeDonation = async () => {
      if (!donationId) {
        navigate('/donate');
        return;
      }

      try {
        // Complete the donation
        const { data, error } = await supabase.functions.invoke('complete-donation', {
          body: { donationId }
        });

        if (error) throw error;

        if (data.success) {
          setDonation(data.donation);
          toast.success('Thank you for your generous donation!');
        }
      } catch (error) {
        console.error('Error completing donation:', error);
        toast.error('There was an issue processing your donation. Please contact support.');
        navigate('/donate');
      } finally {
        setLoading(false);
      }
    };

    completeDonation();
  }, [donationId, navigate]);

  const handleDownloadCertificate = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('generate-certificate', {
        body: { donationId }
      });

      if (error) throw error;

      // Create a blob from the PDF data and download it
      const blob = new Blob([data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `wisdom-empire-certificate-${donation?.tier?.toLowerCase().replace(/\s+/g, '-')}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success('Certificate downloaded successfully!');
    } catch (error) {
      console.error('Error downloading certificate:', error);
      toast.error('Failed to download certificate. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ocean-blue mx-auto mb-4"></div>
          <p className="text-muted-foreground">Processing your donation...</p>
        </div>
      </div>
    );
  }

  if (!donation) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Donation not found</p>
          <Button onClick={() => navigate('/donate')} className="mt-4">
            Return to Donate
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-4xl font-bold font-wisdom text-foreground mb-4">
              Thank You!
            </h1>
            <p className="text-lg text-muted-foreground">
              Your generous donation has been processed successfully.
            </p>
          </div>

          <Card className="bg-gradient-to-r from-ocean-blue to-ocean-teal text-white mb-8">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-2">You are now a</h2>
              <div className="text-3xl font-bold mb-4">{donation.tier}</div>
              <p className="text-white/90 mb-4">
                Your contribution of ${donation.amount} will directly support our mission to preserve cultural wisdom.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="font-semibold">Donation ID</div>
                  <div className="font-mono text-xs">{donation.id}</div>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="font-semibold">Date</div>
                  <div>{new Date(donation.created_at).toLocaleDateString()}</div>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="font-semibold">Payment Method</div>
                  <div className="capitalize">{donation.payment_method}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center space-y-4">
            <Button 
              onClick={handleDownloadCertificate}
              size="lg"
              className="bg-gradient-to-r from-ocean-teal to-ocean-mint hover:from-ocean-mint hover:to-ocean-teal"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Your Certificate
            </Button>

            <div className="space-y-2">
              <Button 
                variant="outline"
                onClick={() => navigate('/')}
                className="border-ocean-blue text-ocean-blue hover:bg-ocean-blue hover:text-white"
              >
                <Home className="h-4 w-4 mr-2" />
                Return to Home
              </Button>
            </div>

            <div className="mt-8 p-6 bg-ocean-blue/5 rounded-lg">
              <h3 className="text-lg font-semibold text-ocean-blue mb-2">
                What happens next?
              </h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Your donation will help maintain our servers and expand our content library</li>
                <li>• You'll receive email updates about how your contribution is making a difference</li>
                <li>• Your certificate serves as a token of our gratitude for your support</li>
                <li>• Consider sharing our mission with friends who value cultural wisdom</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonateSuccess;