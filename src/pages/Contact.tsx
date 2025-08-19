import { useEffect, useState, FormEvent } from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Basic SEO
    const title = "Contact Us | Wisdom Empire Hub";
    document.title = title;

    const metaName = "description";
    const description = "Contact Wisdom Empire Hub – questions, suggestions, or feedback.";
    let meta = document.querySelector(`meta[name="${metaName}"]`) as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = metaName;
      document.head.appendChild(meta);
    }
    meta.content = description;

    // Canonical tag
    const href = window.location.origin + "/contact";
    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = href;
  }, []);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccess(false);

    // Placeholder submission. Integrate EmailJS or backend later if needed.
    await new Promise((r) => setTimeout(r, 800));

    setSubmitting(false);
    setSuccess(true);
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <main className="min-h-screen bg-background px-4 py-12">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold font-wisdom text-foreground mb-4">Contact Us</h1>
        <p className="text-lg text-muted-foreground">We'd love to hear from you!</p>
      </header>

      <section aria-labelledby="contact-info" className="bg-card text-card-foreground p-8 rounded-2xl mb-8 border border-border">
        <p className="text-muted-foreground mb-6">
          If you have questions, suggestions, or feedback about our proverb collection or features, please reach out using the details below:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-3">
            <Mail className="h-5 w-5 text-primary mt-1" />
            <div>
              <h3 className="font-semibold text-foreground">Email</h3>
              <p className="text-muted-foreground">support@yourwebsite.com</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Phone className="h-5 w-5 text-primary mt-1" />
            <div>
              <h3 className="font-semibold text-foreground">Phone</h3>
              <p className="text-muted-foreground">+1 (XXX) XXX-XXXX</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-primary mt-1" />
            <div>
              <h3 className="font-semibold text-foreground">Address</h3>
              <p className="text-muted-foreground">
                Wisdom Empire Hub<br />
                Youtube: @wisdomempirehub<br />
                TikTok: @wisdomempirehub<br />
                Telegram: t.me/wisdomempire247
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">We aim to respond to all messages within 48 hours.</p>
        </div>
      </section>

      <section aria-labelledby="contact-form" className="bg-card p-8 rounded-2xl border border-border">
        <h2 id="contact-form" className="text-2xl font-bold mb-6 text-center text-foreground">
          Send Us a Message
        </h2>

        <form onSubmit={onSubmit} className="space-y-4">
          <Input
            name="name"
            placeholder="Your Name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            type="email"
            name="email"
            placeholder="Your Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Textarea
            name="message"
            placeholder="Your Message"
            rows={4}
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "Sending..." : "Send Message"}
          </Button>
        </form>

        {success && (
          <p className="mt-4 text-center text-sm text-foreground">✅ Thank you! Your message has been sent.</p>
        )}
      </section>
    </main>
  );
}
