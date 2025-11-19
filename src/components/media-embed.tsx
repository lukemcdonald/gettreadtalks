'use client';

import { useMemo } from 'react';

import { cn } from '@/utils';

type MediaEmbedProps = {
  className?: string;
  mediaUrl: string;
  type?: 'audio' | 'video';
};

const YOUTUBE_PATTERNS = [
  /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
  /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
];

const VIMEO_PATTERNS = [/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/];

const VIDEO_EXTENSION_PATTERN = /\.(mp4|webm|ogg|mov)(\?|$)/i;

const AUDIO_EXTENSION_PATTERN = /\.(mp3|wav|ogg|m4a|aac)(\?|$)/i;

/**
 * Parse YouTube URL and extract video ID
 */
function parseYouTubeUrl(url: string): string | null {
  for (const pattern of YOUTUBE_PATTERNS) {
    const match = url.match(pattern);
    if (match?.[1]) {
      return match[1];
    }
  }

  return null;
}

/**
 * Parse Vimeo URL and extract video ID
 */
function parseVimeoUrl(url: string): string | null {
  for (const pattern of VIMEO_PATTERNS) {
    const match = url.match(pattern);
    if (match?.[1]) {
      return match[1];
    }
  }

  return null;
}

/**
 * Determine media type from URL
 */
function detectMediaType(url: string): 'youtube' | 'vimeo' | 'video' | 'audio' | 'unknown' {
  if (parseYouTubeUrl(url)) {
    return 'youtube';
  }
  if (parseVimeoUrl(url)) {
    return 'vimeo';
  }
  if (VIDEO_EXTENSION_PATTERN.test(url)) {
    return 'video';
  }
  if (AUDIO_EXTENSION_PATTERN.test(url)) {
    return 'audio';
  }

  return 'unknown';
}

export function MediaEmbed({ className, mediaUrl, type }: MediaEmbedProps) {
  const embedConfig = useMemo(() => {
    const detectedType = type || detectMediaType(mediaUrl);

    if (detectedType === 'youtube') {
      const videoId = parseYouTubeUrl(mediaUrl);
      if (videoId) {
        return {
          embedUrl: `https://www.youtube.com/embed/${videoId}`,
          type: 'youtube' as const,
        };
      }
    }

    if (detectedType === 'vimeo') {
      const videoId = parseVimeoUrl(mediaUrl);
      if (videoId) {
        return {
          embedUrl: `https://player.vimeo.com/video/${videoId}`,
          type: 'vimeo' as const,
        };
      }
    }

    if (detectedType === 'video' || detectedType === 'audio') {
      return {
        embedUrl: mediaUrl,
        type: detectedType,
      };
    }

    return null;
  }, [mediaUrl, type]);

  if (!embedConfig) {
    return (
      <div className={cn('rounded-lg border bg-muted p-8 text-center', className)}>
        <p className="text-muted-foreground">
          Unable to embed media.{' '}
          <a
            className="text-primary hover:underline"
            href={mediaUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            Open in new tab
          </a>
        </p>
      </div>
    );
  }

  if (embedConfig.type === 'youtube' || embedConfig.type === 'vimeo') {
    return (
      <div className={cn('relative aspect-video w-full overflow-hidden rounded-lg', className)}>
        <iframe
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
          src={embedConfig.embedUrl}
          title="Media player"
        />
      </div>
    );
  }

  if (embedConfig.type === 'video') {
    return (
      <div className={cn('relative aspect-video w-full overflow-hidden rounded-lg', className)}>
        {/* biome-ignore lint/a11y/useMediaCaption: Caption files are not available for dynamically embedded media */}
        <video className="h-full w-full" controls src={embedConfig.embedUrl}>
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }

  if (embedConfig.type === 'audio') {
    return (
      <div className={cn('rounded-lg border bg-muted p-6', className)}>
        {/* biome-ignore lint/a11y/useMediaCaption: Caption files are not available for dynamically embedded media */}
        <audio className="w-full" controls src={embedConfig.embedUrl}>
          Your browser does not support the audio tag.
        </audio>
      </div>
    );
  }

  return null;
}
