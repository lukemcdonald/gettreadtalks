'use client';

import { usePathname } from 'next/navigation';

import { NavLink } from '@/components/site-header/nav-link';

const NAVIGATION_LINKS = [
  { label: 'Talks', href: '/talks' },
  { label: 'Speakers', href: '/speakers' },
  { label: 'Collections', href: '/collections' },
  { label: 'Clips', href: '/clips' },
] as const;

export function PrimaryNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center">
      {NAVIGATION_LINKS.map((link) => (
        <NavLink key={link.href} href={link.href} isActive={link.href === pathname}>
          {link.label}
        </NavLink>
      ))}
    </nav>
  );
}
