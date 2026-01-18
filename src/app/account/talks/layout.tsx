import type { ReactNode } from 'react';

import { requireAdminUser } from '@/services/auth/server';

export default async function TalksLayout({ children }: { children: ReactNode }) {
  await requireAdminUser();

  return <>{children}</>;
}
