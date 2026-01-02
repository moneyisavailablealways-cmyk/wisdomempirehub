import { NavLink, useLocation } from 'react-router-dom';
import { Home, BookOpen, Quote, MessageSquare, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';

const tabs = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Proverbs', href: '/proverbs', icon: BookOpen },
  { name: 'Quotes', href: '/quotes', icon: Quote },
  { name: 'Idioms', href: '/idioms', icon: MessageSquare },
  { name: 'Similes', href: '/similes', icon: Zap },
];

export function BottomTabs() {
  const location = useLocation();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const index = tabs.findIndex(tab => tab.href === location.pathname);
    if (index !== -1) setActiveIndex(index);
  }, [location.pathname]);

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border safe-area-bottom">
      <div className="relative flex items-center justify-around h-16 px-2">
        {/* Animated indicator */}
        <div
          className="absolute bottom-0 h-0.5 bg-primary transition-all duration-300 ease-out"
          style={{
            width: `${100 / tabs.length}%`,
            left: `${(activeIndex * 100) / tabs.length}%`,
          }}
        />
        
        {tabs.map((tab, index) => (
          <NavLink
            key={tab.name}
            to={tab.href}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 py-2 px-3 rounded-lg min-w-0 flex-1 transition-all duration-200 ${
                isActive
                  ? 'text-primary scale-105'
                  : 'text-muted-foreground hover:text-foreground'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <tab.icon 
                  className={`h-5 w-5 transition-all duration-200 ${
                    isActive ? 'stroke-[2.5] animate-tab-bounce' : ''
                  }`} 
                />
                <span className={`text-xs font-medium truncate transition-all duration-200 ${
                  isActive ? 'font-semibold' : ''
                }`}>
                  {tab.name}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
