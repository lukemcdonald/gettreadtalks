import { Suspense } from 'react';

import { AccountMenuServer } from '@/components/site-header/account-menu/account-menu-server';
import { AccountMenuSkeleton } from '@/components/site-header/account-menu/account-menu-skeleton';
import { ModeSwitcher } from '@/components/site-header/mode-switcher';
import { cn } from '@/utils';

interface SecondaryNavProps {
  className?: string;
}

export function SecondaryNav({ className }: SecondaryNavProps) {
  return (
    <div className={cn('flex items-center', className)}>
      <Suspense fallback={<AccountMenuSkeleton />}>
        <AccountMenuServer />
      </Suspense>
      <ModeSwitcher className="hidden size-10 md:flex" />
    </div>
  );
}
