import type { ReactNode } from 'react';

import { AreaLayout } from '@/components/layouts';
import { Skeleton } from '@/components/ui';
import { AdminGate } from '@/services/auth/admin-gate';

export default function ManageLayout({ children }: { children: ReactNode }) {
  return (
    <AdminGate
      fallback={<Skeleton className="h-96 w-full" />}
      redirect="/login?redirect=/manage"
    >
      <AreaLayout>{children}</AreaLayout>
    </AdminGate>
  );
}
