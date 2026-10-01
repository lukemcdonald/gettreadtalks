'use client';

import type { Speaker } from '@/features/speakers/types';

import { ExternalLinkIcon } from 'lucide-react';

import { Link } from '@/components/ui';
import { track } from '@/services/analytics';
import { cn } from '@/utils';

interface SpeakerMinistryLinkProps {
  className?: string;
  speaker: Pick<Speaker, '_id' | 'ministry' | 'slug' | 'websiteUrl'>;
}

export function SpeakerMinistryLink({
  className,
  speaker,
}: SpeakerMinistryLinkProps) {
  const { _id, ministry, slug, websiteUrl } = speaker;

  const handleClick = (url: string, linkType: string) => {
    track('speaker_link_clicked', {
      link_type: linkType,
      speaker_id: _id,
      speaker_slug: slug,
      url,
    });
  };

  if (ministry && websiteUrl) {
    return (
      <Link
        className={cn(
          'inline-flex items-center gap-1.5 transition-colors hover:underline',
          className
        )}
        href={websiteUrl}
        onClick={() => handleClick(websiteUrl, 'ministry')}
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
          className
        )}
        href={websiteUrl}
        onClick={() => handleClick(websiteUrl, 'website')}
        target="_blank"
      >
        Website
        <ExternalLinkIcon className="size-3.5" />
      </Link>
    );
  }

  return null;
}
