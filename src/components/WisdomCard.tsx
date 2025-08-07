import React, { useState, useEffect } from 'react';
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
import { ShareMenu } from '@/components/ShareMenu';
import { 
  Heart, 
  Volume2, 
  Bot, 
  MoreVertical,
  Edit,
  Download,
  Youtube,
  VolumeX,
  Loader2,
  Bookmark,
  BookmarkCheck
} from 'lucide-react';

interface WisdomItem {
  id: string;
  type: 'proverb' | 'quote' | 'idiom' | 'simile';
  subcategory: string;
  text: string;
  origin: string;
  meaning?: string;
  example?: string;
  video_url?: string;
  audio_voice_type?: 'child' | 'youth' | 'old';
  bg_style?: string;
  user_id?: string;
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
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [showMeaning, setShowMeaning] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isLoadingExplanation, setIsLoadingExplanation] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [autoPlayEnabled, setAutoPlayEnabled] = useState(false);

  // Auto-play audio when enabled
  useEffect(() => {
    if (autoPlayEnabled && !isPlayingAudio) {
      handlePlayAudio();
    }
  }, [autoPlayEnabled]);

  const handleLike = () => {
    setIsLiked(!isLiked);
    toast({
      description: isLiked ? "Removed from favorites" : "Added to favorites ❤️",
      duration: 2000,
    });
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast({
      description: isBookmarked ? "Bookmark removed" : "Bookmarked! 📚",
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

  const handleShowMeaning = () => {
    setShowMeaning(!showMeaning);
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
      <Card className={`group h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${item.bg_style || 'bg-card'} border border-border shadow-sm relative`}>
        <CardContent className="p-6 space-y-4">
          {/* Three-dot menu in top right */}
          <div className="absolute top-4 right-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="opacity-70 hover:opacity-100">
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
                <DropdownMenuItem 
                  onClick={() => setAutoPlayEnabled(!autoPlayEnabled)} 
                  className="gap-2"
                >
                  <Volume2 className="h-4 w-4" />
                  {autoPlayEnabled ? 'Disable' : 'Enable'} Auto-play
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Top Tag */}
          <div className="flex justify-start">
            <Badge className={getTypeColor(item.type)} variant="secondary">
              {item.subcategory}
            </Badge>
          </div>
          
          {/* Main Body */}
          <div className="space-y-3">
            {/* Large, bold text */}
            <blockquote className="text-foreground font-bold text-2xl leading-tight">
              "{item.text}"
            </blockquote>
            
            {/* Origin subtitle */}
            <p className="text-muted-foreground text-sm font-medium">
              — {item.origin}
            </p>
            
            {/* Expandable meaning section */}
            {(item.meaning || showMeaning) && (
              <div className="pt-2 border-t border-border/50">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleShowMeaning}
                  className="mb-3 text-primary hover:text-primary/80"
                >
                  {showMeaning ? 'Hide Meaning' : 'Show Meaning'}
                </Button>
                
                {showMeaning && (
                  <div className="space-y-3 text-sm">
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Meaning:</h4>
                      <p className="text-muted-foreground leading-relaxed">
                        {item.meaning || 'No meaning available yet.'}
                      </p>
                    </div>
                    
                    {item.example && (
                      <div className="bg-accent/50 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">Example:</h4>
                        <p className="text-muted-foreground leading-relaxed">
                          {item.example}
                        </p>
                      </div>
                    )}
                    
                    {/* Audio button in meaning section */}
                    <div className="flex items-center gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePlayAudio}
                        disabled={isPlayingAudio}
                        className="gap-2"
                      >
                        {isPlayingAudio ? (
                          <>
                            <VolumeX className="h-4 w-4" />
                            Stop Audio
                          </>
                        ) : (
                          <>
                            <Volume2 className="h-4 w-4" />
                            Play Audio
                          </>
                        )}
                      </Button>
                      {item.audio_voice_type && (
                        <Badge variant="outline" className="text-xs">
                          {item.audio_voice_type} voice
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Bottom Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                className={`${isLiked ? 'text-red-500 hover:text-red-600' : ''}`}
                title={isLiked ? 'Unlike' : 'Like'}
              >
                <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
              </Button>
              
              {item.video_url && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowVideo(true)}
                  title="Watch video"
                >
                  <Youtube className="h-4 w-4" />
                </Button>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePlayAudio}
                disabled={isPlayingAudio}
                title={isPlayingAudio ? 'Stop audio' : 'Play audio'}
              >
                {isPlayingAudio ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </Button>
            </div>
            
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBookmark}
                className={`${isBookmarked ? 'text-blue-600' : ''}`}
                title={isBookmarked ? 'Remove bookmark' : 'Bookmark'}
              >
                {isBookmarked ? (
                  <BookmarkCheck className="h-4 w-4 fill-current" />
                ) : (
                  <Bookmark className="h-4 w-4" />
                )}
              </Button>
              
              <ShareMenu 
                text={item.text}
                type={item.type}
                origin={item.origin}
                meaning={item.meaning}
              />
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

    </>
  );
}