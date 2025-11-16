'use client';

import { usePathname } from 'next/navigation';

import { NAVIGATION_LINKS } from '@/components/site-header/constants';
import { NavLink } from '@/components/site-header/navigation/nav-link';

export function PrimaryNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Primary navigation" className="flex items-center">
      {NAVIGATION_LINKS.map((link) => (
        <NavLink href={link.href} isActive={link.href === pathname} key={link.href}>
          {link.label}
        </NavLink>
      ))}
    </nav>
  );
}
