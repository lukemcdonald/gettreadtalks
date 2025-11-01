import Link from 'next/link';

import { AuthStatus } from '@/components/auth-status';
import { ModeSwitcher } from '@/components/mode-switcher';
import { getAuthUser } from '@/lib/services/auth/server';

export async function SiteHeader() {
  const initialUser = await getAuthUser();

  return (
    <header className="text-center mb-12 sticky top-0 z-10 bg-background p-4 border-b-2 border-slate-200 dark:border-slate-800 flex flex-row justify-between items-center">
      <h1 className="text-2xl">
        <Link href="/">
          <span className="text-red-600 font-extrabold">TREAD</span>
          <span className="text-black font-medium">Talks</span>
        </Link>
      </h1>
      <div className="flex items-center gap-4">
        <AuthStatus initialUser={initialUser} />
        <ModeSwitcher />
      </div>
    </header>
  );
}
