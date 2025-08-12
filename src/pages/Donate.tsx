import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Globe, BookOpen, Users, Star, CreditCard, Wallet, ArrowLeft, Download, CheckCircle } from 'lucide-react';
import { DonationForm } from '@/components/DonationForm';
const Donate = () => {
  const [currentSection, setCurrentSection] = useState<'initial' | 'tiers' | 'payment' | 'form' | 'thankyou'>('initial');
  const [selectedTier, setSelectedTier] = useState<{
    name: string;
    amount: string;
    description: string;
  } | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'stripe' | 'paypal' | 'crypto' | null>(null);
  const donationTiers = [{
    name: "Wisdom Supporter",
    amount: "$5",
    description: "Help us maintain servers and keep wisdom accessible",
    gradient: "bg-gradient-to-br from-ocean-blue to-ocean-teal"
  }, {
    name: "Wisdom Patron",
    amount: "$20",
    description: "Support content research and cultural preservation",
    gradient: "bg-gradient-to-br from-ocean-teal to-ocean-mint"
  }, {
    name: "Wisdom Champion",
    amount: "$30",
    description: "Fund AI features and educational tools development",
    gradient: "bg-gradient-to-br from-ocean-coral to-ocean-blue"
  }, {
    name: "Monthly Supporter",
    amount: "$40/month",
    description: "Ongoing support for platform growth and innovation",
    gradient: "bg-gradient-to-br from-ocean-navy to-ocean-coral"
  }, {
    name: "Wisdom Guardian",
    amount: "$100+",
    description: "Lead sponsor of cultural wisdom preservation efforts",
    gradient: "bg-gradient-to-br from-ocean-blue via-ocean-teal to-ocean-coral"
  }];
  const handleDonateClick = () => {
    setCurrentSection('tiers');
  };
  const handleTierSelect = (tier: {
    name: string;
    amount: string;
    description: string;
  }) => {
    setSelectedTier(tier);
    setCurrentSection('payment');
  };
  const handlePaymentMethodSelect = (method: 'stripe' | 'paypal' | 'crypto') => {
    setSelectedPaymentMethod(method);
    setCurrentSection('form');
  };
  const handleDonationSuccess = (donationId: string) => {
    // Redirect to success page
    window.location.href = `/donate/success?donation_id=${donationId}`;
  };
  const handleBackToTiers = () => {
    setCurrentSection('tiers');
  };
  const handleBackToInitial = () => {
    setCurrentSection('initial');
  };
  const handleBackToPayment = () => {
    setCurrentSection('payment');
  };
  const renderInitialSection = () => <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <Card className="border border-ocean-blue/20 bg-gradient-to-br from-card to-ocean-blue/5">
          <CardHeader className="bg-gradient-to-r from-ocean-blue to-ocean-teal text-white">
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Our Mission
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            <p className="text-muted-foreground">
              Wisdom Empire is dedicated to preserving and sharing the rich cultural heritage 
              of humanity through proverbs, quotes, idioms, and similes from every corner of the world.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <BookOpen className="h-4 w-4 text-ocean-teal" />
                Educational content for all ages
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-ocean-teal" />
                Cultural bridge building
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Heart className="h-4 w-4 text-ocean-teal" />
                Preserving traditional wisdom
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-ocean-teal/20 bg-gradient-to-br from-card to-ocean-teal/5">
          <CardHeader className="bg-gradient-to-r from-ocean-teal to-ocean-mint text-white">
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              How You Help
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            <p className="text-muted-foreground">
              Your donations help us maintain our platform, expand our content library, 
              and develop new features like AI-powered explanations and audio content.
            </p>
            <div className="space-y-2">
              <div className="text-sm">
                <strong>$5</strong> - Helps us maintain servers for one day
              </div>
              <div className="text-sm">
                <strong>$25</strong> - Supports content research and curation
              </div>
              <div className="text-sm">
                <strong>$50</strong> - Funds AI features development
              </div>
              <div className="text-sm">
                <strong>$100</strong> - Sponsors cultural preservation efforts
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="text-center space-y-6">
        <Card className="border-2 border-ocean-coral bg-gradient-to-br from-ocean-coral/5 to-ocean-blue/5">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold text-ocean-blue mb-4">
              Make a Difference Today
            </h3>
            <p className="text-muted-foreground mb-6">
              Every contribution, no matter the size, helps us preserve cultural wisdom for future generations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="wisdom" size="lg" onClick={handleDonateClick} className="bg-gradient-to-r from-ocean-blue to-ocean-teal hover:from-ocean-teal hover:to-ocean-blue transition-all duration-300">
                <Heart className="h-4 w-4 mr-2" />
                Donate Now
              </Button>
              <Button variant="outline" size="lg" onClick={handleDonateClick} className="border-ocean-teal text-ocean-teal hover:bg-ocean-teal hover:text-white">
                Become a Monthly Supporter
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="text-sm text-muted-foreground">
          <p>
            Wisdom Empire is committed to transparency. All donations go directly towards 
            platform maintenance, content development, and educational initiatives.
          </p>
        </div>
      </div>
    </>;
  const renderTiersSection = () => <div className="space-y-8">
      <div className="text-center">
        <Button variant="ghost" onClick={handleBackToInitial} className="mb-4 text-ocean-blue hover:text-ocean-teal">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h2 className="text-3xl font-bold text-ocean-blue mb-4">Choose Your Support Level</h2>
        <p className="text-muted-foreground">Select a donation tier that works for you</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {donationTiers.map((tier, index) => <Card key={index} className={`${tier.gradient} text-white border-0 hover:scale-105 transition-all duration-300 cursor-pointer shadow-card hover:shadow-card-hover`} onClick={() => handleTierSelect(tier)}>
            <CardContent className="p-6 text-center">
              <div className="mb-4">
                <h3 className="text-xl font-bold mb-2">{tier.name}</h3>
                <div className="text-3xl font-bold mb-3">{tier.amount}</div>
              </div>
              <p className="text-white/90 mb-6 text-sm leading-relaxed">{tier.description}</p>
              <Button className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30" variant="outline">
                Donate Now
              </Button>
            </CardContent>
          </Card>)}
      </div>
    </div>;
  const renderPaymentSection = () => <div className="space-y-8">
      <div className="text-center">
        <Button variant="ghost" onClick={handleBackToTiers} className="mb-4 text-ocean-blue hover:text-ocean-teal">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Tiers
        </Button>
        <h2 className="text-3xl font-bold text-ocean-blue mb-4">Complete Your Donation</h2>
        {selectedTier && <div className="inline-block bg-gradient-to-r from-ocean-blue to-ocean-teal text-white px-6 py-3 rounded-lg mb-6">
            <span className="font-semibold">{selectedTier.name}</span> - <span className="text-xl">{selectedTier.amount}</span>
          </div>}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <Card className="border border-ocean-blue/20 hover:border-ocean-blue/40 transition-colors cursor-pointer">
          <CardContent onClick={() => handlePaymentMethodSelect('stripe')} className="p-6 flex items-center justify-between bg-sky-200">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-950">
                <CreditCard className="h-6 w-6 text-blue-600 bg-green-950" />
              </div>
              <div>
                <h3 className="font-semibold text-teal-950">Credit Card</h3>
                <p className="text-sm text-violet-950">Visa, MasterCard, American Express</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-ocean-teal/20 hover:border-ocean-teal/40 transition-colors cursor-pointer">
          <CardContent onClick={() => handlePaymentMethodSelect('paypal')} className="p-6 flex items-center justify-between bg-green-300">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <div className="h-6 w-6 bg-gradient-to-r from-blue-600 to-blue-800 rounded flex items-center justify-center text-white font-bold text-xs">PP</div>
              </div>
              <div>
                <h3 className="font-semibold text-blue-800">PayPal</h3>
                <p className="text-sm text-blue-800">Pay with your PayPal account</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-ocean-coral/20 hover:border-ocean-coral/40 transition-colors cursor-pointer">
          <CardContent className="p-6 flex items-center justify-between" onClick={() => handlePaymentMethodSelect('crypto')}>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Wallet className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-rose-700">Cryptocurrency Wallets</h3>
                <p className="text-sm text-blue-800">Bitcoin, Ethereum, and more</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>;
  const renderFormSection = () => {
    if (!selectedTier || !selectedPaymentMethod) {
      return null;
    }
    return <DonationForm tier={selectedTier} paymentMethod={selectedPaymentMethod} onBack={handleBackToPayment} onSuccess={handleDonationSuccess} />;
  };
  const renderThankYouSection = () => <div className="text-center space-y-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-ocean-blue mb-4">Thank You!</h2>
          <p className="text-lg text-muted-foreground mb-6">
            Your generous donation has been processed successfully.
          </p>
        </div>

        {selectedTier && <Card className="bg-gradient-to-r from-ocean-blue to-ocean-teal text-white mb-8">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-2">You are now a</h3>
              <div className="text-3xl font-bold mb-4">{selectedTier.name}</div>
              <p className="text-white/90">
                Your contribution of {selectedTier.amount} will directly support our mission to preserve cultural wisdom.
              </p>
            </CardContent>
          </Card>}

        <div className="space-y-4">
          <Button variant="outline" size="lg" className="border-ocean-blue text-ocean-blue hover:bg-ocean-blue hover:text-white">
            <Download className="h-4 w-4 mr-2" />
            Download Supporter Badge
          </Button>

          <div>
            <Button variant="ghost" onClick={handleBackToInitial} className="text-ocean-blue hover:text-ocean-teal">
              Return to Donation Page
            </Button>
          </div>
        </div>
      </div>
    </div>;
  return <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold font-wisdom text-foreground mb-4">Support Wisdom Empire</h1>
            <p className="text-muted-foreground text-lg">
              Help us preserve and share cultural wisdom from around the world
            </p>
          </div>

          {currentSection === 'initial' && renderInitialSection()}
          {currentSection === 'tiers' && renderTiersSection()}
          {currentSection === 'payment' && renderPaymentSection()}
          {currentSection === 'form' && renderFormSection()}
          {currentSection === 'thankyou' && renderThankYouSection()}
        </div>
      </div>
    </div>;
};
export default Donate;