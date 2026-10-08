import type { ReactNode } from 'react';

import { Suspense } from 'react';

import { LayoutSidebar } from '@/app/account/_components/layout-sidebar';
import { SidebarLayout } from '@/components/layouts';
import { Skeleton } from '@/components/ui';
import { requireCurrentUser } from '@/services/auth/server';

async function AccountContent({ children }: { children: ReactNode }) {
  await requireCurrentUser('/login?redirect=/account');

  return children;
}

export default function AccountLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarLayout
      content={
        <Suspense fallback={<Skeleton className="h-96 w-full" />}>
          <AccountContent>{children}</AccountContent>
        </Suspense>
      }
      sidebar={
        <Suspense fallback={<Skeleton className="h-48 w-full" />}>
          <LayoutSidebar />
        </Suspense>
      }
    />
  );
}
