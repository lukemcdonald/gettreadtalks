import { PrimaryNavLink } from '@/components/site-header/primary-nav-link';

const NAVIGATION_LINKS = [
  { label: 'Talks', href: '/talks' },
  { label: 'Speakers', href: '/speakers' },
  { label: 'Collections', href: '/collections' },
  { label: 'Clips', href: '/clips' },
] as const;

export function PrimaryNav() {
  return (
    <nav className="flex items-center">
      {NAVIGATION_LINKS.map((link) => (
        <PrimaryNavLink key={link.href} href={link.href}>
          {link.label}
        </PrimaryNavLink>
      ))}
    </nav>
  );
}
