import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

const Contact: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    // Basic SEO for the Contact page
    const title = "Contact Us | Wisdom Empire Hub";
    const description =
      "Contact Wisdom Empire Hub with questions or feedback about proverbs, quotes, idioms, and similes.";
    document.title = title;

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.setAttribute("name", "description");
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute("content", description);

    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", `${window.location.origin}/contact`);
  }, []);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setShowSuccess(false);

    try {
      // Simulate sending. Replace with your email/backend integration if needed.
      await new Promise((r) => setTimeout(r, 800));

      toast({
        title: "Message sent",
        description: "Thank you! We will get back to you within 48 hours.",
      });
      setShowSuccess(true);
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      toast({ title: "Something went wrong", description: "Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="px-4 pt-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground mb-2">Contact Us</h1>
        <p className="text-muted-foreground">We'd love to hear from you!</p>
      </header>

      <main className="container mx-auto px-4 py-10 grid gap-8">
        {/* Quick Navigation */}
        <nav aria-label="Quick navigation" className="flex flex-wrap gap-2 justify-center">
          <Button asChild variant="outline" size="sm">
            <Link to="/proverbs">Proverbs</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link to="/quotes">Quotes</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link to="/idioms">Idioms</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link to="/similes">Similes</Link>
          </Button>
        </nav>

        {/* Contact Info */}
        <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
          <p className="text-muted-foreground mb-6">
            If you have questions, suggestions, or feedback about our proverb collection or features,
            please reach out using the details below:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <div className="shrink-0 h-5 w-5 rounded-full bg-primary/15" aria-hidden />
              <div>
                <h3 className="font-semibold text-foreground">Email</h3>
                <p className="text-muted-foreground">support@yourwebsite.com</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="shrink-0 h-5 w-5 rounded-full bg-primary/15" aria-hidden />
              <div>
                <h3 className="font-semibold text-foreground">Phone</h3>
                <p className="text-muted-foreground">+1 (XXX) XXX-XXXX</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="shrink-0 h-5 w-5 rounded-full bg-primary/15" aria-hidden />
              <div>
                <h3 className="font-semibold text-foreground">Address</h3>
                <p className="text-muted-foreground">
                  Wisdom Empire Hub
                  <br />Youtube: @wisdomempirehub
                  <br />TikTok: @wisdomempirehub
                  <br />Telegram: t.me/wisdomempire247
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-lg bg-muted/40">
            <p className="text-sm text-muted-foreground">We aim to respond to all messages within 48 hours.</p>
          </div>
        </section>

        {/* Contact Form */}
        <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
          <h2 className="text-2xl font-semibold text-center mb-6 text-foreground">Send Us a Message</h2>

          <form onSubmit={onSubmit} className="space-y-5 max-w-2xl mx-auto">
            <div className="grid gap-2">
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Your Name"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Your Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="message">Your Message</Label>
              <Textarea
                id="message"
                name="message"
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                placeholder="How can we help?"
              />
            </div>

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "Sending..." : "Send Message"}
            </Button>

            {showSuccess && (
              <p className="text-sm text-green-600 text-center">
                ✅ Thank you! Your message has been sent.
              </p>
            )}
          </form>
        </section>
      </main>
    </div>
  );
};

export default Contact;
