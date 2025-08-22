import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Globe, BookOpen, Users, Star, ArrowLeft } from 'lucide-react';
const Donate = () => {
  const [currentSection, setCurrentSection] = useState<'initial' | 'tiers'>('initial');

  // ✅ Each tier now has its own Ko-fi link
  const donationTiers = [{
    name: "Wisdom Supporter",
    amount: "$5",
    description: "Help us maintain servers and keep wisdom accessible",
    gradient: "bg-gradient-to-br from-ocean-blue to-ocean-teal",
    link: "https://www.paypal.com/ncp/payment/LJEEDFHN6C8ZE" // replace with actual link
  }, {
    name: "Wisdom Patron",
    amount: "$20",
    description: "Support content research and cultural preservation",
    gradient: "bg-gradient-to-br from-ocean-teal to-ocean-mint",
    link: "https://www.paypal.com/ncp/payment/3RKZSNQSX24VW"
  }, {
    name: "Wisdom Champion",
    amount: "$30",
    description: "Fund AI features and educational tools development",
    gradient: "bg-gradient-to-br from-ocean-coral to-ocean-blue",
    link: "https://www.paypal.com/ncp/payment/A8KKB3M5X6M8Y"
  }, {
    name: "Monthly Supporter",
    amount: "$15/month",
    description: "Ongoing support for platform growth and innovation",
    gradient: "bg-gradient-to-br from-ocean-navy to-ocean-coral",
    link: "https://www.paypal.com/webapps/billing/plans/subscribe?plan_id=P-2M4415004C520745GNCUOBRY"
  }, {
    name: "Wisdom Guardian",
    amount: "$100+",
    description: "Lead sponsor of cultural wisdom preservation efforts",
    gradient: "bg-gradient-to-br from-ocean-blue via-ocean-teal to-ocean-coral",
    link: "https://www.paypal.com/ncp/payment/CA26AVPMY5A8C"
  }, {
    name: "Wisdom Pillar",
    amount: "$500+",
    description: "Foundational supporter driving global wisdom preservation and innovation",
    gradient: "bg-gradient-to-br from-yellow-500 via-orange-500 to-red-600",
    link: "https://www.paypal.com/ncp/payment/YLJQAZ8N7TRGS"
  }];
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
              <Button variant="wisdom" size="lg" onClick={() => setCurrentSection('tiers')} className="bg-gradient-to-r from-ocean-blue to-ocean-teal hover:from-ocean-teal hover:to-ocean-blue transition-all duration-300">
                <Heart className="h-4 w-4 mr-2" />
                Donate Now
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>;
  const renderTiersSection = () => <div className="space-y-8">
      <div className="text-center">
        <Button variant="ghost" onClick={() => setCurrentSection('initial')} className="mb-4 text-ocean-blue hover:text-ocean-teal">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h2 className="font-bold text-ocean-blue mb-4 text-xl">Choose Your Support Level</h2>
        <p className="text-muted-foreground">Select a donation tier that works for you</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {donationTiers.map((tier, index) => <Card key={index} className={`${tier.gradient} text-white border-0 hover:scale-105 transition-all duration-300 shadow-card hover:shadow-card-hover`}>
            <CardContent className="p-6 text-center rounded-2xl bg-green-900">
              <div className="mb-4">
                <h3 className="text-xl font-bold mb-2">{tier.name}</h3>
                <div className="text-3xl font-bold mb-3 rounded-2xl bg-green-900">{tier.amount}</div>
              </div>
              <p className="text-white/90 mb-6 text-sm leading-relaxed">{tier.description}</p>
              {/* ✅ Direct Ko-fi link */}
              <Button variant="outline" onClick={() => window.open(tier.link, '_blank')} className="w-full bg-white/20 hover:bg-white/30 border-white/30 text-amber-400 rounded-2xl">
                Donate Now
              </Button>
            </CardContent>
          </Card>)}
      </div>
    </div>;
  return <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="font-bold font-wisdom text-foreground mb-4 text-2xl">Support Wisdom Empire</h1>
            <p className="text-muted-foreground text-lg">
              Help us preserve and share cultural wisdom from around the world
            </p>
          </div>

          {currentSection === 'initial' && renderInitialSection()}
          {currentSection === 'tiers' && renderTiersSection()}
        </div>
      </div>
    </div>;
};
export default Donate;