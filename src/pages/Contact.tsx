import React, { useEffect, useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Minimal SEO: title, meta description, and canonical tag
  useEffect(() => {
    document.title = "Contact Us | Wisdom Empire Hub";

    const desc =
      "Contact Wisdom Empire Hub – questions, suggestions, or feedback about our proverb collection.";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", desc);

    let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
    }
    link.setAttribute("href", window.location.origin + "/contact");
  }, []);

  const onSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    // Placeholder submit handling – integrate your email service here if desired
    setSubmitted(true);
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <main className="min-h-screen bg-background px-4 py-12">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold font-wisdom text-foreground mb-4">
          Contact Us
        </h1>
        <p className="text-lg text-muted-foreground">We'd love to hear from you!</p>
      </header>

      {/* Contact Information Card */}
      <section className="bg-card text-card-foreground p-8 rounded-2xl mb-8 border border-border">
        <p className="text-muted-foreground mb-6">
          If you have questions, suggestions, or feedback about our proverb collection or features, please reach out using the details below:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <article className="flex items-start gap-3">
            <Mail className="h-5 w-5 text-primary mt-1" aria-hidden="true" />
            <div>
              <h3 className="font-semibold text-foreground">Email</h3>
              <p className="text-muted-foreground">support@yourwebsite.com</p>
            </div>
          </article>

          <article className="flex items-start gap-3">
            <Phone className="h-5 w-5 text-primary mt-1" aria-hidden="true" />
            <div>
              <h3 className="font-semibold text-foreground">Phone</h3>
              <p className="text-muted-foreground">+1 (XXX) XXX-XXXX</p>
            </div>
          </article>

          <article className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-primary mt-1" aria-hidden="true" />
            <div>
              <h3 className="font-semibold text-foreground">Address</h3>
              <p className="text-muted-foreground">
                Wisdom Empire Hub
                <br />Youtube: @wisdomempirehub
                <br />TikTok: @wisdomempirehub
                <br />Telegram: t.me/wisdomempire247
              </p>
            </div>
          </article>
        </div>

        <div className="mt-8 p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            We aim to respond to all messages within 48 hours.
          </p>
        </div>
      </section>

      {/* Contact Form Card */}
      <section className="bg-card p-8 rounded-2xl border border-border">
        <h2 className="text-2xl font-bold mb-6 text-center text-foreground">
          Send Us a Message
        </h2>

        <form onSubmit={onSubmit} className="space-y-4 max-w-2xl mx-auto">
          <div className="space-y-2">
            <Label htmlFor="name">Your Name</Label>
            <Input
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Your Email</Label>
            <Input
              id="email"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Your Message</Label>
            <textarea
              id="message"
              name="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="How can we help?"
              rows={5}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              required
            />
          </div>

          <Button type="submit" className="w-full md:w-auto">
            Send Message
          </Button>
        </form>

        {submitted && (
          <p className="mt-4 text-center text-sm text-green-600">
            ✅ Thank you! Your message has been sent.
          </p>
        )}
      </section>
    </main>
  );
}
