import type { Route } from 'next';
import type { ReactNode } from 'react';

import Link from 'next/link';

import { Button } from '@/components/ui';
import { cn } from '@/utils';

type NavLinkProps = {
  children: ReactNode;
  href: string;
  isActive: boolean;
};

export function NavLink({ href, isActive, children }: NavLinkProps) {
  const classes = {
    default: 'text-foreground dark:text-muted-foreground',
    active: 'text-primary dark:text-primary-foreground',
  };

  return (
    <Button
      className={cn('px-3', classes[isActive ? 'active' : 'default'])}
      render={<Link href={href as Route} />}
      size="xl"
      variant="ghost"
    >
      {children}
    </Button>
  );
}
