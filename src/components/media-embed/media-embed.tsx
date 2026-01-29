'use client';

import { cn } from '@/utils';
import { AudioPlayer } from './audio-player';
import { ExternalLinkButton } from './external-link-button';
import { detectMediaType } from './utils';
import { VideoPlayer } from './video-player';
import { VimeoEmbed } from './vimeo-embed';
import { YouTubeEmbed } from './youtube-embed';

interface MediaEmbedProps {
  className?: string;
  mediaUrl: string;
  title?: string;
}

export function MediaEmbed({ className, mediaUrl, title = 'Media player' }: MediaEmbedProps) {
  const media = detectMediaType(mediaUrl);

  return (
    <div className={cn(className)}>
      {media.type === 'youtube' && <YouTubeEmbed id={media.id} title={title} />}
      {media.type === 'vimeo' && <VimeoEmbed id={media.id} title={title} />}
      {media.type === 'audio' && <AudioPlayer src={media.src} />}
      {media.type === 'video' && <VideoPlayer src={media.src} />}
      {media.type === 'unknown' && <ExternalLinkButton href={media.href} />}
    </div>
  );
}
