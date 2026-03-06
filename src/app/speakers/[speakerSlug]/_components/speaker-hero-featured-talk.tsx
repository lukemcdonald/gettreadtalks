import type { Speaker } from '@/features/speakers/types';
import type { Talk } from '@/features/talks/types';

import { getVideoThumbnail } from '@/components/media-embed';
import { MediaThumbnailCard } from '@/components/media-thumbnail-card';
import { getTalkUrl } from '@/features/talks/utils';

interface SpeakerHeroFeaturedTalkProps {
  speaker: Speaker;
  talk: Talk;
}

export function SpeakerHeroFeaturedTalk({ speaker, talk }: SpeakerHeroFeaturedTalkProps) {
  const href = getTalkUrl(speaker.slug, talk.slug);
  const thumbnail = getVideoThumbnail(talk.mediaUrl);

  return (
    <MediaThumbnailCard
      actionLabel="View details"
      href={href}
      thumbnail={thumbnail}
      title={talk.title}
    />
  );
}
