'use client';

import type { Topic } from '@/features/topics/types';

import { Card, CardDescription, CardTitle } from '@/components/ui';
import { FauxLink } from '@/components/ui/link';

interface TopicCardProps {
  talkCount: number;
  topic: Pick<Topic, 'slug' | 'title'>;
}

export function TopicCard({ talkCount, topic }: TopicCardProps) {
  return (
    <Card className="card-interactive relative flex-row items-center justify-between gap-4 p-4 [contain-intrinsic-size:auto_56px] [content-visibility:auto]">
      <CardTitle className="text-balance">
        <FauxLink href={`/topics/${topic.slug}`}>{topic.title}</FauxLink>
      </CardTitle>
      <CardDescription>
        {talkCount} {talkCount === 1 ? 'Talk' : 'Talks'}
      </CardDescription>
    </Card>
  );
}
