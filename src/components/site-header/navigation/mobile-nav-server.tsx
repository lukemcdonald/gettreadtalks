import { navigation } from 'next/cache';

import { MobileNav } from '@/components/site-header/navigation/mobile-nav';
import { getCurrentUser } from '@/services/auth/server';

export async function MobileNavServer({ className }: { className?: string }) {
  await navigation();
  const user = await getCurrentUser();

  return <MobileNav className={className} initialUser={user} />;
}
