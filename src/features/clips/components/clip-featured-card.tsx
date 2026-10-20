import type { ClipWithSpeaker } from '@/features/clips/types';

import { FeaturedVideoCard } from '@/components/featured-video-card';
import { getVideoThumbnail } from '@/components/media-embed';
import { buildClipPath } from '@/features/clips/utils';
import { getSpeakerName } from '@/features/speakers/utils';
import { TalkCardSubtitle } from '@/features/talks/components/talk-card-subtitle';

interface ClipFeaturedCardProps {
  clip: ClipWithSpeaker;
}

export function ClipFeaturedCard({ clip }: ClipFeaturedCardProps) {
  const href = buildClipPath(clip);
  const thumbnail = getVideoThumbnail(clip.mediaUrl);
  const speakerName = clip.speaker ? getSpeakerName(clip.speaker) : undefined;

  return (
    <FeaturedVideoCard
      actionLabel="Watch clip"
      href={href}
      sizes="(max-width: 768px) 100vw, 66vw"
      subtitle={
        <TalkCardSubtitle
          scripture={clip.scripture}
          speakerName={speakerName}
        />
      }
      thumbnail={thumbnail}
      title={clip.title}
    />
  );
}
