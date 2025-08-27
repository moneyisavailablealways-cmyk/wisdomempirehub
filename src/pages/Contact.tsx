import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { SEOHead } from '@/components/SEOHead';
import { BookOpen, Quote, MessageSquare, Zap, Mail, Phone, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

// Declare global emailjs
// @ts-ignore
declare const emailjs: any;

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      toast({ title: "Error", description: "Please fill all fields.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    setShowSuccess(false);

    try {
      // 1️⃣ Send main message to your inbox
      await (window as any).emailjs.sendForm(
        "service_q8avwdp", // Service ID
        "template_ipobyge", // Template for main message
        e.currentTarget
      );

      // 2️⃣ Send auto-reply to user
      await (window as any).emailjs.sendForm(
        "service_q8avwdp",
        "template_expclr8", // Template for auto-reply
        e.currentTarget
      );

      setShowSuccess(true);
      setFormData({ name: "", email: "", message: "" });

      toast({ title: "Success", description: "Your message has been sent!" });
    } catch (error) {
      console.error("EmailJS error:", error);
      toast({ title: "Error sending message", description: "Please try again later.", variant: "destructive" });
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
      />
      {/* Header Section */}
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold font-wisdom text-foreground mb-4">Connect With Us About Wisdom</h1>
        <p className="max-w-3xl mx-auto text-lg text-muted-foreground">
          Welcome to Wisdom Empire Hub's contact center, where we connect with fellow seekers of wisdom from around the globe.
        </p>
      </header>

      <div className="max-w-6xl mx-auto space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div className="bg-gray-800 text-indigo-700 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-6 text-white">Get in Touch</h2>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Mail className="text-indigo-400" size={24} />
                <div>
                  <p className="text-indigo-300">wisdomempirehub@gmail.com</p>
                  <p className="text-indigo-300">wisdomempire500@gmail.com</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Phone className="text-indigo-400" size={24} />
                <p className="text-indigo-300">You can send us a message with your direct contact</p>
              </div>
              <div className="flex items-start gap-4">
                <MapPin className="text-indigo-400 mt-1" size={24} />
                <div className="text-indigo-300 space-y-1">
                  <p>Youtube: @wisdomempirehub</p>
                  <p>TikTok: @wisdomempirehub</p>
                  <p>Telegram: t.me/wisdomempire247</p>
                </div>
              </div>
            </div>
            <div className="mt-8 p-4 bg-gray-700 rounded-lg">
              <p className="text-sm text-indigo-200">We aim to respond to all messages within 48 hours.</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-gray-800 p-8 rounded-2xl">
            <h2 className="text-2xl font-bold mb-6 text-white text-center">Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-indigo-500"
              />
              <Input
                name="email"
                type="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-indigo-500"
              />
              <Textarea
                name="message"
                placeholder="Your Message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows={5}
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-indigo-500"
              />
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
              {showSuccess && (
                <p className="text-center text-green-400 font-medium mt-2">
                  ✅ Your message has been sent successfully.
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
