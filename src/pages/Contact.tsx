import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin, BookOpen, Quote, MessageSquare, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import emailjs from 'emailjs-com';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    emailjs
      .send(
        'YOUR_SERVICE_ID',   // replace with your EmailJS Service ID
        'YOUR_TEMPLATE_ID',  // replace with your EmailJS Template ID
        formData,
        'YOUR_PUBLIC_KEY'    // replace with your EmailJS Public Key
      )
      .then(() => {
        setSubmitted(true);
        setLoading(false);
        setFormData({ name: '', email: '', message: '' });
      })
      .catch((error) => {
        console.error('EmailJS Error:', error);
        setLoading(false);
      });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* SEO Meta Tags */}
      <title>Contact Us - Wisdom Empire</title>
      <meta
        name="description"
        content="Contact Wisdom Empire for questions, suggestions, or feedback about our proverb collection and features. Get in touch with our support team."
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
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold font-wisdom text-foreground mb-4">Contact Us</h1>
            <p className="text-lg text-muted-foreground">We'd love to hear from you!</p>
          </div>

          {/* Contact Information */}
          <Card className="mb-8 text-indigo-700">
            <CardContent className="p-8 bg-gray-800">
              <p className="text-muted-foreground mb-6">
                If you have questions, suggestions, or feedback about our proverb collection or features, please reach out using the details below:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-wisdom-gold mt-1" />
                  <div className="text-green-800">
                    <h3 className="font-semibold text-foreground">Email</h3>
                    <p className="text-muted-foreground">support@yourwebsite.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-wisdom-gold mt-1" />
                  <div className="text-green-950">
                    <h3 className="font-semibold text-foreground">Phone</h3>
                    <p className="text-muted-foreground">+1 (XXX) XXX-XXXX</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-wisdom-gold mt-1" />
                  <div className="text-green-800">
                    <h3 className="font-semibold text-foreground">Address</h3>
                    <p className="text-muted-foreground">
                      Wisdom Empire Hub<br />
                      To locate more wisdom, follow us on:<br />
                      Youtube: @wisdomempirehub<br />
                      TikTok: @wisdomempirehub<br />
                      Telegram: t.me/wisdomempire247
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

          {/* Contact Form */}
          <Card className="p-8 bg-gray-800">
            <h2 className="text-2xl font-bold mb-6 text-center text-white">Send Us a Message</h2>

            {submitted ? (
              <p className="text-green-400 text-center font-medium">
                ✅ Thank you! Your message has been sent.
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-xl focus:ring focus:ring-indigo-200"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-xl focus:ring focus:ring-indigo-200"
                />
                <textarea
                  name="message"
                  placeholder="Your Message"
                  rows={4}
                  required
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-xl focus:ring focus:ring-indigo-200"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 transition"
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Contact;
