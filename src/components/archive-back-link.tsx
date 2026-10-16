import { ChevronLeftIcon } from 'lucide-react';

import { Link } from '@/components/ui/link';

interface ArchiveBackLinkProps {
  href: string;
  label: string;
}

export function ArchiveBackLink({ href, label }: ArchiveBackLinkProps) {
  return (
    <Link
      className="text-muted-foreground hover:text-foreground focus-visible:ring-ring focus-visible:ring-offset-background mb-2 inline-flex items-center gap-1 rounded-sm text-xs font-semibold tracking-wide uppercase outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
      href={href}
    >
      <ChevronLeftIcon aria-hidden className="size-3" />
      {label}
    </Link>
  );
}
