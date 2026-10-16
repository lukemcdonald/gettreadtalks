import type { AuthUser } from '@/services/auth/types';

import { AccountAvatar } from '@/components/site-header/account-menu/account-avatar';
import { cn } from '@/utils';

interface AccountIdentityProps {
  className?: string;
  user: Pick<AuthUser, 'email' | 'image'>;
}

export function AccountIdentity({ className, user }: AccountIdentityProps) {
  return (
    <div className={cn('flex items-center gap-2 px-2 py-1.5', className)}>
      <AccountAvatar user={user} />
      <span className="truncate text-sm">{user.email}</span>
    </div>
  );
}
