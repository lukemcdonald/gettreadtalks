import type { Speaker } from '@/features/speakers/types';
import type { Talk } from '@/features/talks/types';

import { FeaturedVideoCard } from '@/components/featured-video-card';
import { getVideoThumbnail } from '@/components/media-embed';
import { getTalkUrl } from '@/features/talks/utils';

interface SpeakerHeroFeaturedTalkProps {
  speaker: Speaker;
  talk: Talk;
}

export function SpeakerHeroFeaturedTalk({
  speaker,
  talk,
}: SpeakerHeroFeaturedTalkProps) {
  const href = getTalkUrl(speaker.slug, talk.slug);
  const thumbnail = getVideoThumbnail(talk.mediaUrl);

  return (
    <FeaturedVideoCard
      actionLabel="View details"
      href={href}
      thumbnail={thumbnail}
      title={talk.title}
    />
  );
}
