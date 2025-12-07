'use client';

import type { Speaker } from '@/features/speakers/types';
import type { Talk } from '@/features/talks/types';

import Link from 'next/link';

import { MediaCard } from '@/components/media-card';
import { SpeakerAvatar } from '@/components/speaker-avatar';
import { getSpeakerName } from '@/features/speakers';
import { getTalkUrl } from '@/features/talks/utils';

type TalkCardSpeaker = {
  firstName: Speaker['firstName'];
  imageUrl?: Speaker['imageUrl'];
  lastName: Speaker['lastName'];
  slug?: Speaker['slug'];
};

type TalkCardProps = {
  featured?: boolean;
  favorited?: boolean;
  finished?: boolean;
  speaker?: TalkCardSpeaker;
  talk: Pick<Talk, 'description' | 'slug' | 'title'>;
};

function SpeakerLink({ children, slug }: { children: React.ReactNode; slug: string }) {
  return (
    <Link className="relative z-10 hover:underline" href={`/speakers/${slug}`}>
      {children}
    </Link>
  );
}

export function TalkCard({ featured, favorited, finished, speaker, talk }: TalkCardProps) {
  const speakerName = getSpeakerName(speaker);
  const accessibleLabel = speakerName ? `${talk.title} by ${speakerName}` : talk.title;
  const statusLabels = [featured && 'Featured', favorited && 'Favorited', finished && 'Finished'];
  const statusLabel = statusLabels.filter(Boolean).join(', ');
  const talkHref = speaker?.slug ? getTalkUrl(speaker.slug, talk.slug) : `/talks/${talk.slug}`;

  return (
    <MediaCard
      ariaLabel={accessibleLabel}
      data-status={statusLabel}
      href={talkHref}
      media={speaker ? <SpeakerAvatar speaker={speaker} /> : undefined}
      subtitle={
        speaker?.slug ? <SpeakerLink slug={speaker.slug}>{speakerName}</SpeakerLink> : speakerName
      }
      title={talk.title}
    />
  );
}
