import type { ReactNode } from 'react';

import { ChevronLeftIcon } from 'lucide-react';

import { Button } from '@/components/ui';
import { Link } from '@/components/ui/link';

interface ArchiveBackLinkProps {
  children: ReactNode;
  href: string;
  label: string;
}

export function ArchiveBackLink({
  children,
  href,
  label,
}: ArchiveBackLinkProps) {
  return (
    <div className="relative">
      <Button
        aria-label={label}
        className="absolute top-1/2 left-0 z-10 -translate-y-1/2"
        render={<Link href={href} />}
        size="icon-sm"
        variant="ghost"
      >
        <ChevronLeftIcon />
      </Button>
      <div className="px-12">{children}</div>
    </div>
  );
}
