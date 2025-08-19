import React, { useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Quote, MessageSquare, Zap, Mail, Phone, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

// Declare global emailjs object from CDN
// @ts-ignore
declare const emailjs: any;

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setShowSuccess(false);

    try {
      // --- Send main message ---
      await emailjs.sendForm(
        "service_27nifab",   // ✅ Your Service ID
        "template_cbc1mss",  // ✅ Your main Template ID
        e.currentTarget
      );

      // --- Send auto-reply ---
      await emailjs.send(
        "service_27nifab",
        "template_wtzkptz", // ✅ Your auto-reply template ID
        {
          to_email: formData.email,        // Recipient (user email)
          from_name: "Wisdom Empire",      // Sender name
          message: "Thank you for contacting us! We’ll respond within 48 hours.", // Auto-reply content
          user_name: formData.name
        }
      );

      setShowSuccess(true);
      setFormData({ name: "", email: "", message: "" });
      toast({
        title: "Message sent successfully!",
        description: "We'll get back to you within 48 hours."
      });
    } catch (error: any) {
      console.error("EmailJS error:", error);
      toast({
        title: "Error sending message",
        description: error.text || "Please try again later."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background px-4 py-12">
      {/* Header */}
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold font-wisdom text-foreground mb-4">Contact Us</h1>
        <p className="text-lg text-muted-foreground">We'd love to hear from you!</p>
      </header>

      <div className="max-w-6xl mx-auto space-y-8">
        {/* Navigation Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <Link to="/proverbs">
            <Button variant="outline" className="flex items-center gap-2"><BookOpen size={16}/> Proverbs</Button>
          </Link>
          <Link to="/quotes">
            <Button variant="outline" className="flex items-center gap-2"><Quote size={16}/> Quotes</Button>
          </Link>
          <Link to="/idioms">
            <Button variant="outline" className="flex items-center gap-2"><MessageSquare size={16}/> Idioms</Button>
          </Link>
          <Link to="/similes">
            <Button variant="outline" className="flex items-center gap-2"><Zap size={16}/> Similes</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div className="bg-gray-800 text-indigo-700 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-6 text-white">Get in Touch</h2>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Mail className="text-indigo-400" size={24} />
                <div>
                  <h3 className="font-semibold text-white">Email</h3>
                  <p className="text-indigo-300">support@yourwebsite.com</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Phone className="text-indigo-400" size={24} />
                <div>
                  <h3 className="font-semibold text-white">Phone</h3>
                  <p className="text-indigo-300">+1 (XXX) XXX-XXXX</p>
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
              <p className="text-sm text-indigo-200">We aim to respond to all messages within 48 hours.</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-gray-800 p-8 rounded-2xl">
            <h2 className="text-2xl font-bold mb-6 text-white text-center">Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-white mb-2">Name</label>
                <Input id="name" name="name" type="text" value={formData.name} onChange={handleInputChange} required placeholder="Your Name" className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-indigo-500"/>
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white mb-2">Email</label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} required placeholder="your@email.com" className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-indigo-500"/>
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-white mb-2">Message</label>
                <Textarea id="message" name="message" value={formData.message} onChange={handleInputChange} required rows={5} placeholder="How can we help you?" className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-indigo-500"/>
              </div>
              <Button type="submit" disabled={isSubmitting} className="w-full bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed">
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
              {showSuccess && (
                <div className="text-center">
                  <p className="text-green-400 font-medium">✅ Thank you! Your message has been sent successfully.</p>
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
