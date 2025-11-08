import type { User } from '@/lib/services/auth/types';

import { CircleUser as UserIcon } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { getGravatarUrl } from '@/lib/utils/gravatar';

type FallbackType = 'initials' | 'icon';
type ImageType = 'image' | 'gravatar';

function getFallback(type: FallbackType, user: User) {
  if (user && type === 'initials') {
    return user.name?.charAt(0).toUpperCase();
  }

  return <UserIcon className="size-6" />;
}

function getImage(type: ImageType | undefined, user: User) {
  if (user && type === 'image') {
    return user.image ?? undefined;
  }

  if (user && type === 'gravatar') {
    return getGravatarUrl({ email: user?.email, size: 64 }) ?? undefined;
  }

  return undefined;
}

export function AccountMenuAvatar({
  fallbackType = 'icon',
  imageType,
  user,
}: {
  fallbackType?: FallbackType;
  imageType?: ImageType;
  user: User;
}) {
  if (!user) {
    return null;
  }

  const imageUrl = getImage(imageType, user);
  const fallback = getFallback(fallbackType, user);

  return (
    <Avatar
      className={cn(
        'group size-6 transition-all',
        imageUrl ? 'border-0 border-transparent' : '',
        imageUrl ? "[button[aria-expanded='true']_&]:outline-2" : '',
        imageUrl ? 'size-[19px] outline-2' : '',
      )}
    >
      <AvatarImage
        className={cn(
          'grayscale transition-all duration-300',
          'group-hover:grayscale-0',
          "[button[aria-expanded='true']_&]:grayscale-0",
        )}
        src={imageUrl}
        alt={user.name ?? 'User'}
      />
      <AvatarFallback className="bg-transparent">{fallback}</AvatarFallback>
    </Avatar>
  );
}
