import type { ReactNode } from 'react';

import { ACCOUNT_NAV } from '@/app/account/nav';
import { AreaLayout } from '@/components/layouts';
import { Skeleton } from '@/components/ui';
import { UserGate } from '@/services/auth/user-gate';

export default function AccountLayout({ children }: { children: ReactNode }) {
  return (
    <UserGate
      fallback={<Skeleton className="h-96 w-full" />}
      redirect="/login?redirect=/account"
    >
      <AreaLayout label="Account" sections={ACCOUNT_NAV}>
        {children}
      </AreaLayout>
    </UserGate>
  );
}
