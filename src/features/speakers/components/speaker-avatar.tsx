import type { Speaker } from '@/features/speakers/types';

import { cva } from 'class-variance-authority';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui';
import { getSpeakerInitials, getSpeakerName } from '@/features/speakers/utils';
import { cn } from '@/utils';

const roundedClasses = cva('', {
  defaultVariants: {
    rounded: 'md',
  },
  variants: {
    rounded: {
      full: 'rounded-full',
      lg: 'rounded-lg',
      md: 'rounded-md',
      sm: 'rounded-sm',
    },
  },
});

const sizeClasses = cva('shrink-0', {
  defaultVariants: {
    size: 'md',
  },
  variants: {
    size: {
      lg: 'size-14',
      md: 'size-12',
      sm: 'size-10',
    },
  },
});

interface SpeakerAvatarProps {
  className?: string;
  rounded?: 'sm' | 'md' | 'lg' | 'full';
  size?: 'sm' | 'md' | 'lg';
  speaker: Pick<Speaker, 'firstName' | 'lastName' | 'imageUrl'>;
}

export function SpeakerAvatar({
  className,
  rounded,
  size,
  speaker,
}: SpeakerAvatarProps) {
  const { imageUrl } = speaker;

  return (
    <Avatar
      className={cn(
        roundedClasses({ rounded }),
        sizeClasses({ size }),
        className
      )}
      render={<figure />}
    >
      <AvatarImage alt={getSpeakerName(speaker)} src={imageUrl} />
      <AvatarFallback
        className={cn(
          roundedClasses({ rounded }),
          'bg-neutral-200 text-base text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300'
        )}
      >
        {getSpeakerInitials(speaker)}
      </AvatarFallback>
    </Avatar>
  );
}
