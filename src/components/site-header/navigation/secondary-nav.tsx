import type { User } from '@/services/auth/types';

import { AccountMenu } from '@/components/site-header/account-menu/account-menu';
import { ModeSwitcher } from '@/components/site-header/mode-switcher';
import { cn } from '@/utils';

type SecondaryNavProps = {
  className?: string;
  initialUser?: User;
};

export function SecondaryNav({ className, initialUser }: SecondaryNavProps) {
  return (
    <div className={cn('flex items-center', className)}>
      <AccountMenu initialUser={initialUser} />
      <ModeSwitcher className="hidden size-10 md:flex" />
    </div>
  );
}
