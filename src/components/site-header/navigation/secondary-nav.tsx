import dynamic from 'next/dynamic';
import { Suspense } from 'react';

import { AccountMenuServer } from '@/components/site-header/account-menu/account-menu-server';
import { AccountMenuSkeleton } from '@/components/site-header/account-menu/account-menu-skeleton';
import { ModeSwitcher } from '@/components/site-header/mode-switcher';
import { HeaderSearchFallback } from '@/features/search/components/header-search';
import { cn } from '@/utils';

const HeaderSearchLive = dynamic(
  () =>
    import('@/features/search/components/header-search/header-search-live').then(
      (mod) => mod.HeaderSearchLive
    ),
  {
    loading: () => <HeaderSearchFallback />,
    ssr: false,
  }
);

interface SecondaryNavProps {
  className?: string;
}

export function SecondaryNav({ className }: SecondaryNavProps) {
  return (
    <div className={cn('flex items-center', className)}>
      <HeaderSearchLive />
      <ModeSwitcher className="hidden size-10 md:flex" />
      <Suspense fallback={<AccountMenuSkeleton />}>
        <AccountMenuServer />
      </Suspense>
    </div>
  );
}
