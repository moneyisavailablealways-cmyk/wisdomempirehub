import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/components/ui/use-toast';
import { useSettings } from '@/contexts/SettingsContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { ShareMenu } from '@/components/ShareMenu';
import { Heart, Volume2, Bot, MoreVertical, Edit, Download, Youtube, VolumeX, Loader2, Bookmark, BookmarkCheck } from 'lucide-react';
import html2canvas from 'html2canvas';
import { useTTS } from '@/hooks/useTTS';
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
      return 'bg-ocean-blue text-primary-foreground';
    case 'quote':
      return 'bg-ocean-coral text-primary-foreground';
    case 'idiom':
      return 'bg-ocean-teal text-primary-foreground';
    case 'simile':
      return 'bg-ocean-navy text-primary-foreground';
    default:
      return 'bg-ocean-slate text-primary-foreground';
  }
};
export function WisdomCard({
  item
}: WisdomCardProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const { isPlaying: isPlayingAudio, togglePlayback } = useTTS();
  const { isPlaying: isPlayingMeaningAudio, togglePlayback: toggleMeaningPlayback } = useTTS();
  const cardRef = useRef<HTMLDivElement>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showMeaning, setShowMeaning] = useState(false);
  const [explanation, setExplanation] = useState('');
  const [isLoadingExplanation, setIsLoadingExplanation] = useState(false);
  const [autoPlayEnabled, setAutoPlayEnabled] = useState(false);
  const [cardBackgroundState, setCardBackgroundState] = useState('default');

  // Auto-play audio when enabled
  useEffect(() => {
    if (autoPlayEnabled && !isPlayingAudio) {
      togglePlayback(item.text);
    }
  }, [autoPlayEnabled, item.text, isPlayingAudio, togglePlayback]);
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
    togglePlayback(item.text);
  };
  const handlePlayMeaningAudio = () => {
    if (!explanation) return;
    toggleMeaningPlayback(explanation);
  };
  const handleShowMeaning = async () => {
    if (showMeaning) {
      setShowMeaning(false);
      // Stop meaning audio when hiding - handled by the TTS hook
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
  const handleDownload = async () => {
    if (!user) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to download cards as PNG files",
        variant: "destructive"
      });
      return;
    }
    if (!cardRef.current) return;
    try {
      toast({
        description: "Generating your card image...",
        duration: 2000
      });
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#0f172a',
        // slate-900 background
        scale: 2,
        // Higher quality
        useCORS: true,
        allowTaint: true
      });

      // Convert to blob
      canvas.toBlob(blob => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `wisdom-card-${item.type}-${item.id}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          toast({
            description: "Card downloaded successfully! 📥",
            duration: 2000
          });
        }
      }, 'image/png', 0.9);
    } catch (error) {
      console.error('Error downloading card:', error);
      toast({
        title: "Download Error",
        description: "Failed to download card. Please try again.",
        variant: "destructive"
      });
    }
  };
  const getVideoEmbedUrl = (url: string) => {
    // Convert various YouTube URL formats to embed format
    const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
    return videoId ? `https://www.youtube.com/embed/${videoId[1]}?autoplay=0&rel=0&modestbranding=1` : url;
  };
  return <>
      <Card ref={cardRef} className="group h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-border shadow-sm bg-slate-900">
        <CardContent className="p-6 space-y-4">
          {/* Header with type and origin badges */}
          <div className="flex items-center justify-between flex-wrap gap-2 bg-zinc-300 rounded">
            <Badge className={getTypeColor(item.type)} variant="secondary">
              {item.type.toUpperCase()} • {item.subcategory}
            </Badge>
            <Badge variant="outline" className="text-ocean-teal border-ocean-teal bg-blue-700 rounded">
              {item.origin}
            </Badge>
          </div>
          
          {/* Main wisdom text */}
          <blockquote className="text-foreground font-cultural text-xl leading-relaxed font-medium py-4">
            "{item.text}"
          </blockquote>
          
          {/* Inline meaning section */}
          {showMeaning && explanation && <div className="bg-muted/30 rounded-lg p-4 border-l-4 border-blue-500">
              <div className="flex items-start gap-2">
                <div className="text-sm text-muted-foreground leading-relaxed flex-1">
                  {explanation}
                </div>
                <Button variant="ghost" size="sm" onClick={handlePlayMeaningAudio} disabled={isPlayingMeaningAudio} title={isPlayingMeaningAudio ? 'Stop meaning audio' : 'Play meaning audio'} className="shrink-0">
                  {isPlayingMeaningAudio ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
              </div>
            </div>}
          
          {/* Action buttons - Optimized layout */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
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