'use client';

import { cn } from '@/utils';
import { AudioPlayer } from './media/audio-player';
import { ExternalLinkButton } from './media/external-link-button';
import { VideoPlayer } from './media/video-player';
import { VimeoEmbed } from './media/vimeo-embed';
import { YouTubeEmbed } from './media/youtube-embed';
import { detectMediaType } from './utils';

interface MediaEmbedProps {
  className?: string;
  mediaUrl: string;
  title?: string;
}

// TODO: Does this component need 'use client'?
export function MediaEmbed({ className, mediaUrl, title = 'Media player' }: MediaEmbedProps) {
  const media = detectMediaType(mediaUrl);

  return (
    <div className={cn(className)}>
      {media.type === 'audio' && <AudioPlayer src={media.src} />}
      {media.type === 'unknown' && <ExternalLinkButton href={media.href} />}
      {media.type === 'video' && <VideoPlayer src={media.src} />}
      {media.type === 'vimeo' && <VimeoEmbed id={media.id} title={title} />}
      {media.type === 'youtube' && <YouTubeEmbed id={media.id} title={title} />}
    </div>
  );
}
