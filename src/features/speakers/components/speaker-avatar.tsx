import type { Speaker } from '@/features/speakers/types';

import { cva } from 'class-variance-authority';
import Image from 'next/image';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui';
import { getSpeakerAvatarUrl } from '@/features/speakers/get-speaker-avatar-url';
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
      '2xl': 'size-28 md:size-32',
      lg: 'size-14',
      md: 'size-12',
      sm: 'size-10',
      xl: 'size-20 md:size-24',
      xs: 'size-6',
    },
  },
});

const avatarPixelSize = {
  '2xl': 128,
  lg: 56,
  md: 48,
  sm: 40,
  xl: 96,
  xs: 24,
} as const;

interface SpeakerAvatarProps {
  className?: string;
  rounded?: 'sm' | 'md' | 'lg' | 'full';
  size?: '2xl' | 'lg' | 'md' | 'sm' | 'xl' | 'xs';
  speaker: Pick<Speaker, 'firstName' | 'lastName'> &
    Partial<Pick<Speaker, 'slug'>>;
}

export function SpeakerAvatar({
  className,
  rounded,
  size,
  speaker,
}: SpeakerAvatarProps) {
  const imageUrl = getSpeakerAvatarUrl(speaker);
  const speakerName = getSpeakerName(speaker);
  const pixelSize = avatarPixelSize[size ?? 'md'];

  return (
    <Avatar
      className={cn(
        roundedClasses({ rounded }),
        sizeClasses({ size }),
        className
      )}
      render={<figure />}
    >
      <AvatarFallback
        className={cn(
          roundedClasses({ rounded }),
          'bg-neutral-200 text-base text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300'
        )}
      >
        {getSpeakerInitials(speaker)}
      </AvatarFallback>
      {!!imageUrl && (
        <AvatarImage
          alt={speakerName}
          keepMounted
          render={
            <Image
              alt={speakerName}
              height={pixelSize}
              src={imageUrl}
              width={pixelSize}
            />
          }
          src={imageUrl}
        />
      )}
    </Avatar>
  );
}
