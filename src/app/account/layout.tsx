import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { AreaLayout } from '@/components/layouts';
import { Skeleton } from '@/components/ui';
import { PRIVATE_ROBOTS } from '@/lib/metadata';
import { UserGate } from '@/services/auth/user-gate';

export const metadata: Metadata = {
  robots: PRIVATE_ROBOTS,
};

export default function AccountLayout({ children }: { children: ReactNode }) {
  return (
    <UserGate fallback={<Skeleton className="h-96 w-full" />}>
      <AreaLayout>{children}</AreaLayout>
    </UserGate>
  );
}
