'use client';

import type { ReactNode } from 'react';
import type { Speaker } from '@/features/speakers/types';
import type { Talk } from '@/features/talks/types';

import Link from 'next/link';

import { MediaCard } from '@/components/media-card';
import { SpeakerAvatar } from '@/features/speakers/components/speaker-avatar';
import { getSpeakerName } from '@/features/speakers/utils';
import { getTalkUrl } from '@/features/talks/utils';

interface TalkCardProps {
  speaker?: Pick<Speaker, 'firstName' | 'imageUrl' | 'lastName' | 'slug'> | null;
  talk: Pick<Talk, 'description' | 'scripture' | 'slug' | 'title'>;
}

function SpeakerLink({ children, slug }: { children: ReactNode; slug: string }) {
  return (
    <Link className="relative z-10 hover:underline" href={`/speakers/${slug}`}>
      {children}
    </Link>
  );
}

export function TalkCard({ speaker, talk }: TalkCardProps) {
  const speakerName = getSpeakerName(speaker);
  const accessibleLabel = speakerName ? `${talk.title} by ${speakerName}` : talk.title;
  const talkHref = speaker?.slug ? getTalkUrl(speaker.slug, talk.slug) : `/talks/${talk.slug}`;

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
      href={talkHref}
      media={speaker ? <SpeakerAvatar speaker={speaker} /> : undefined}
      subtitle={getSubtitle()}
      title={talk.title}
    />
  );
}
