import type { ReactNode } from 'react';

import { MANAGE_NAV } from '@/app/manage/nav';
import { AuthProviderLoader } from '@/components/auth-provider-loader';
import { AreaLayout } from '@/components/layouts';
import { Skeleton } from '@/components/ui';
import { AdminGate } from '@/services/auth/admin-gate';

export default function ManageLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProviderLoader>
      <AdminGate
        fallback={<Skeleton className="h-96 w-full" />}
        redirect="/login?redirect=/manage"
      >
        <AreaLayout items={MANAGE_NAV} label="Manage">
          {children}
        </AreaLayout>
      </AdminGate>
    </AuthProviderLoader>
  );
}
