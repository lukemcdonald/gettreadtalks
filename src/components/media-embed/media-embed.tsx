import type { MediaTrackingContext } from './types';

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
  trackingContext?: MediaTrackingContext;
}

export function MediaEmbed({
  className,
  mediaUrl,
  title = 'Media player',
  trackingContext,
}: MediaEmbedProps) {
  const media = detectMediaType(mediaUrl);
  const isMediaPlayer = media.type !== 'unknown';

  return (
    <div className={cn(isMediaPlayer && 'pb-4 sm:pb-6 md:pb-8', className)}>
      {media.type === 'audio' && <AudioPlayer src={media.src} trackingContext={trackingContext} />}
      {media.type === 'unknown' && (
        <ExternalLinkButton className="rounded-full" href={media.href} label="Open Media" />
      )}
      {media.type === 'video' && <VideoPlayer src={media.src} trackingContext={trackingContext} />}
      {media.type === 'vimeo' && <VimeoEmbed id={media.id} title={title} />}
      {media.type === 'youtube' && <YouTubeEmbed id={media.id} title={title} />}
    </div>
  );
}
