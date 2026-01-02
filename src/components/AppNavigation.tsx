import React from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { SettingsMenu } from '@/components/SettingsMenu';
import { AuthButton } from '@/components/AuthButton';
import { 
  Home, 
  BookOpen, 
  Quote, 
  MessageSquare, 
  Zap, 
  Heart,
  Mail,
  HelpCircle,
  Menu,
  X,
  Users
} from 'lucide-react';
import { useState } from 'react';
import { 
  Facebook, 
  Twitter, 
  Youtube, 
  Instagram 
} from 'lucide-react';

const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Proverbs', href: '/proverbs', icon: BookOpen },
  { name: 'Quotes', href: '/quotes', icon: Quote },
  { name: 'Idioms', href: '/idioms', icon: MessageSquare },
  { name: 'Similes', href: '/similes', icon: Zap },
  { name: 'Donate', href: '/donate', icon: Heart },
  { name: 'Contact', href: '/contact', icon: Mail },
  { name: 'FAQ', href: '/faq', icon: HelpCircle },
];

const socialLinks = [
  { name: 'Facebook', icon: Facebook, url: 'https://www.facebook.com/share/16kqbQgqTn/' },
  { name: 'X (Twitter)', icon: Twitter, url: 'https://x.com/wisdomempirehub' },
  { name: 'YouTube', icon: Youtube, url: 'https://youtube.com/@wisdomempirehub' },
  { name: 'Instagram', icon: Instagram, url: 'https://www.instagram.com/wisdomempirehb' },
];

export function AppNavigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const NavItem = ({ item, onClick }: { item: typeof navigation[0], onClick?: () => void }) => (
    <NavLink
      to={item.href}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
          isActive
            ? 'bg-secondary text-secondary-foreground'
            : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
        }`
      }
    >
      <item.icon className="h-4 w-4" />
      {item.name}
    </NavLink>
  );

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex bg-card border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <NavLink to="/" className="flex items-center gap-2">
                <img 
                  src="/lovable-uploads/logo-optimized.webp" 
                  alt="Logo" 
                  className="h-8 w-8 object-contain"
                />
                <div className="text-2xl font-bold font-wisdom text-wisdom-gold">
                  Wisdom Empire
                </div>
              </NavLink>
              
              <div className="flex items-center gap-1">
                {navigation.map((item) => (
                  <NavItem key={item.name} item={item} />
                ))}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <SettingsMenu />
              <AuthButton />
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="md:hidden bg-card border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <NavLink to="/" className="flex items-center gap-2">
              <img 
                src="/lovable-uploads/logo-optimized.webp" 
                alt="Logo" 
                className="h-6 w-6 object-contain"
              />
              <div className="text-xl font-bold font-wisdom text-wisdom-gold">
                Wisdom Empire
              </div>
            </NavLink>
            
            <div className="flex items-center gap-2">
              <SettingsMenu />
              <AuthButton />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
          
          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="border-t border-border py-4">
              <div className="flex flex-col gap-1">
                {navigation.map((item) => (
                  <NavItem 
                    key={item.name} 
                    item={item} 
                    onClick={() => setIsMobileMenuOpen(false)}
                  />
                ))}
                
                {/* Follow Us Section */}
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground">
                    <Users className="h-4 w-4" />
                    Follow Us
                  </div>
                  <div className="flex items-center gap-3 px-3 py-2">
                    {socialLinks.map((social) => (
                      <a
                        key={social.name}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-md border border-border hover:border-primary/50 hover:bg-accent transition-all duration-200"
                        aria-label={`Follow us on ${social.name}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <social.icon size={18} className="text-foreground" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}