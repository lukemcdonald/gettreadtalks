import type { ReactNode } from 'react';

import { AreaLayout } from '@/components/layouts';
import { Skeleton } from '@/components/ui';
import { UserGate } from '@/services/auth/user-gate';

export default function AccountLayout({ children }: { children: ReactNode }) {
  return (
    <UserGate fallback={<Skeleton className="h-96 w-full" />}>
      <AreaLayout>{children}</AreaLayout>
    </UserGate>
  );
}
