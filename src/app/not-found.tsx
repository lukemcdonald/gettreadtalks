'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useAnalytics } from '@/lib/analytics';

export default function NotFound() {
  const pathname = usePathname();
  const { track } = useAnalytics();

  useEffect(() => {
    track('not_found_hit', { path: pathname });
  }, [pathname, track]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
      <h1 className="font-bold text-4xl">404</h1>
      <p className="text-muted-foreground">This page could not be found.</p>
      <Link className="text-sm underline underline-offset-4 hover:no-underline" href="/">
        Go home
      </Link>
    </div>
  );
}
