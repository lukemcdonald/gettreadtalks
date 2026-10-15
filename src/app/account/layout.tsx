import type { ReactNode } from 'react';

import { ACCOUNT_TABS } from '@/app/account/tabs';
import { AreaLayout } from '@/components/layouts';
import { Skeleton } from '@/components/ui';
import { UserGate } from '@/services/auth/user-gate';

export default function AccountLayout({ children }: { children: ReactNode }) {
  return (
    <UserGate
      fallback={<Skeleton className="h-96 w-full" />}
      redirect="/login?redirect=/account"
    >
      <AreaLayout items={ACCOUNT_TABS} label="Account">
        {children}
      </AreaLayout>
    </UserGate>
  );
}
