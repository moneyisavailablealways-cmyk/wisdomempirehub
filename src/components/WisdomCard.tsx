import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/components/ui/use-toast';
import { useSettings } from '@/contexts/SettingsContext';
import { supabase } from '@/integrations/supabase/client';
import { ShareMenu } from '@/components/ShareMenu';
import { Heart, Volume2, Bot, MoreVertical, Edit, Download, Youtube, VolumeX, Loader2, Bookmark, BookmarkCheck } from 'lucide-react';
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
    case 'proverb':
      return 'bg-gold text-white';
    case 'quote':
      return 'bg-black text-white';
    case 'idiom':
      return 'bg-black text-white';
    case 'simile':
      return 'bg-black text-white';
    default:
      return 'bg-black text-white';
  }
};
export function WisdomCard({
  item
}: WisdomCardProps) {
  const {
    toast
  } = useToast();
  const {
    openAIVoice
  } = useSettings();
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showMeaning, setShowMeaning] = useState(false);
  const [explanation, setExplanation] = useState('');
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
      duration: 2000
    });
  };
  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast({
      description: isBookmarked ? "Bookmark removed" : "Bookmarked! 📚",
      duration: 2000
    });
  };
  const handlePlayAudio = () => {
    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }
    try {
      setIsPlayingAudio(true);
      const utterance = new SpeechSynthesisUtterance(item.text);

      // Configure voice settings based on audio_voice_type
      switch (item.audio_voice_type) {
        case 'child':
          utterance.pitch = 1.5;
          utterance.rate = 1.1;
          break;
        case 'youth':
          utterance.pitch = 1.0;
          utterance.rate = 1.0;
          break;
        case 'old':
          utterance.pitch = 0.8;
          utterance.rate = 0.9;
          break;
        default:
          utterance.pitch = 1.0;
          utterance.rate = 1.0;
      }
      utterance.onend = () => {
        setIsPlayingAudio(false);
      };
      utterance.onerror = () => {
        setIsPlayingAudio(false);
        toast({
          title: "Audio Error",
          description: "Failed to play audio",
          variant: "destructive"
        });
      };
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('Error playing audio:', error);
      setIsPlayingAudio(false);
      toast({
        title: "Audio Error",
        description: "Failed to play audio",
        variant: "destructive"
      });
    }
  };
  const handleShowMeaning = async () => {
    if (showMeaning) {
      setShowMeaning(false);
      return;
    }
    if (explanation) {
      setShowMeaning(true);
      return;
    }
    setIsLoadingExplanation(true);
    try {
      const {
        data,
        error
      } = await supabase.functions.invoke('explain-wisdom', {
        body: {
          text: item.text,
          type: item.type,
          origin: item.origin
        }
      });
      if (error) throw error;
      setExplanation(data.explanation);
      setShowMeaning(true);
    } catch (error) {
      console.error('Error getting explanation:', error);
      toast({
        title: "Explanation Error",
        description: "Failed to generate explanation",
        variant: "destructive"
      });
    } finally {
      setIsLoadingExplanation(false);
    }
  };
  const handleEdit = () => {
    toast({
      description: "Edit functionality coming soon! ✏️",
      duration: 2000
    });
  };
  const handleDownload = () => {
    toast({
      description: "Download functionality coming soon! 📥",
      duration: 2000
    });
  };
  const getVideoEmbedUrl = (url: string) => {
    // Convert various YouTube URL formats to embed format
    const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
    return videoId ? `https://www.youtube.com/embed/${videoId[1]}?autoplay=0&rel=0&modestbranding=1` : url;
  };
  return <>
      <Card className="group h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-card border border-border shadow-sm">
        <CardContent className="p-6 space-y-4">
          {/* Header with type and origin badges */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <Badge className={getTypeColor(item.type)} variant="secondary">
              {item.type.toUpperCase()} • {item.subcategory}
            </Badge>
            <Badge variant="outline" className="text-wisdom-cultural border-wisdom-cultural bg-transparent">
              {item.origin}
            </Badge>
          </div>
          
          {/* Main wisdom text */}
          <blockquote className="text-foreground font-cultural text-xl leading-relaxed font-medium py-4">
            "{item.text}"
          </blockquote>
          
          {/* Inline meaning section */}
          {showMeaning && explanation && <div className="bg-muted/30 rounded-lg p-4 border-l-4 border-blue-500">
              <div className="text-sm text-muted-foreground leading-relaxed">
                {explanation}
              </div>
            </div>}
          
          {/* Action buttons - Optimized layout */}
          <div className="flex items-center justify-between pt-4 border-t border-border bg-zinc-800">
            {/* Primary actions */}
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" onClick={handleLike} className={`${isLiked ? 'text-red-500 hover:text-red-600' : ''}`} title={isLiked ? 'Unlike' : 'Like'}>
                <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
              </Button>
              
              <Button variant="ghost" size="sm" onClick={handlePlayAudio} disabled={isPlayingAudio} title={isPlayingAudio ? 'Stop audio' : 'Play audio'}>
                {isPlayingAudio ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
              
              <button onClick={handleShowMeaning} disabled={isLoadingExplanation} className="text-blue-600 hover:text-blue-800 cursor-pointer text-sm font-medium">
                {isLoadingExplanation ? <span className="flex items-center gap-1">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Loading...
                  </span> : showMeaning ? "Hide" : "Meaning"}
              </button>
            </div>
            
            {/* Secondary actions */}
            <div className="flex items-center gap-1">
              {item.video_url && <Button variant="ghost" size="sm" onClick={() => setShowVideo(true)} title="Watch video">
                  <Youtube className="h-4 w-4" />
                </Button>}
              
              <Button variant="ghost" size="sm" onClick={handleBookmark} className={`${isBookmarked ? 'text-blue-600' : ''}`} title={isBookmarked ? 'Remove bookmark' : 'Bookmark'}>
                {isBookmarked ? <BookmarkCheck className="h-4 w-4 fill-current" /> : <Bookmark className="h-4 w-4" />}
              </Button>
              
              <ShareMenu text={item.text} type={item.type} origin={item.origin} meaning={explanation} />
              
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
                  <DropdownMenuItem onClick={() => setAutoPlayEnabled(!autoPlayEnabled)} className="gap-2">
                    <Volume2 className="h-4 w-4" />
                    {autoPlayEnabled ? 'Disable' : 'Enable'} Auto-play
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Video Dialog */}
      {item.video_url && <Dialog open={showVideo} onOpenChange={setShowVideo}>
          <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle>Video: {item.type} from {item.origin}</DialogTitle>
            </DialogHeader>
            <div className="aspect-video rounded-lg overflow-hidden bg-muted">
              <iframe src={getVideoEmbedUrl(item.video_url)} title={`${item.type} video`} className="w-full h-full border-0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
            </div>
          </DialogContent>
        </Dialog>}

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
    </>;
}