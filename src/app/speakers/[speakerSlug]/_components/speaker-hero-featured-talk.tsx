import type { Speaker } from '@/features/speakers/types';
import type { Talk } from '@/features/talks/types';

import { FeaturedVideoCard } from '@/components/featured-video-card';
import { getVideoThumbnail } from '@/components/media-embed';
import { TalkCardSubtitle } from '@/features/talks/components/talk-card-subtitle';
import { buildTalkPath } from '@/features/talks/utils';

interface SpeakerHeroFeaturedTalkProps {
  speaker: Speaker;
  talk: Talk;
}

export function SpeakerHeroFeaturedTalk({
  speaker,
  talk,
}: SpeakerHeroFeaturedTalkProps) {
  const href = buildTalkPath({ speaker, slug: talk.slug });
  const thumbnail = getVideoThumbnail(talk.mediaUrl);

  return (
    <FeaturedVideoCard
      actionLabel="View details"
      href={href}
      subtitle={<TalkCardSubtitle scripture={talk.scripture} />}
      thumbnail={thumbnail}
      title={talk.title}
    />
  );
}
