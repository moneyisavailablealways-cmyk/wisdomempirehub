import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, Volume2 } from 'lucide-react';

interface WisdomItem {
  id: string;
  type: 'proverb' | 'quote' | 'idiom' | 'simile';
  subcategory: string;
  text: string;
  origin: string;
  video_url?: string;
  audio_voice_type?: 'child' | 'youth' | 'old';
  created_at: string;
}

interface WisdomCardProps {
  item: WisdomItem;
}

const getTypeColor = (type: string) => {
  switch (type) {
    case 'proverb': return 'bg-wisdom-blue text-primary-foreground';
    case 'quote': return 'bg-wisdom-gold text-wisdom-blue';
    case 'idiom': return 'bg-wisdom-cultural text-primary-foreground';
    case 'simile': return 'bg-gradient-cultural text-wisdom-blue';
    default: return 'bg-primary text-primary-foreground';
  }
};

const getVoiceIcon = (voiceType?: string) => {
  switch (voiceType) {
    case 'child': return '👶';
    case 'youth': return '🧑';
    case 'old': return '👴';
    default: return '🎙️';
  }
};

export function WisdomCard({ item }: WisdomCardProps) {
  return (
    <Card className="group h-full transition-all duration-300 hover:shadow-wisdom hover:-translate-y-1 bg-card border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <Badge className={getTypeColor(item.type)} variant="secondary">
            {item.type.toUpperCase()}
          </Badge>
          <Badge variant="outline" className="text-wisdom-cultural border-wisdom-cultural">
            {item.origin}
          </Badge>
        </div>
        <Badge variant="secondary" className="w-fit bg-secondary/50">
          {item.subcategory}
        </Badge>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <blockquote className="text-foreground font-cultural text-lg leading-relaxed italic border-l-4 border-wisdom-gold pl-4">
          "{item.text}"
        </blockquote>
        
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="flex items-center gap-2">
            {item.audio_voice_type && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Volume2 className="h-4 w-4" />
                <span>{getVoiceIcon(item.audio_voice_type)}</span>
                <span className="capitalize">{item.audio_voice_type}</span>
              </div>
            )}
          </div>
          
          {item.video_url && (
            <div className="flex items-center gap-1 text-sm text-wisdom-blue cursor-pointer hover:text-wisdom-cultural transition-colors">
              <Play className="h-4 w-4" />
              <span>Watch</span>
            </div>
          )}
        </div>
        
        {item.video_url && (
          <div className="mt-4 rounded-lg overflow-hidden aspect-video bg-muted">
            <iframe
              src={item.video_url}
              title={`${item.type} video`}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}