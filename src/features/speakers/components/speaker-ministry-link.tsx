'use client';

import type { SpeakerId } from '@/features/speakers/types';

import { ExternalLinkIcon } from 'lucide-react';

import { Link } from '@/components/ui';
import { track } from '@/lib/analytics';
import { cn } from '@/utils';

interface SpeakerMinistryLinkProps {
  className?: string;
  ministry?: string;
  speakerId: SpeakerId;
  speakerSlug: string;
  websiteUrl?: string;
}

export function SpeakerMinistryLink({
  className,
  ministry,
  speakerId,
  speakerSlug,
  websiteUrl,
}: SpeakerMinistryLinkProps) {
  const handleClick = (url: string, linkType: string) => {
    track('speaker_link_clicked', {
      link_type: linkType,
      speaker_id: speakerId,
      speaker_slug: speakerSlug,
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
