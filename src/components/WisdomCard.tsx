import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/components/ui/use-toast';
import { useSettings } from '@/contexts/SettingsContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  Heart, 
  Play, 
  Volume2, 
  Bot, 
  Share, 
  MoreVertical,
  Edit,
  Download,
  Youtube,
  VolumeX,
  Loader2
} from 'lucide-react';

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
    case 'idiom': return 'bg-wisdom-cultural text-wisdom-blue';
    case 'simile': return 'bg-secondary text-secondary-foreground';
    default: return 'bg-primary text-primary-foreground';
  }
};

export function WisdomCard({ item }: WisdomCardProps) {
  const { toast } = useToast();
  const { openAIVoice } = useSettings();
  const [isLiked, setIsLiked] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [explanation, setExplanation] = useState('');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isLoadingExplanation, setIsLoadingExplanation] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);

  const handleLike = () => {
    setIsLiked(!isLiked);
    toast({
      description: isLiked ? "Removed from favorites" : "Added to favorites ❤️",
      duration: 2000,
    });
  };

  const handlePlayAudio = async () => {
    if (isPlayingAudio && currentAudio) {
      currentAudio.pause();
      setIsPlayingAudio(false);
      setCurrentAudio(null);
      return;
    }

    try {
      setIsPlayingAudio(true);
      
      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: { 
          text: item.text, 
          voice: openAIVoice 
        }
      });

      if (error) throw error;

      const audio = new Audio(`data:audio/mp3;base64,${data.audioContent}`);
      setCurrentAudio(audio);
      
      audio.onended = () => {
        setIsPlayingAudio(false);
        setCurrentAudio(null);
      };
      
      audio.onerror = () => {
        setIsPlayingAudio(false);
        setCurrentAudio(null);
        toast({
          title: "Audio Error",
          description: "Failed to play audio",
          variant: "destructive",
        });
      };

      await audio.play();
    } catch (error) {
      console.error('Error playing audio:', error);
      setIsPlayingAudio(false);
      setCurrentAudio(null);
      toast({
        title: "Audio Error",
        description: "Failed to generate or play audio",
        variant: "destructive",
      });
    }
  };

  const handleShowMeaning = async () => {
    if (explanation) {
      setShowExplanation(true);
      return;
    }

    setIsLoadingExplanation(true);
    try {
      const { data, error } = await supabase.functions.invoke('explain-wisdom', {
        body: { 
          text: item.text, 
          type: item.type,
          origin: item.origin
        }
      });

      if (error) throw error;

      setExplanation(data.explanation);
      setShowExplanation(true);
    } catch (error) {
      console.error('Error getting explanation:', error);
      toast({
        title: "Explanation Error",
        description: "Failed to generate explanation",
        variant: "destructive",
      });
    } finally {
      setIsLoadingExplanation(false);
    }
  };

  const handleShare = async () => {
    const shareText = `"${item.text}" - ${item.type} from ${item.origin}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${item.type} from ${item.origin}`,
          text: shareText,
          url: window.location.href,
        });
      } catch (error) {
        // User cancelled or error occurred
      }
    } else {
      // Fallback to clipboard
      await navigator.clipboard.writeText(shareText);
      toast({
        description: "Copied to clipboard! 📋",
        duration: 2000,
      });
    }
  };

  const handleEdit = () => {
    toast({
      description: "Edit functionality coming soon! ✏️",
      duration: 2000,
    });
  };

  const handleDownload = () => {
    toast({
      description: "Download functionality coming soon! 📥",
      duration: 2000,
    });
  };

  const getVideoEmbedUrl = (url: string) => {
    // Convert various YouTube URL formats to embed format
    const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
    return videoId ? `https://www.youtube.com/embed/${videoId[1]}?rel=0&modestbranding=1` : url;
  };

  return (
    <>
      <Card className="group h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-card border border-border shadow-sm">
        <CardContent className="p-6 space-y-4">
          {/* Header with type and origin badges */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <Badge className={getTypeColor(item.type)} variant="secondary">
              {item.type.toUpperCase()} • {item.subcategory}
            </Badge>
            <Badge variant="outline" className="text-wisdom-cultural border-wisdom-cultural">
              {item.origin}
            </Badge>
          </div>
          
          {/* Main wisdom text */}
          <blockquote className="text-foreground font-cultural text-xl leading-relaxed font-medium py-4">
            "{item.text}"
          </blockquote>
          
          {/* Action buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                className={`gap-1 ${isLiked ? 'text-red-500 hover:text-red-600' : ''}`}
              >
                <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                {isLiked ? 'Liked' : 'Like'}
              </Button>
              
              {item.video_url && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowVideo(true)}
                  className="gap-1"
                >
                  <Youtube className="h-4 w-4" />
                  Watch
                </Button>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePlayAudio}
                disabled={isPlayingAudio}
                className="gap-1"
              >
                {isPlayingAudio ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
                {isPlayingAudio ? 'Stop' : 'Listen'}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShowMeaning}
                disabled={isLoadingExplanation}
                className="gap-1"
              >
                {isLoadingExplanation ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Bot className="h-4 w-4" />
                )}
                Meaning
              </Button>
            </div>
            
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="gap-1"
              >
                <Share className="h-4 w-4" />
                Share
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleEdit} className="gap-2">
                    <Edit className="h-4 w-4" />
                    Edit text
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDownload} className="gap-2">
                    <Download className="h-4 w-4" />
                    Download card
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Video Dialog */}
      {item.video_url && (
        <Dialog open={showVideo} onOpenChange={setShowVideo}>
          <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle>Video: {item.type} from {item.origin}</DialogTitle>
            </DialogHeader>
            <div className="aspect-video rounded-lg overflow-hidden bg-muted">
              <iframe
                src={getVideoEmbedUrl(item.video_url)}
                title={`${item.type} video`}
                className="w-full h-full border-0"
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Explanation Dialog */}
      <Dialog open={showExplanation} onOpenChange={setShowExplanation}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              Meaning & Significance
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <blockquote className="text-foreground font-cultural text-lg italic border-l-4 border-wisdom-gold pl-4">
              "{item.text}"
            </blockquote>
            <div className="text-muted-foreground leading-relaxed">
              {explanation}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}