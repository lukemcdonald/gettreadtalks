'use client';

import type { Topic } from '@/features/topics/types';

import { MediaCardTitle } from '@/components/media-card';
import { Card, CardDescription } from '@/components/ui';
import { FauxLink } from '@/components/ui/link';

interface TopicCardProps {
  talkCount: number;
  topic: Pick<Topic, 'slug' | 'title'>;
}

export function TopicCard({ talkCount, topic }: TopicCardProps) {
  return (
    <Card className="card-interactive relative flex-row items-center justify-between gap-4 p-4 [contain-intrinsic-size:auto_56px] [content-visibility:auto]">
      <MediaCardTitle>
        <FauxLink href={`/topics/${topic.slug}`}>{topic.title}</FauxLink>
      </MediaCardTitle>
      <CardDescription>
        {talkCount} {talkCount === 1 ? 'Talk' : 'Talks'}
      </CardDescription>
    </Card>
  );
}
