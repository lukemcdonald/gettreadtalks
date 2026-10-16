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
        className="absolute top-0 left-0"
        render={<Link href={href} />}
        size="icon-sm"
        variant="ghost"
      >
        <ChevronLeftIcon />
      </Button>
      <div className="px-8">{children}</div>
    </div>
  );
}
