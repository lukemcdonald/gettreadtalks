import type { ReactNode } from 'react';

import { AdminGate } from '@/services/auth/admin-gate';

export default function TalksLayout({ children }: { children: ReactNode }) {
  return <AdminGate>{children}</AdminGate>;
}
