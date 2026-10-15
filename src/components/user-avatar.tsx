import type { User } from '@/services/auth/types';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui';
import { cn, getGravatarUrl } from '@/utils';

interface UserAvatarProps {
  className?: string;
  user: NonNullable<User>;
}

export function UserAvatar({ className, user }: UserAvatarProps) {
  const imageUrl =
    user.image ?? getGravatarUrl({ email: user.email, size: 96 });

  return (
    <Avatar className={cn('size-10 rounded-md', className)}>
      <AvatarImage src={imageUrl} />
      <AvatarFallback className="rounded-md">
        {user.name?.charAt(0).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
}
