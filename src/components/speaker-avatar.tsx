import type { Speaker } from '@/features/speakers/types';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getSpeakerInitials, getSpeakerName } from '@/features/speakers';

type SpeakerAvatarProps = {
  speaker: Pick<Speaker, 'firstName' | 'lastName' | 'imageUrl' | 'slug'>;
};

export function SpeakerAvatar({ speaker }: SpeakerAvatarProps) {
  const { imageUrl } = speaker;

  return (
    <Avatar className="size-16 shrink-0" render={<figure />}>
      {imageUrl && <AvatarImage alt={getSpeakerName(speaker)} src={imageUrl} />}
      <AvatarFallback className="text-base">{getSpeakerInitials(speaker)}</AvatarFallback>
    </Avatar>
  );
}
