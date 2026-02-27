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
  showAvatar?: boolean;
  speaker?: Pick<Speaker, 'firstName' | 'lastName' | 'imageUrl' | 'slug'>;
  talk: Pick<Talk, 'description' | 'slug' | 'title'>;
}

function SpeakerLink({ children, slug }: { children: ReactNode; slug: string }) {
  return (
    <Link className="relative z-10 hover:underline" href={`/speakers/${slug}`}>
      {children}
    </Link>
  );
}

export function TalkCard({ showAvatar = true, speaker, talk }: TalkCardProps) {
  const speakerName = getSpeakerName(speaker);
  const accessibleLabel = speakerName ? `${talk.title} by ${speakerName}` : talk.title;
  const talkHref = speaker?.slug ? getTalkUrl(speaker.slug, talk.slug) : `/talks/${talk.slug}`;

  return (
    <MediaCard
      ariaLabel={accessibleLabel}
      href={talkHref}
      media={showAvatar && speaker ? <SpeakerAvatar speaker={speaker} /> : undefined}
      subtitle={
        speaker?.slug ? <SpeakerLink slug={speaker.slug}>{speakerName}</SpeakerLink> : speakerName
      }
      title={talk.title}
    />
  );
}
