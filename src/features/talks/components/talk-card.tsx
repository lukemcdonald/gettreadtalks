'use client';

import type { Speaker } from '@/features/speakers/types';
import type { Talk } from '@/features/talks/types';
import type { ReactNode } from 'react';

import { MediaCard } from '@/components/media-card';
import { Link } from '@/components/ui/link';
import { SpeakerAvatar } from '@/features/speakers/components/speaker-avatar';
import { buildSpeakerPath, getSpeakerName } from '@/features/speakers/utils';
import { buildTalkPath, buildTalksPath } from '@/features/talks/utils';

interface TalkCardProps {
  speaker?: Pick<
    Speaker,
    'firstName' | 'imageUrl' | 'lastName' | 'slug'
  > | null;
  talk: Pick<Talk, 'description' | 'scripture' | 'slug' | 'title'>;
}

function SpeakerLink({
  children,
  slug,
}: {
  children: ReactNode;
  slug: string;
}) {
  return (
    <Link
      className="relative z-10 hover:underline"
      href={buildSpeakerPath(slug)}
    >
      {children}
    </Link>
  );
}

export function TalkCard({ speaker, talk }: TalkCardProps) {
  const speakerName = getSpeakerName(speaker);
  const accessibleLabel = speakerName
    ? `${talk.title} by ${speakerName}`
    : talk.title;
  const talkHref = speaker?.slug
    ? buildTalkPath(speaker.slug, talk.slug)
    : `${buildTalksPath()}/${talk.slug}`;

  function getSubtitle() {
    if (talk.scripture) {
      return talk.scripture;
    }
    if (speaker?.slug) {
      return <SpeakerLink slug={speaker.slug}>{speakerName}</SpeakerLink>;
    }
    return speakerName;
  }

  return (
    <MediaCard
      ariaLabel={accessibleLabel}
      data-testid="talk-card"
      href={talkHref}
      media={speaker ? <SpeakerAvatar speaker={speaker} /> : undefined}
      subtitle={getSubtitle()}
      title={talk.title}
    />
  );
}
