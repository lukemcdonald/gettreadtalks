import type { Speaker } from '@/features/speakers/types';
import type { Talk } from '@/features/talks/types';

import { MediaCard } from '@/components/media-card';
import { SpeakerAvatar } from '@/features/speakers/components/speaker-avatar';
import { buildSpeakerPath, getSpeakerName } from '@/features/speakers/utils';
import { TalkCardSubtitle } from '@/features/talks/components/talk-card-subtitle';
import { buildTalkPath } from '@/features/talks/utils';

interface TalkCardProps {
  headingLevel?: 2 | 3;
  speaker?: Pick<Speaker, 'firstName' | 'lastName' | 'slug'> | null;
  talk: Pick<Talk, 'scripture' | 'slug' | 'title'>;
}

export function TalkCard({ headingLevel, speaker, talk }: TalkCardProps) {
  const speakerName = getSpeakerName(speaker);
  const accessibleLabel = speakerName
    ? `${talk.title} by ${speakerName}`
    : talk.title;
  const talkHref = buildTalkPath({ speaker, slug: talk.slug });

  return (
    <MediaCard
      ariaLabel={accessibleLabel}
      data-testid="talk-card"
      headingLevel={headingLevel}
      href={talkHref}
      media={speaker ? <SpeakerAvatar speaker={speaker} /> : undefined}
      subtitle={
        <TalkCardSubtitle
          scripture={talk.scripture}
          speakerHref={
            speaker?.slug ? buildSpeakerPath({ slug: speaker.slug }) : undefined
          }
          speakerName={speakerName}
        />
      }
      title={talk.title}
    />
  );
}
