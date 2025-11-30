'use client';

import { usePathname } from 'next/navigation';

import { NAVIGATION_LINKS } from '@/components/site-header/constants';
import { NavLink } from '@/components/site-header/navigation/nav-link';
import { cn } from '@/utils';

type PrimaryNavProps = {
  className?: string;
};

export function PrimaryNav({ className }: PrimaryNavProps) {
  const pathname = usePathname();

  return (
    <nav aria-label="Primary navigation" className={cn('items-center', className)}>
      {NAVIGATION_LINKS.map((link) => (
        <NavLink href={link.href} isActive={link.href === pathname} key={link.href}>
          {link.label}
        </NavLink>
      ))}
    </nav>
  );
}
