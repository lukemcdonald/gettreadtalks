'use client';

import type { Speaker } from '@/features/speakers/types';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui';
import { getSpeakerInitials, getSpeakerName } from '@/features/speakers';

interface CollectionCardSpeakerProps {
  speaker: Pick<Speaker, 'firstName' | 'lastName' | 'imageUrl' | 'slug'>;
}

export function CollectionCardSpeaker({ speaker }: CollectionCardSpeakerProps) {
  const speakerName = getSpeakerName(speaker);
  const speakerInitials = getSpeakerInitials(speaker);

  return (
    <Avatar className="size-8 border-2 border-background" key={speaker.slug}>
      {!!speaker.imageUrl && <AvatarImage alt={speakerName} src={speaker.imageUrl} />}
      <AvatarFallback className="text-xs">{speakerInitials}</AvatarFallback>
    </Avatar>
  );
}
