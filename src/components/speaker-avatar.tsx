import type { Speaker } from '@/features/speakers/types';

import { cva } from 'class-variance-authority';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui';
import { getSpeakerInitials, getSpeakerName } from '@/features/speakers';
import { cn } from '@/utils';

const roundedClasses = cva('', {
  variants: {
    rounded: {
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg',
      full: 'rounded-full',
    },
  },
  defaultVariants: {
    rounded: 'md',
  },
});

const sizeClasses = cva('shrink-0', {
  variants: {
    size: {
      sm: 'size-10',
      md: 'size-12',
      lg: 'size-14',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

type SpeakerAvatarSpeaker = {
  firstName: Speaker['firstName'];
  imageUrl?: Speaker['imageUrl'];
  lastName: Speaker['lastName'];
};

type SpeakerAvatarProps = {
  className?: string;
  rounded?: 'sm' | 'md' | 'lg' | 'full';
  size?: 'sm' | 'md' | 'lg';
  speaker: SpeakerAvatarSpeaker;
};

export function SpeakerAvatar({ className, rounded, size, speaker }: SpeakerAvatarProps) {
  const { imageUrl } = speaker;

  return (
    <Avatar
      className={cn(roundedClasses({ rounded }), sizeClasses({ size }), className)}
      render={<figure />}
    >
      <AvatarImage alt={getSpeakerName(speaker)} src={imageUrl} />
      <AvatarFallback className={cn(roundedClasses({ rounded }), 'text-base')}>
        {getSpeakerInitials(speaker)}
      </AvatarFallback>
    </Avatar>
  );
}
