import { Suspense } from 'react';

import { AccountMenuServer } from '@/components/site-header/account-menu/account-menu-server';
import { AccountMenuSkeleton } from '@/components/site-header/account-menu/account-menu-skeleton';
import { ModeSwitcher } from '@/components/site-header/mode-switcher';
import { HeaderSearchIsland } from '@/features/search/components/header-search/header-search-island';
import { cn } from '@/utils';

interface SecondaryNavProps {
  className?: string;
}

export function SecondaryNav({ className }: SecondaryNavProps) {
  return (
    <div className={cn('flex items-center', className)}>
      <HeaderSearchIsland />
      <ModeSwitcher className="hidden size-10 md:flex" />
      <Suspense fallback={<AccountMenuSkeleton />}>
        <AccountMenuServer />
      </Suspense>
    </div>
  );
}
