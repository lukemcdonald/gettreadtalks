import type { Route } from 'next';

import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { cn } from '@/utils';

type NavLinkProps = {
  href: string;
  isActive: boolean;
  children: React.ReactNode;
};

export function NavLink({ href, isActive, children }: NavLinkProps) {
  return (
    <Button
      className={cn('text-lg transition-colors', isActive ? 'text-primary' : 'text-foreground')}
      render={<Link href={href as Route} />}
      variant="ghost"
    >
      {children}
    </Button>
  );
}
