import { NavLink } from 'react-router-dom';
import { Home, BookOpen, Quote, MessageSquare, Zap } from 'lucide-react';

const tabs = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Proverbs', href: '/proverbs', icon: BookOpen },
  { name: 'Quotes', href: '/quotes', icon: Quote },
  { name: 'Idioms', href: '/idioms', icon: MessageSquare },
  { name: 'Similes', href: '/similes', icon: Zap },
];

export function BottomTabs() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border safe-area-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {tabs.map((tab) => (
          <NavLink
            key={tab.name}
            to={tab.href}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 py-2 px-3 rounded-lg transition-colors min-w-0 flex-1 ${
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <tab.icon className={`h-5 w-5 ${isActive ? 'stroke-[2.5]' : ''}`} />
                <span className="text-xs font-medium truncate">{tab.name}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
