import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Share, 
  Facebook, 
  MessageCircle, 
  Phone, 
  Twitter, 
  Send, 
  Youtube, 
  Camera, 
  Instagram 
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface ShareMenuProps {
  text: string;
  type: string;
  origin: string;
  meaning?: string;
}

export function ShareMenu({ text, type, origin, meaning }: ShareMenuProps) {
  const { toast } = useToast();

  const shareText = `"${text}" - ${type} from ${origin}${meaning ? '\n\nMeaning: ' + meaning : ''}`;
  const encodedText = encodeURIComponent(shareText);
  const encodedUrl = encodeURIComponent(window.location.href);

  const socialPlatforms = [
    {
      name: 'Facebook',
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`,
      color: 'text-interactive-primary'
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      url: `https://wa.me/?text=${encodedText} ${encodedUrl}`,
      color: 'text-green-600'
    },
    {
      name: 'IMO',
      icon: Phone,
      url: `https://imo.im/share?text=${encodedText}`,
      color: 'text-purple-600'
    },
    {
      name: 'X (Twitter)',
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
      color: 'text-gray-900 dark:text-white'
    },
    {
      name: 'Telegram',
      icon: Send,
      url: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
      color: 'text-blue-500'
    },
    {
      name: 'Instagram',
      icon: Instagram,
      url: `https://www.instagram.com/`,
      color: 'text-pink-600'
    },
    {
      name: 'YouTube',
      icon: Youtube,
      url: `https://www.youtube.com/`,
      color: 'text-red-600'
    },
    {
      name: 'TikTok',
      icon: Camera,
      url: `https://www.tiktok.com/`,
      color: 'text-black dark:text-white'
    }
  ];

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${type} from ${origin}`,
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

  const handlePlatformShare = (platform: typeof socialPlatforms[0]) => {
    if (platform.name === 'Instagram' || platform.name === 'YouTube' || platform.name === 'TikTok') {
      // For platforms that don't have direct text sharing, copy to clipboard
      navigator.clipboard.writeText(shareText);
      toast({
        description: `Text copied! Open ${platform.name} to share manually 📋`,
        duration: 3000,
      });
      // Still open the platform
      window.open(platform.url, '_blank', 'noopener,noreferrer');
    } else {
      window.open(platform.url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" title="Share">
          <Share className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={handleNativeShare} className="gap-2">
          <Share className="h-4 w-4" />
          Quick Share
        </DropdownMenuItem>
        <div className="border-t my-1" />
        {socialPlatforms.map((platform) => {
          const IconComponent = platform.icon;
          return (
            <DropdownMenuItem
              key={platform.name}
              onClick={() => handlePlatformShare(platform)}
              className="gap-2"
            >
              <IconComponent className={`h-4 w-4 ${platform.color}`} />
              {platform.name}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}