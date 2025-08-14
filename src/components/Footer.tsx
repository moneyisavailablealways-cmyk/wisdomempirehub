import { Facebook, MessageCircle, Phone, Twitter, Send, Youtube, Camera, Instagram } from "lucide-react";
import { Link } from "react-router-dom";
const Footer = () => {
  const currentYear = new Date().getFullYear();
  const socialLinks = [{
    name: "Facebook",
    icon: Facebook,
    url: "https://www.facebook.com/share/16kqbQgqTn/",
    color: "text-blue-600"
  }, {
    name: "WhatsApp",
    icon: MessageCircle,
    url: "https://whatsapp.com",
    color: "thttps://whatsapp.com/channel/0029VbApDxq6LwHgjLUyYU3Mext-green-600"
  }, {
    name: "IMO",
    icon: Phone,
    url: "https://imo.im",
    color: "text-purple-600"
  }, {
    name: "X (Twitter)",
    icon: Twitter,
    url: "https://x.com",
    color: "text-gray-900 dark:text-white"
  }, {
    name: "Telegram",
    icon: Send,
    url: "https://t.me/wisdomempire247",
    color: "text-blue-500"
  }, {
    name: "YouTube",
    icon: Youtube,
    url: "https://youtube.com",
    color: "text-red-600"
  }, {
    name: "TikTok",
    icon: Camera,
    url: "https://www.tiktok.com/@wisdomempirehub?is_from_webapp=1&sender_device=pc",
    color: "text-black dark:text-white"
  }, {
    name: "Instagram",
    icon: Instagram,
    url: "https://instagram.com",
    color: "text-pink-600"
  }];
  const quickLinks = [{
    name: "Contact Us",
    path: "/contact"
  }, {
    name: "Donate",
    path: "/donate"
  }, {
    name: "Terms of Use",
    path: "/terms"
  }, {
    name: "Privacy Policy",
    path: "/privacy"
  }, {
    name: "FAQ",
    path: "/faq"
  }];
  return <footer className="w-full border-t border-border bg-background">
      <div className="container mx-auto px-4 py-8 md:py-12 bg-blue-950">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Wisdom Empire</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Discover timeless wisdom through proverbs, quotes, idioms, and similes from cultures around the world.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-md font-medium text-foreground">Quick Links</h4>
            <nav className="flex flex-col space-y-2">
              {quickLinks.map(link => <Link key={link.name} to={link.path} className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 focus:outline-none focus:text-foreground">
                  {link.name}
                </Link>)}
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-md font-medium text-foreground">Contact</h4>
            <div className="space-y-2">
              <a href="mailto:contact@wisdomempire.com" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 focus:outline-none focus:text-foreground block">
                contact@wisdomempire.com
              </a>
            </div>
          </div>

          {/* Social Media */}
          <div className="space-y-4">
            <h4 className="text-md font-medium text-foreground">Follow Us</h4>
            <div className="grid grid-cols-4 gap-3 max-w-48">
              {socialLinks.map(social => {
              const IconComponent = social.icon;
              return <a key={social.name} href={social.url} target="_blank" rel="noopener noreferrer" className="p-2 rounded-md border border-border hover:border-primary/50 hover:bg-accent transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 group" aria-label={`Follow us on ${social.name}`}>
                    <IconComponent size={20} className={`${social.color} group-hover:scale-110 transition-transform duration-200`} />
                  </a>;
            })}
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="mt-8 pt-6 border-t border-border">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
            <p className="text-sm text-muted-foreground">
              © {currentYear} Wisdom Empire. All rights reserved.
            </p>
            <div className="flex space-x-4 text-xs text-muted-foreground">
              <span>Made with wisdom and care</span>
            </div>
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;