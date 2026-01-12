import type { User } from '@/services/auth/types';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui';
import { getGravatarUrl } from '@/utils';

type UserAvatarProps = {
  user: NonNullable<User>;
};

export function UserAvatar({ user }: UserAvatarProps) {
  const imageUrl = user.image ?? getGravatarUrl({ email: user.email, size: 96 });

  return (
    <Avatar className="size-10 rounded-md">
      <AvatarImage src={imageUrl ?? undefined} />
      <AvatarFallback className="rounded-md">{user.name?.charAt(0).toUpperCase()}</AvatarFallback>
    </Avatar>
  );
}
