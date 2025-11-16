import type { Route } from 'next';

import Link from 'next/link';

type FooterLinkProps = {
  children: React.ReactNode;
  href: string;
};

export function FooterLink({ children, href }: FooterLinkProps) {
  return (
    <Link
      className="text-muted-foreground transition-colors hover:text-foreground"
      href={href as Route}
    >
      {children}
    </Link>
  );
}
