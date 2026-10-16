import type { ClipWithSpeaker } from '@/features/clips/types';

import { FeaturedVideoCard } from '@/components/featured-video-card';
import { getVideoThumbnail } from '@/components/media-embed';
import { buildClipUrl } from '@/features/clips/utils';
import { getSpeakerName } from '@/features/speakers/utils';

interface ClipFeaturedCardProps {
  clip: ClipWithSpeaker;
}

export function ClipFeaturedCard({ clip }: ClipFeaturedCardProps) {
  const href = buildClipUrl(clip.slug);
  const thumbnail = getVideoThumbnail(clip.mediaUrl);
  const speakerName = clip.speaker ? getSpeakerName(clip.speaker) : undefined;

  return (
    <FeaturedVideoCard
      actionLabel="Watch clip"
      href={href}
      sizes="(max-width: 768px) 100vw, 66vw"
      subtitle={speakerName}
      thumbnail={thumbnail}
      title={clip.title}
    />
  );
}
