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
    <div className="flex items-center">
      <Button
        aria-label={label}
        className="shrink-0"
        render={<Link href={href} />}
        size="icon-sm"
        variant="ghost"
      >
        <ChevronLeftIcon />
      </Button>
      <div className="min-w-0 flex-1">{children}</div>
      <div aria-hidden className="size-8 shrink-0 sm:size-7" />
    </div>
  );
}
