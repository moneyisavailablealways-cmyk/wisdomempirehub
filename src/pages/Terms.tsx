import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Quote, MessageSquare, Zap, FileText, Users, AlertTriangle, Scale } from 'lucide-react';
import { Link } from 'react-router-dom';
const Terms = () => {
  return <div className="min-h-screen bg-background">
      {/* SEO Meta Tags */}
      <title>Terms of Use - Wisdom Empire</title>
      <meta name="description" content="Terms of Use for Wisdom Empire. Understand the terms and conditions for using our cultural knowledge platform and wisdom collection." />
      
      {/* Quick Navigation Links */}
      <section className="bg-card border-b border-border py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-2 justify-center">
            <Button variant="outline" size="sm" asChild>
              <Link to="/proverbs" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Proverbs
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to="/quotes" className="flex items-center gap-2">
                <Quote className="h-4 w-4" />
                Quotes
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to="/idioms" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Idioms
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to="/similes" className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Similes
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold font-wisdom text-foreground mb-4">Terms of Use</h1>
            <p className="text-muted-foreground">Last updated: August,2025</p>
          </div>

          <div className="space-y-8 bg-slate-900">
            {/* Introduction */}
            <Card className="">
              <CardContent className="p-8 bg-teal-950">
                <p className="text-muted-foreground">
                  Welcome to [Your Website/App Name]! By accessing or using our services, you agree to the following terms:
                </p>
              </CardContent>
            </Card>

            {/* Terms List */}
            <Card>
              <CardHeader className="bg-emerald-950">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-wisdom-gold" />
                  Use of Content
                </CardTitle>
              </CardHeader>
              <CardContent className="bg-emerald-950">
                <p className="text-muted-foreground">
                  You may view, share, and download content for personal, non-commercial use only.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="bg-emerald-950">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-wisdom-gold" />
                  User-Generated Content
                </CardTitle>
              </CardHeader>
              <CardContent className="bg-emerald-950">
                <p className="text-muted-foreground">
                  If you add or edit a proverb, you grant us a non-exclusive right to display and distribute it within the app.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="bg-emerald-950">
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-wisdom-gold" />
                  Prohibited Activities
                </CardTitle>
              </CardHeader>
              <CardContent className="bg-emerald-950">
                <p className="text-muted-foreground">
                  You agree not to post harmful, misleading, or illegal content.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="bg-emerald-950">
                <CardTitle className="flex items-center gap-2">
                  <Scale className="h-5 w-5 text-wisdom-gold" />
                  Disclaimer
                </CardTitle>
              </CardHeader>
              <CardContent className="bg-emerald-950">
                <p className="text-muted-foreground">
                  We provide content "as-is" without guarantees of accuracy.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8 bg-emerald-950">
                <h3 className="font-semibold text-foreground mb-3">Changes</h3>
                <p className="text-muted-foreground">
                  We may update these Terms at any time; continued use means you accept the new terms.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>;
};
export default Terms;