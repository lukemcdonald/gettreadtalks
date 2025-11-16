import type { User } from '@/lib/services/auth/types';

import { AccountMenu } from '@/components/site-header/account-menu/account-menu';
import { ModeSwitcher } from '@/components/site-header/mode-switcher';

type SecondaryNavProps = {
  initialUser?: User;
};

export function SecondaryNav({ initialUser }: SecondaryNavProps) {
  return (
    <div className="flex items-center">
      <AccountMenu initialUser={initialUser} />
      <ModeSwitcher className="hidden size-10 md:flex" />
    </div>
  );
}
