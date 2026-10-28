import type { Speaker } from '@/features/speakers/types';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui';
import { getSpeakerAvatarUrl } from '@/features/speakers/get-speaker-avatar-url';
import { getSpeakerInitials, getSpeakerName } from '@/features/speakers/utils';

interface CollectionCardSpeakerProps {
  speaker: Pick<Speaker, 'firstName' | 'imageUrl' | 'lastName' | 'slug'>;
}

export function CollectionCardSpeaker({ speaker }: CollectionCardSpeakerProps) {
  const imageUrl = getSpeakerAvatarUrl(speaker);
  const speakerInitials = getSpeakerInitials(speaker);
  const speakerName = getSpeakerName(speaker);

  return (
    <Avatar className="border-background size-10 border-2" key={speaker.slug}>
      {!!imageUrl && <AvatarImage alt={speakerName} src={imageUrl} />}
      <AvatarFallback className="text-xs">{speakerInitials}</AvatarFallback>
    </Avatar>
  );
}
