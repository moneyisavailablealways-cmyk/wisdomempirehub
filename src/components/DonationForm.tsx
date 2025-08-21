import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreditCard, User, Mail, ArrowLeft } from 'lucide-react';

interface DonationFormProps {
  tier: {
    name: string;
    amount: string;
    description: string;
  };
  paymentMethod: 'stripe' | 'paypal' | 'crypto';
  onBack: () => void;
}

export const DonationForm = ({
  tier,
  paymentMethod,
  onBack
}: DonationFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [loading, setLoading] = useState(false);

  const getPaymentMethodDisplay = () => {
    switch (paymentMethod) {
      case 'stripe':
        return { name: 'Credit Card', icon: CreditCard, description: 'Secure payment via Ko-fi' };
      case 'paypal':
        return { name: 'PayPal', icon: CreditCard, description: 'Pay with your PayPal via Ko-fi' };
      case 'crypto':
        return { name: 'Cryptocurrency', icon: CreditCard, description: 'Pay with crypto via Ko-fi' };
      default:
        return { name: 'Payment', icon: CreditCard, description: 'Secure payment via Ko-fi' };
    }
  };

  const paymentDisplay = getPaymentMethodDisplay();

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="text-center">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-4 text-ocean-blue hover:text-ocean-teal"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Payment Methods
        </Button>
      </div>

      <Card className="border border-ocean-blue/20">
        <CardHeader className="bg-gradient-to-r from-ocean-blue to-ocean-teal text-white">
          <CardTitle className="flex items-center gap-2">
            <paymentDisplay.icon className="h-5 w-5" />
            {paymentDisplay.name} via Ko-fi
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="mb-4 p-4 bg-ocean-blue/5 rounded-lg">
            <h3 className="font-semibold text-ocean-blue text-2xl">{tier.name}</h3>
            <p className="text-2xl font-bold text-ocean-teal">{tier.amount}</p>
            <p className="text-sm text-muted-foreground">{tier.description}</p>
          </div>

          {/* Info form (not connected to supabase anymore) */}
          <form className="space-y-4">
            <div>
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Full Name *
              </Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter your full name"
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Address *
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter your email address"
                required
                className="mt-1"
              />
            </div>
          </form>

          {/* ✅ Ko-fi button OUTSIDE form so it always works */}
          <div className="pt-4">
            <Button
              type="button"
              onClick={() => window.open('https://ko-fi.com/s/dc6f6effd4', '_blank')}
              className="w-full bg-gradient-to-r from-ocean-blue to-ocean-teal hover:from-ocean-teal hover:to-ocean-blue"
              disabled={loading}
            >
              {loading ? 'Processing...' : `Donate ${tier.amount} via Ko-fi`}
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center mt-2">
            {paymentDisplay.description}. Your information is secure and encrypted.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
