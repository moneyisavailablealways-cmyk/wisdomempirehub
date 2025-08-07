import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Quote, MessageSquare, Zap } from 'lucide-react';

interface WisdomNavigationProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  counts: {
    proverbs: number;
    quotes: number;
    idioms: number;
    similes: number;
  };
}

const filterConfig = [
  { 
    key: 'all', 
    label: 'All Wisdom', 
    icon: BookOpen,
    description: 'Browse all content'
  },
  { 
    key: 'proverbs', 
    label: 'Proverbs', 
    icon: BookOpen,
    description: 'Traditional sayings'
  },
  { 
    key: 'quotes', 
    label: 'Quotes', 
    icon: Quote,
    description: 'Inspiring words'
  },
  { 
    key: 'idioms', 
    label: 'Idioms', 
    icon: MessageSquare,
    description: 'Cultural expressions'
  },
  { 
    key: 'similes', 
    label: 'Similes', 
    icon: Zap,
    description: 'Comparative phrases'
  }
];

export function WisdomNavigation({ activeFilter, onFilterChange, counts }: WisdomNavigationProps) {
  const getCount = (key: string) => {
    if (key === 'all') {
      return Object.values(counts).reduce((sum, count) => sum + count, 0);
    }
    return counts[key as keyof typeof counts] || 0;
  };

  return (
    <nav className="w-full bg-card border border-border rounded-xl p-6 shadow-cultural">
      <h3 className="text-lg font-semibold text-foreground mb-4 font-wisdom">
        Explore Wisdom Categories
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
        {filterConfig.map(({ key, label, icon: Icon, description }) => {
          const isActive = activeFilter === key;
          const count = getCount(key);
          
          return (
            <Button
              key={key}
              variant={isActive ? "wisdom" : "outline"}
              onClick={() => onFilterChange(key)}
              className={`flex flex-col items-center gap-2 h-auto p-4 text-center ${
                isActive ? '' : 'hover:bg-secondary/50'
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon className="h-5 w-5" />
                <span className="font-medium">{label}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Badge 
                  variant="secondary" 
                  className={`text-xs ${isActive ? 'bg-primary-foreground/20' : 'bg-wisdom-gold/20'}`}
                >
                  {count} items
                </Badge>
              </div>
              
              <span className="text-xs text-muted-foreground">
                {description}
              </span>
            </Button>
          );
        })}
      </div>
    </nav>
  );
}