import { ExternalLinkIcon } from 'lucide-react';

import { Link } from '@/components/ui';
import { cn } from '@/utils';

interface SpeakerMinistryLinkProps {
  ministry?: string;
  websiteUrl?: string;
  className?: string;
}

export function SpeakerMinistryLink({ ministry, websiteUrl, className }: SpeakerMinistryLinkProps) {
  if (ministry && websiteUrl) {
    return (
      <Link
        className={cn(
          'inline-flex items-center gap-1.5 transition-colors hover:underline',
          className,
        )}
        href={websiteUrl}
        target="_blank"
      >
        {ministry}
        <ExternalLinkIcon className="size-3.5" />
      </Link>
    );
  }

  if (ministry) {
    return <span className={className}>{ministry}</span>;
  }

  if (websiteUrl) {
    return (
      <Link
        className={cn(
          'inline-flex items-center gap-1.5 transition-colors hover:text-white',
          className,
        )}
        href={websiteUrl}
        target="_blank"
      >
        Website
        <ExternalLinkIcon className="size-3.5" />
      </Link>
    );
  }

  return null;
}
