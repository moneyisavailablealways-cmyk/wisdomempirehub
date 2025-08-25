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
  X
} from 'lucide-react';
import { useState } from 'react';

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

export function AppNavigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const NavItem = ({ item, onClick }: { item: typeof navigation[0], onClick?: () => void }) => (
    <NavLink
      to={item.href}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
          isActive
            ? 'bg-wisdom-blue text-primary-foreground'
            : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
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
                  alt="Wisdom Empire" 
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
                alt="Wisdom Empire" 
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
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}