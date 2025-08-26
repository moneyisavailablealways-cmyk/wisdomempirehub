import React from 'react';
import { SEOHead } from '@/components/SEOHead';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Quote, MessageSquare, Zap, HelpCircle, Volume2, Download, Edit, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const FAQ = () => {
  const faqs = [
    { id: "1", icon: HelpCircle, question: "How do I show or hide the meaning of a proverb?", answer: "Click the \"Show Meaning\" link under the proverb. Click again to hide it." },
    { id: "2", icon: Edit, question: "Can I add my own proverbs?", answer: "Yes! Registered users can submit and edit proverbs through the edit feature." },
    { id: "3", icon: Download, question: "Can I download the proverbs?", answer: "Yes, look for the download icon on each card to save a copy." },
    { id: "4", icon: Volume2, question: "Why can't I hear the audio?", answer: "Make sure your device volume is up and your browser allows audio playback." },
    { id: "5", icon: Users, question: "Is the content free to use?", answer: "All content is free for personal use. For commercial use, please contact us." }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Wisdom Empire Hub - FAQs About Cultural Wisdom"
        description="Find answers to questions about Wisdom Empire Hub, our mission, and our content full of global wisdom. Learn how to explore wisdom effectively."
        keywords="wisdom, FAQs about wisdom, cultural wisdom questions, wisdom empire help, global wisdom support, wisdom resources"
        canonical={typeof window !== 'undefined' ? window.location.href : ''}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "name": "Wisdom Empire Hub - FAQs About Cultural Wisdom",
          "url": "https://wisdomempirehub.com/faq",
          "description": "Find answers to questions about Wisdom Empire Hub, our mission, and our content full of global wisdom. Learn how to explore wisdom effectively."
        }}
      />

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
        <div className="max-w-4xl mx-auto bg-gray-900">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold font-wisdom text-foreground mb-4">FAQs About Cultural Wisdom</h1>
            <div className="max-w-3xl mx-auto text-lg text-muted-foreground">
              <p className="mb-4">
                Welcome to our comprehensive FAQ section where we answer common questions about Wisdom Empire Hub and our mission to preserve and share cultural wisdom from around the world. Whether you're exploring proverbs, quotes, idioms, or similes, this guide will help you make the most of our educational platform and discover the profound wisdom that connects cultures across the globe.
              </p>
              <p>
                Our goal is to make timeless wisdom accessible and meaningful for everyone, fostering cross-cultural understanding through the shared heritage of human knowledge and universal truths that have guided civilizations throughout history.
              </p>
            </div>
          </div>

          {/* FAQ Accordion */}
          <Card>
            <CardContent className="p-8 bg-slate-900 rounded-2xl">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map(faq => {
                  const IconComponent = faq.icon;
                  return (
                    <AccordionItem key={faq.id} value={faq.id} className="border-b border-border last:border-b-0">
                      <AccordionTrigger className="text-left hover:no-underline py-6 bg-teal-950 hover:bg-teal-800 rounded-2xl">
                        <div className="flex items-center gap-3">
                          <IconComponent className="h-5 w-5 text-wisdom-gold flex-shrink-0" />
                          <span className="font-medium text-foreground">{faq.question}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pb-6">
                        <div className="ml-8 text-muted-foreground">
                          {faq.answer}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </CardContent>
          </Card>

          {/* Contact Section */}
          <Card className="mt-8">
            <CardContent className="p-8 text-center bg-slate-900 rounded-2xl">
              <h3 className="text-xl font-semibold text-foreground mb-4">Still have questions?</h3>
              <p className="text-muted-foreground mb-6">
                Can't find what you're looking for? Get in touch with our support team.
              </p>
              <Button asChild>
                <Link to="/contact">Contact Us</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
