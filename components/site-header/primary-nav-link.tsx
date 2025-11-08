'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';

type PrimaryNavLinkProps = React.ComponentProps<typeof Link>;

export function PrimaryNavLink({ href, children }: PrimaryNavLinkProps) {
  const pathname = usePathname();
  const isActive = href === pathname;

  return (
    <Link
      href={href}
      className={cn(
        'rounded-md px-3 py-1 font-medium text-lg transition-colors',
        isActive ? 'text-primary' : 'text-foreground hover:bg-muted',
      )}
    >
      {children}
    </Link>
  );
}
