import type { ReactNode } from 'react';

import { Suspense } from 'react';

import { LayoutSidebar } from '@/app/account/_components/layout-sidebar';
import { SidebarLayout } from '@/components/layouts';
import { Skeleton } from '@/components/ui';
import { UserGate } from '@/services/auth/user-gate';

export default function AccountLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarLayout
      content={
        <UserGate
          fallback={<Skeleton className="h-96 w-full" />}
          redirect="/login?redirect=/account"
        >
          {children}
        </UserGate>
      }
      sidebar={
        <Suspense fallback={<Skeleton className="h-48 w-full" />}>
          <LayoutSidebar />
        </Suspense>
      }
    />
  );
}
