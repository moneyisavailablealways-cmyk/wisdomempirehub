import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Home, BookOpen, Quote, MessageSquare, Zap } from 'lucide-react';
import { useEffect, useState, useRef, useCallback } from 'react';

const tabs = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Proverbs', href: '/proverbs', icon: BookOpen },
  { name: 'Quotes', href: '/quotes', icon: Quote },
  { name: 'Idioms', href: '/idioms', icon: MessageSquare },
  { name: 'Similes', href: '/similes', icon: Zap },
];

// Haptic feedback utility
const triggerHaptic = () => {
  if ('vibrate' in navigator) {
    navigator.vibrate(10);
  }
};

export function BottomTabs() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const index = tabs.findIndex(tab => tab.href === location.pathname);
    if (index !== -1) setActiveIndex(index);
  }, [location.pathname]);

  // Swipe gesture handlers
  const handleTouchStart = useCallback((e: TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX;
    const swipeDistance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (Math.abs(swipeDistance) > minSwipeDistance) {
      if (swipeDistance > 0 && activeIndex < tabs.length - 1) {
        // Swipe left - go to next tab
        triggerHaptic();
        navigate(tabs[activeIndex + 1].href);
      } else if (swipeDistance < 0 && activeIndex > 0) {
        // Swipe right - go to previous tab
        triggerHaptic();
        navigate(tabs[activeIndex - 1].href);
      }
    }
  }, [activeIndex, navigate]);

  useEffect(() => {
    // Add swipe listeners to the main content area
    const mainElement = document.querySelector('main');
    if (mainElement) {
      mainElement.addEventListener('touchstart', handleTouchStart, { passive: true });
      mainElement.addEventListener('touchend', handleTouchEnd, { passive: true });
    }

    return () => {
      if (mainElement) {
        mainElement.removeEventListener('touchstart', handleTouchStart);
        mainElement.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, [handleTouchStart, handleTouchEnd]);

  const handleTabClick = () => {
    triggerHaptic();
  };

  return (
    <nav 
      ref={containerRef}
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border safe-area-bottom"
    >
      <div className="relative flex items-center justify-around h-16 px-2">
        {/* Animated indicator */}
        <div
          className="absolute bottom-0 h-0.5 bg-primary transition-all duration-300 ease-out"
          style={{
            width: `${100 / tabs.length}%`,
            left: `${(activeIndex * 100) / tabs.length}%`,
          }}
        />
        
        {tabs.map((tab) => (
          <NavLink
            key={tab.name}
            to={tab.href}
            onClick={handleTabClick}
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
