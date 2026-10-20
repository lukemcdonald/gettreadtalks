import type { Clip } from '@/features/clips/types';
import type { Speaker } from '@/features/speakers/types';

import { MediaCard } from '@/components/media-card';
import { buildClipPath } from '@/features/clips/utils';
import { SpeakerAvatar } from '@/features/speakers/components/speaker-avatar';
import { buildSpeakerPath, getSpeakerName } from '@/features/speakers/utils';
import { TalkCardSubtitle } from '@/features/talks/components/talk-card-subtitle';

interface ClipCardProps {
  clip: Pick<Clip, 'description' | 'slug' | 'title'> & {
    scripture?: string;
  };
  speaker?: Pick<Speaker, 'firstName' | 'lastName' | 'imageUrl' | 'slug'>;
}

export function ClipCard({ clip, speaker }: ClipCardProps) {
  const speakerName = getSpeakerName(speaker);
  const accessibleLabel = speakerName
    ? `${clip.title} by ${speakerName}`
    : clip.title;

  return (
    <MediaCard
      ariaLabel={accessibleLabel}
      className="items-center"
      href={buildClipPath(clip)}
      media={speaker ? <SpeakerAvatar speaker={speaker} /> : undefined}
      subtitle={
        <TalkCardSubtitle
          scripture={clip.scripture}
          speakerHref={
            speaker?.slug ? buildSpeakerPath({ slug: speaker.slug }) : undefined
          }
          speakerName={speakerName}
        />
      }
      title={clip.title}
    />
  );
}
