import { ExternalLinkIcon } from 'lucide-react';
import Link from 'next/link';

import { cn } from '@/utils';

interface SpeakerMinistryLinkProps {
  ministry?: string;
  websiteUrl?: string;
  className?: string;
}

export function SpeakerMinistryLink({ ministry, websiteUrl, className }: SpeakerMinistryLinkProps) {
  // Ministry with website: link the ministry name
  if (ministry && websiteUrl) {
    return (
      <Link
        className={cn(
          'inline-flex items-center gap-1.5 transition-colors hover:text-white',
          className,
        )}
        href={websiteUrl}
        rel="noopener noreferrer"
        target="_blank"
      >
        {ministry}
        <ExternalLinkIcon className="size-3.5" />
      </Link>
    );
  }

  // Ministry without website: plain text
  if (ministry) {
    return <span className={className}>{ministry}</span>;
  }

  // No ministry but has website: show website link
  if (websiteUrl) {
    return (
      <Link
        className={cn(
          'inline-flex items-center gap-1.5 transition-colors hover:text-white',
          className,
        )}
        href={websiteUrl}
        rel="noopener noreferrer"
        target="_blank"
      >
        Website
        <ExternalLinkIcon className="size-3.5" />
      </Link>
    );
  }

  return null;
}
