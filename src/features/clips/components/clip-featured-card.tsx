import type { ClipWithSpeaker } from '@/features/clips/types';

import { getVideoThumbnail } from '@/components/media-embed';
import { MediaThumbnailCard } from '@/components/media-thumbnail-card';
import { getSpeakerName } from '@/features/speakers/utils';

interface ClipFeaturedCardProps {
  clip: ClipWithSpeaker;
}

export function ClipFeaturedCard({ clip }: ClipFeaturedCardProps) {
  const href = `/clips/${clip.slug}`;
  const thumbnail = getVideoThumbnail(clip.mediaUrl);
  const speakerName = clip.speaker ? getSpeakerName(clip.speaker) : undefined;

  return (
    <MediaThumbnailCard
      actionLabel="Watch clip"
      href={href}
      sizes="(max-width: 768px) 100vw, 66vw"
      subtitle={speakerName}
      thumbnail={thumbnail}
      title={clip.title}
    />
  );
}
