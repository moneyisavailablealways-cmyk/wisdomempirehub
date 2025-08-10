import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin, BookOpen, Quote, MessageSquare, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
const Contact = () => {
  return <div className="min-h-screen bg-slate-500">
      {/* SEO Meta Tags */}
      <title>Contact Us - Wisdom Empire</title>
      <meta name="description" content="Contact Wisdom Empire for questions, suggestions, or feedback about our proverb collection and features. Get in touch with our support team." />
      
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
            <h1 className="text-4xl font-bold font-wisdom text-foreground mb-4">Contact Us</h1>
            <p className="text-lg text-muted-foreground">We'd love to hear from you!</p>
          </div>

          {/* Contact Information */}
          <Card className="mb-8">
            <CardContent className="p-8">
              <p className="text-muted-foreground mb-6">
                If you have questions, suggestions, or feedback about our proverb collection or features, please reach out using the details below:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-wisdom-gold mt-1" />
                  <div>
                    <h3 className="font-semibold text-foreground">Email</h3>
                    <p className="text-muted-foreground">support@yourwebsite.com</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-wisdom-gold mt-1" />
                  <div>
                    <h3 className="font-semibold text-foreground">Phone</h3>
                    <p className="text-muted-foreground">+1 (XXX) XXX-XXXX</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-wisdom-gold mt-1" />
                  <div>
                    <h3 className="font-semibold text-foreground">Address</h3>
                    <p className="text-muted-foreground">
                      Your Company Name<br />
                      123 Inspiration Street<br />
                      City, State, ZIP
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 p-4 bg-wisdom-cultural/10 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  We aim to respond to all messages within 48 hours.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>;
};
export default Contact;