'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

import { Link } from '@/components/ui/link';
import { track } from '@/services/analytics';

export default function NotFound() {
  const pathname = usePathname();

  useEffect(() => {
    track('not_found_hit', { path: pathname });
  }, [pathname]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-4xl font-semibold">404</h1>
      <p className="text-muted-foreground">This page could not be found.</p>
      <Link
        className="text-sm underline underline-offset-4 hover:no-underline"
        href="/"
      >
        Go home
      </Link>
    </div>
  );
}
