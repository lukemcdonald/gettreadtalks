import type { Route } from 'next';
import type { ReactNode } from 'react';

import { Button } from '@/components/ui';
import { Link } from '@/components/ui/link';
import { cn } from '@/utils';

interface NavLinkProps {
  children: ReactNode;
  'data-testid'?: string;
  href: string;
  isActive: boolean;
}

export function NavLink({
  children,
  'data-testid': testId,
  href,
  isActive,
}: NavLinkProps) {
  const classes = {
    active: 'text-primary dark:text-primary-foreground',
    default: 'text-foreground dark:text-muted-foreground',
  };

  return (
    <Button
      className={cn('px-3', classes[isActive ? 'active' : 'default'])}
      data-testid={testId ?? `nav-${href.replace(/^\//u, '')}`}
      render={<Link href={href as Route} />}
      size="xl"
      variant="ghost"
    >
      {children}
    </Button>
  );
}
