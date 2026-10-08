import type { Route } from 'next';
import type { ReactNode } from 'react';

import { Suspense } from 'react';

import { LayoutSidebar } from '@/app/account/_components/layout-sidebar';
import { SidebarLayout } from '@/components/layouts';
import { Skeleton } from '@/components/ui';
import { getAdminLoginRedirect } from '@/lib/entities/paths';
import { requireAdminUser } from '@/services/auth/server';

interface AdminSheetFallbackProps {
  children: ReactNode;
  returnPath: string;
  sheet: ReactNode;
}

async function AdminSheetFallbackContent({
  children,
  returnPath,
  sheet,
}: AdminSheetFallbackProps) {
  await requireAdminUser(getAdminLoginRedirect(returnPath) as Route);

  return (
    <>
      <SidebarLayout
        content={children}
        sidebar={
          <Suspense fallback={<Skeleton className="h-48 w-full" />}>
            <LayoutSidebar />
          </Suspense>
        }
      />
      {sheet}
    </>
  );
}

export function AdminSheetFallback({
  children,
  returnPath,
  sheet,
}: AdminSheetFallbackProps) {
  return (
    <Suspense fallback={<Skeleton className="h-96 w-full" />}>
      <AdminSheetFallbackContent returnPath={returnPath} sheet={sheet}>
        {children}
      </AdminSheetFallbackContent>
    </Suspense>
  );
}
