import type { Route } from 'next';
import type { ReactNode } from 'react';

import { Suspense } from 'react';

import { AreaLayout } from '@/components/layouts';
import { FormSheetSkeleton } from '@/components/ui';
import { getLoginRedirect } from '@/lib/entities/paths';
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
  await requireAdminUser(getLoginRedirect(returnPath) as Route);

  return (
    <>
      <AreaLayout>{children}</AreaLayout>
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
    <Suspense fallback={<FormSheetSkeleton />}>
      <AdminSheetFallbackContent returnPath={returnPath} sheet={sheet}>
        {children}
      </AdminSheetFallbackContent>
    </Suspense>
  );
}
