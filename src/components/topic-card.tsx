'use client';

import Link from 'next/link';

import { Card, CardDescription, CardTitle } from '@/components/ui/card';

type TopicCardProps = {
  talkCount: number;
  topic: { slug: string; title: string };
};

export function TopicCard({ talkCount, topic }: TopicCardProps) {
  return (
    <Card
      className="relative flex-row items-center gap-4 p-4"
      render={<Link href={`/topics/${topic.slug}`} />}
      variant="interactive"
    >
      <CardTitle>{topic.title}</CardTitle>
      <CardDescription>
        {talkCount} {talkCount === 1 ? 'Talk' : 'Talks'}
      </CardDescription>
    </Card>
  );
}
