import type { Speaker } from '@/features/speakers/types';
import type { Talk } from '@/features/talks/types';

import { LinkIcon, MicIcon, PlayIcon } from 'lucide-react';

import { MediaCard } from '@/components/media-card';
import { detectMediaType } from '@/components/media-embed/utils';
import { getSpeakerName } from '@/features/speakers/utils';
import { getTalkUrl } from '@/features/talks/utils';

interface SpeakerTalkCardProps {
  speaker: Pick<Speaker, 'firstName' | 'lastName' | 'slug'>;
  talk: Pick<Talk, 'description' | 'mediaUrl' | 'scripture' | 'slug' | 'title'>;
}

function getMediaIcon(mediaUrl: string) {
  const media = detectMediaType(mediaUrl);
  if (media.type === 'video' || media.type === 'vimeo' || media.type === 'youtube') {
    return PlayIcon;
  }
  if (media.type === 'audio') {
    return MicIcon;
  }
  return LinkIcon;
}

function TalkMediaIcon({ mediaUrl }: { mediaUrl: string }) {
  const Icon = getMediaIcon(mediaUrl);

  return (
    <div className="flex size-12 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
      <Icon className="size-5" />
    </div>
  );
}

export function SpeakerTalkCard({ speaker, talk }: SpeakerTalkCardProps) {
  return (
    <MediaCard
      ariaLabel={talk.title}
      href={getTalkUrl(speaker.slug, talk.slug)}
      media={<TalkMediaIcon mediaUrl={talk.mediaUrl} />}
      subtitle={talk.scripture || getSpeakerName(speaker)}
      title={talk.title}
    />
  );
}
