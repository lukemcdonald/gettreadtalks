import { Suspense } from 'react';

import { SignedOutAccountMenu } from '@/components/site-header/account-menu/account-menu';
import { AccountMenuServer } from '@/components/site-header/account-menu/account-menu-server';
import { ModeSwitcher } from '@/components/site-header/mode-switcher';
import {
  HeaderSearch,
  HeaderSearchFallback,
} from '@/features/search/components/header-search';
import { cn } from '@/utils';

interface SecondaryNavProps {
  className?: string;
}

export function SecondaryNav({ className }: SecondaryNavProps) {
  return (
    <div className={cn('flex items-center', className)}>
      <Suspense fallback={<HeaderSearchFallback />}>
        <HeaderSearch />
      </Suspense>
      <ModeSwitcher className="hidden size-10 md:flex" />
      <div className="hidden md:flex">
        <Suspense fallback={<SignedOutAccountMenu />}>
          <AccountMenuServer />
        </Suspense>
      </div>
    </div>
  );
}
