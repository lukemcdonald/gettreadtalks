'use client';

import Link from 'next/link';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type TopicCardProps = {
  topic: {
    _id: string;
    slug: string;
    title: string;
  };
  talkCount: number;
};

export function TopicCard({ talkCount, topic }: TopicCardProps) {
  return (
    <Card
      className="group min-w-0 transition-all hover:shadow-md"
      render={<Link href={`/topics/${topic.slug}`} />}
    >
      <CardHeader>
        <CardTitle className="group-hover:text-primary">{topic.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm">
          {talkCount} {talkCount === 1 ? 'Talk' : 'Talks'}
        </p>
      </CardContent>
    </Card>
  );
}
