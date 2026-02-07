'use client';

import { Card } from '@/components/ui';
import { FauxLink } from '@/components/ui/link';
import { cn } from '@/utils';

interface TopicViewAllCardProps {
  slug: string;
  talkCount: number;
  title: string;
}

/**
 * Compact card shown at the end of a topic scroll section to view all talks.
 */
export function TopicViewAllCard({ slug, talkCount, title }: TopicViewAllCardProps) {
  return (
    <Card
      className={cn(
        'card-interactive group relative flex-col gap-1.5 p-4 text-center hover:border-primary',
      )}
    >
      <FauxLink aria-label={`View all talks about ${title}`} href={`/topics/${slug}`} />
      <div className="text-muted-foreground text-xs">View all</div>
      <div className="font-medium text-sm">{talkCount} talks</div>
    </Card>
  );
}
