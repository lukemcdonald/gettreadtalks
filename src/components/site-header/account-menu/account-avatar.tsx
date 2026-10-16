import type { AuthUser } from '@/services/auth/types';

import { CircleUser as UserIcon } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui';
import { cn } from '@/utils';

interface AccountAvatarProps {
  className?: string;
  user: Pick<AuthUser, 'image'>;
}

export function AccountAvatar({ className, user }: AccountAvatarProps) {
  return (
    <Avatar className={cn('size-6', className)}>
      {!!user.image && <AvatarImage alt="" src={user.image} />}
      <AvatarFallback className="bg-transparent">
        <UserIcon className="size-6" />
      </AvatarFallback>
    </Avatar>
  );
}
