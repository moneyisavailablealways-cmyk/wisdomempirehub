import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { SEOHead } from '@/components/SEOHead';
import { BookOpen, Quote, MessageSquare, Zap, Mail, Phone, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

// Declare the global emailjs object from the CDN
// @ts-ignore
declare const emailjs: any;

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [emailJSLoaded, setEmailJSLoaded] = useState(false);

  useEffect(() => {
    // Load EmailJS lazily - only when user starts interacting with the form
    const loadEmailJS = () => {
      if (typeof (window as any).emailjs !== 'undefined') {
        setEmailJSLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://cdn.emailjs.com/dist/email.min.js';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        (window as any).emailjs.init("ywpWceEA7xT1f3-P6");
        setEmailJSLoaded(true);
      };
      document.head.appendChild(script);
    };

    // Only load EmailJS when user interacts with any form field
    const handleFirstInteraction = () => {
      loadEmailJS();
      // Remove event listeners after first interaction
      document.removeEventListener('focus', handleFirstInteraction, true);
      document.removeEventListener('click', handleFirstInteraction, true);
    };

    // Add event listeners for user interaction
    document.addEventListener('focus', handleFirstInteraction, true);
    document.addEventListener('click', handleFirstInteraction, true);

    return () => {
      document.removeEventListener('focus', handleFirstInteraction, true);
      document.removeEventListener('click', handleFirstInteraction, true);
    };
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  
  if (!emailJSLoaded) {
    toast({
      title: "Please wait",
      description: "Loading email service..."
    });
    return;
  }

  setIsSubmitting(true);
  setShowSuccess(false);

  try {
    // Send form (main message)
    await (window as any).emailjs.sendForm(
      "service_27nifab",
      "template_cbc1mss",
      e.currentTarget
    );

    setShowSuccess(true);
    setFormData({ name: "", email: "", message: "" });

    toast({
      title: "Message sent successfully!",
      description: "We'll get back to you within 48 hours."
    });
  } catch (error) {
    toast({
      title: "Error sending message",
      description: "Please try again later."
    });
    console.error("EmailJS error:", error);
  } finally {
    setIsSubmitting(false);
  }
};


  return (
    <div className="min-h-screen bg-background px-4 py-12">
      <SEOHead
        title="Wisdom Empire Hub - Connect With Us About Wisdom"
        description="Contact Wisdom Empire Hub for inquiries, collaboration, or support in spreading global wisdom and educational content."
        keywords="wisdom, contact wisdom empire, cultural wisdom support, global wisdom, educational content, wisdom collaboration"
        canonical={typeof window !== 'undefined' ? window.location.href : ''}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          "name": "Wisdom Empire Hub - Connect With Us About Wisdom",
          "url": "https://wisdomempirehub.com/contact",
          "description": "Contact Wisdom Empire Hub for inquiries, collaboration, or support in spreading global wisdom and educational content."
        }}
      />
      {/* Header Section */}
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold font-wisdom text-foreground mb-4">Connect With Us About Wisdom</h1>
        <div className="max-w-3xl mx-auto text-lg text-muted-foreground">
          <p className="mb-4">
            Welcome to Wisdom Empire Hub's contact center, where we connect with fellow seekers of wisdom from around the globe. Whether you have questions about our cultural wisdom collection, want to collaborate on preserving traditional knowledge, or need support navigating our educational resources, we're here to help you on your journey of discovering timeless wisdom.
          </p>
          <p>
            Our team is passionate about sharing the profound wisdom embedded in proverbs, quotes, idioms, and similes from diverse cultures. We believe that wisdom transcends boundaries and connects us all through shared human experiences and universal truths that have guided humanity for generations.
          </p>
        </div>
      </header>

      <div className="max-w-6xl mx-auto space-y-8">
        {/* Quick Navigation */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <Link to="/proverbs">
            <Button variant="outline" className="flex items-center gap-2">
              <BookOpen size={16} /> Proverbs
            </Button>
          </Link>
          <Link to="/quotes">
            <Button variant="outline" className="flex items-center gap-2">
              <Quote size={16} /> Quotes
            </Button>
          </Link>
          <Link to="/idioms">
            <Button variant="outline" className="flex items-center gap-2">
              <MessageSquare size={16} /> Idioms
            </Button>
          </Link>
          <Link to="/similes">
            <Button variant="outline" className="flex items-center gap-2">
              <Zap size={16} /> Similes
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Info Card */}
          <div className="bg-gray-800 text-indigo-700 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-6 text-white">Get in Touch</h2>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Mail className="text-indigo-400" size={24} />
                <div>
                  <h3 className="font-semibold text-white">Email 1</h3>
                  <p className="text-indigo-300">wisdomempirehub@gmail.com</p>
                   <h3 className="font-semibold text-white">Email 2</h3>
                  <p className="text-indigo-300">wisdomempire500@gmail.com</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Phone className="text-indigo-400" size={24} />
                <div>
                  <h3 className="font-semibold text-white">Phone</h3>
                  <p className="text-indigo-300">You can send us a message with your direct contact</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <MapPin className="text-indigo-400 mt-1" size={24} />
                <div>
                  <h3 className="font-semibold text-white">Connect With Us</h3>
                  <div className="text-indigo-300 space-y-1">
                    <p>Youtube: @wisdomempirehub</p>
                    <p>TikTok: @wisdomempirehub</p>
                    <p>Telegram: t.me/wisdomempire247</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-gray-700 rounded-lg">
              <p className="text-sm text-indigo-200">
                We aim to respond to all messages within 48 hours.
              </p>
            </div>
          </div>

          {/* Contact Form Card */}
          <div className="bg-gray-800 p-8 rounded-2xl">
            <h2 className="text-2xl font-bold mb-6 text-white text-center">
              Send Us a Message
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-white mb-2">Name</label>
                <Input
                  id="name"
                  name="name" // ✅ Must match {{name}}
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Your Name"
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white mb-2">Email</label>
                <Input
                  id="email"
                  name="email" // ✅ Must match {{email}}
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="your@email.com"
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-white mb-2">Message</label>
                <Textarea
                  id="message"
                  name="message" // ✅ Must match {{message}}
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={5}
                  placeholder="How can we help you?"
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-indigo-500"
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>

              {showSuccess && (
                <div className="text-center">
                  <p className="text-green-400 font-medium">
                    ✅ Thank you! Your message has been sent successfully.
                  </p>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
