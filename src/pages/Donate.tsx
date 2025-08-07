import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Globe, BookOpen, Users, Star } from 'lucide-react';

const Donate = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold font-wisdom text-foreground mb-4">Support Wisdom Empire</h1>
            <p className="text-muted-foreground text-lg">
              Help us preserve and share cultural wisdom from around the world
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-wisdom-blue">
                  <Globe className="h-5 w-5" />
                  Our Mission
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Wisdom Empire is dedicated to preserving and sharing the rich cultural heritage 
                  of humanity through proverbs, quotes, idioms, and similes from every corner of the world.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <BookOpen className="h-4 w-4 text-wisdom-gold" />
                    Educational content for all ages
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-wisdom-gold" />
                    Cultural bridge building
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Heart className="h-4 w-4 text-wisdom-gold" />
                    Preserving traditional wisdom
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-wisdom-blue">
                  <Star className="h-5 w-5" />
                  How You Help
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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
            <Card className="border-wisdom-gold border-2 bg-wisdom-gold/5">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-wisdom-blue mb-4">
                  Make a Difference Today
                </h3>
                <p className="text-muted-foreground mb-6">
                  Every contribution, no matter the size, helps us preserve cultural wisdom for future generations.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button variant="wisdom" size="lg">
                    <Heart className="h-4 w-4 mr-2" />
                    Donate Now
                  </Button>
                  <Button variant="outline" size="lg">
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
        </div>
      </div>
    </div>
  );
};

export default Donate;