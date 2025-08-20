import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Quote, MessageSquare, Zap, Shield, Eye, Lock, UserCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
const Privacy = () => {
  return <div className="min-h-screen bg-background">
      {/* SEO Meta Tags */}
      <title>Privacy Policy - Wisdom Empire</title>
      <meta name="description" content="Privacy Policy for Wisdom Empire. Learn how we collect, use, and protect your personal information while using our cultural knowledge platform." />
      
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
            <h1 className="text-4xl font-bold font-wisdom text-foreground mb-4">Privacy Policy</h1>
            <p className="text-muted-foreground">Last updated: August,2025</p>
          </div>

          <div className="space-y-8">
            {/* Introduction */}
            <Card>
              <CardContent className="p-8 bg-slate-900">
                <p className="text-muted-foreground mb-4">
                  Your privacy matters to us. This Privacy Policy explains how we collect, use, and protect your personal information.
                </p>
              </CardContent>
            </Card>

            {/* Information We Collect */}
            <Card>
              <CardHeader className="bg-slate-900">
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-wisdom-gold" />
                  Information We Collect
                </CardTitle>
              </CardHeader>
              <CardContent className="bg-slate-900">
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-wisdom-gold">•</span>
                    <span><strong>Directly from you:</strong> When you contact us, sign up, or edit content.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-wisdom-gold">•</span>
                    <span><strong>Automatically:</strong> Through cookies, analytics tools, and browsing patterns.</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* How We Use Information */}
            <Card>
              <CardHeader className="bg-slate-900">
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-wisdom-gold" />
                  How We Use Your Information
                </CardTitle>
              </CardHeader>
              <CardContent className="bg-slate-900">
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-wisdom-gold">•</span>
                    <span>To provide, improve, and personalize the app experience.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-wisdom-gold">•</span>
                    <span>To communicate updates and respond to inquiries.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-wisdom-gold">•</span>
                    <span>To ensure security and prevent fraudulent activities.</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Sharing Information */}
            <Card>
              <CardHeader className="bg-slate-900">
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-wisdom-gold" />
                  Sharing of Information
                </CardTitle>
              </CardHeader>
              <CardContent className="bg-slate-900">
                <div className="space-y-4 text-muted-foreground">
                  <p>We do not sell your personal data. We may share information only:</p>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <span className="text-wisdom-gold">•</span>
                      <span>With trusted service providers assisting in operations.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-wisdom-gold">•</span>
                      <span>When required by law.</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Your Choices */}
            <Card>
              <CardHeader className="bg-slate-900">
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-wisdom-gold" />
                  Your Choices
                </CardTitle>
              </CardHeader>
              <CardContent className="bg-slate-900">
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-wisdom-gold">•</span>
                    <span>You can disable cookies in your browser settings.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-wisdom-gold">•</span>
                    <span>You may request data deletion by contacting privacy@yourwebsite.com.</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>;
};
export default Privacy;