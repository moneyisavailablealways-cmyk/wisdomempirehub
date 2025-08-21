import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreditCard, User, Mail, ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
interface DonationFormProps {
  tier: {
    name: string;
    amount: string;
    description: string;
  };
  paymentMethod: 'stripe' | 'paypal' | 'crypto';
  onBack: () => void;
  onSuccess: (donationId: string) => void;
}
export const DonationForm = ({
  tier,
  paymentMethod,
  onBack,
  onSuccess
}: DonationFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast.error('Please fill in all required fields');
      return;
    }
    setLoading(true);
    try {
      const donationData = {
        ...formData,
        tier: tier.name,
        amount: tier.amount
      };
      const {
        data,
        error
      } = await supabase.functions.invoke('create-donation-payment', {
        body: {
          donationData,
          paymentMethod
        },
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token || ''}`
        }
      });
      if (error) throw error;
      if (data.success && data.paymentUrl) {
        // For Stripe, redirect to Stripe Checkout
        if (paymentMethod === 'stripe') {
          window.open(data.paymentUrl, '_blank');
        } else {
          // For PayPal and Crypto, simulate success for demo
          setTimeout(() => {
            onSuccess(data.donationId);
          }, 2000);
        }
      }
    } catch (error) {
      console.error('Error creating donation:', error);
      toast.error('Failed to process donation. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  const getPaymentMethodDisplay = () => {
    switch (paymentMethod) {
      case 'stripe':
        return {
          name: 'Credit Card',
          icon: CreditCard,
          description: 'Secure payment via Stripe'
        };
      case 'paypal':
        return {
          name: 'PayPal',
          icon: CreditCard,
          description: 'Pay with your PayPal account'
        };
      case 'crypto':
        return {
          name: 'Cryptocurrency',
          icon: CreditCard,
          description: 'Pay with crypto wallet'
        };
      default:
        return {
          name: 'Payment',
          icon: CreditCard,
          description: 'Secure payment'
        };
    }
  };
  const paymentDisplay = getPaymentMethodDisplay();
  return <div className="max-w-md mx-auto space-y-6">
      <div className="text-center">
        <Button variant="ghost" onClick={onBack} className="mb-4 text-ocean-blue hover:text-ocean-teal">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Payment Methods
        </Button>
      </div>

      <Card className="border border-ocean-blue/20">
        <CardHeader className="bg-gradient-to-r from-ocean-blue to-ocean-teal text-white">
          <CardTitle className="flex items-center gap-2">
            <paymentDisplay.icon className="h-5 w-5" />
            {paymentDisplay.name} Payment
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="mb-4 p-4 bg-ocean-blue/5 rounded-lg">
            <h3 className="font-semibold text-ocean-blue text-zinc-950 text-2xl">{tier.name}</h3>
            <p className="text-2xl font-bold text-ocean-teal text-green-900">{tier.amount}</p>
            <p className="text-sm text-red-950">{tier.description}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name" className="flex items-center gap-2 bg-zinc-950">
                <User className="h-4 w-4" />
                Full Name *
              </Label>
              <Input id="name" type="text" value={formData.name} onChange={e => setFormData({
              ...formData,
              name: e.target.value
            })} placeholder="Enter your full name" required className="mt-1" />
            </div>

            <div>
              <Label htmlFor="email" className="flex items-center gap-2 bg-zinc-950">
                <Mail className="h-4 w-4" />
                Email Address *
              </Label>
              <Input id="email" type="email" value={formData.email} onChange={e => setFormData({
              ...formData,
              email: e.target.value
            })} placeholder="Enter your email address" required className="mt-1" />
            </div>

            <div className="pt-4">
              <a
                href="https://ko-fi.com/s/dc6f6effd4"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full block"
              >
                <Button
                  type="button"
                  className="w-full bg-gradient-to-r from-ocean-blue to-ocean-teal hover:from-ocean-teal hover:to-ocean-blue"
                >
                  {loading ? 'Processing...' : `Donate ${tier.amount} via ${paymentDisplay.name}`}
                </Button>
              </a>
            </div>


            <p className="text-xs text-muted-foreground text-center">
              {paymentDisplay.description}. Your information is secure and encrypted.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>;
};