import Link from 'next/link';

import { AccountMenu } from '@/components/account-menu';
import { Logo } from '@/components/logo';
import { ModeSwitcher } from '@/components/mode-switcher';
import { getAuthUser } from '@/lib/services/auth/server';

export async function SiteHeader() {
  const initialUser = await getAuthUser();

  return (
    <header className="text-center mb-12 sticky top-0 z-10 bg-background p-4 border-b-2 border-slate-200 dark:border-slate-800 flex flex-row justify-between items-center">
      <h1 className="text-2xl flex flex-1 items-center justify-center md:items-stretch md:justify-start">
        <Link href="/" className="flex flex-shrink-0 items-center">
          <Logo className="block h-6 w-auto" />
          <span className="sr-only">TREADTalks</span>
        </Link>
      </h1>

      <nav className="flex items-center gap-6">
        <Link
          className="text-sm font-medium hover:text-foreground/80 text-foreground/60 transition-colors"
          href="/talks"
        >
          Talks
        </Link>
        <Link
          className="text-sm font-medium hover:text-foreground/80 text-foreground/60 transition-colors"
          href="/speakers"
        >
          Speakers
        </Link>
        <Link
          className="text-sm font-medium hover:text-foreground/80 text-foreground/60 transition-colors"
          href="/collections"
        >
          Collections
        </Link>
        <Link
          className="text-sm font-medium hover:text-foreground/80 text-foreground/60 transition-colors"
          href="/clips"
        >
          Clips
        </Link>
      </nav>

      <div className="flex items-center gap-4">
        <AccountMenu initialUser={initialUser} />
        <ModeSwitcher />
      </div>
    </header>
  );
}
