'use client';

import Link from 'next/link';

import { FauxLink } from '@/components/faux-link';
import { Card, CardDescription, CardTitle } from '@/components/ui';

type TopicCardProps = {
  talkCount: number;
  topic: { slug: string; title: string };
};

export function TopicCard({ talkCount, topic }: TopicCardProps) {
  return (
    <Card className="card-interactive relative flex-row items-center gap-4 p-4">
      <CardTitle>
        <FauxLink href={`/topics/${topic.slug}`}>{topic.title}</FauxLink>
      </CardTitle>
      <CardDescription>
        {talkCount} {talkCount === 1 ? 'Talk' : 'Talks'}
      </CardDescription>
    </Card>
  );
}
