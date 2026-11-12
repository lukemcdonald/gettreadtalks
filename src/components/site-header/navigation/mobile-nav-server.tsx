import { navigation } from 'next/cache';

import { MobileNav } from '@/components/site-header/navigation/mobile-nav';
import { getCurrentUser } from '@/services/auth/server';

export async function MobileNavServer({ className }: { className?: string }) {
  await navigation();

  return (
    <MobileNav className={className} initialUser={await getCurrentUser()} />
  );
}
