import type { Route } from 'next';
import type { ReactNode } from 'react';

import Link from 'next/link';

interface FooterLinkProps {
  children: ReactNode;
  href: string;
}

export function FooterLink({ children, href }: FooterLinkProps) {
  return (
    <Link
      className="text-muted-foreground hover:text-foreground transition-colors"
      href={href as Route}
    >
      {children}
    </Link>
  );
}
