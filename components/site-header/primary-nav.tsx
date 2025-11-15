'use client';

import { usePathname } from 'next/navigation';

import { NavLink } from '@/components/site-header/nav-link';
import { NAVIGATION_LINKS } from '@/components/site-header/navigation-links';

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
