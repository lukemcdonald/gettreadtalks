import type { Route } from 'next';

import Link from 'next/link';

import { Button } from '@/components/ui';
import { cn } from '@/utils';

type NavLinkProps = {
  href: string;
  isActive: boolean;
  children: React.ReactNode;
};

export function NavLink({ href, isActive, children }: NavLinkProps) {
  return (
    <Button
      className={cn(
        'rounded-lg font-medium text-md transition-colors hover:bg-card',
        isActive
          ? 'text-primary dark:text-primary-foreground'
          : 'text-foreground dark:text-muted-foreground',
      )}
      render={<Link href={href as Route} />}
      variant="ghost"
    >
      {children}
    </Button>
  );
}
