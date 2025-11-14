import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type NavLinkProps = {
  isActive: boolean;
} & React.ComponentProps<typeof Link>;

export function NavLink({ href, isActive, children }: NavLinkProps) {
  return (
    <Button
      className={cn('text-lg', isActive ? 'text-primary' : 'text-foreground')}
      render={<Link href={href} />}
      variant="ghost"
    >
      {children}
    </Button>
  );
}
