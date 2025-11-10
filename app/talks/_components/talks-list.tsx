'use client';

import type { Doc } from '@/convex/_generated/dataModel';

import Link from 'next/link';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface TalksListProps {
  talks: Doc<'talks'>[];
}

export function TalksList({ talks }: TalksListProps) {
  if (talks.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <p className="text-muted-foreground">No talks found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {talks.map((talk) => (
        <Card key={talk._id} render={<Link href={`/talks/${talk.slug}`} />}>
          <div className="flex items-start justify-between gap-4">
            <CardHeader className="flex-1">
              <CardTitle>{talk.title}</CardTitle>
              {talk.description && <CardDescription>{talk.description}</CardDescription>}
            </CardHeader>
            <CardContent className="flex items-center gap-2">
              {talk.featured && (
                <span className="rounded bg-primary/10 px-2 py-1 font-medium text-primary text-xs">
                  Featured
                </span>
              )}
              <span
                className="rounded px-2 py-1 font-medium text-xs"
                style={{
                  backgroundColor:
                    talk.status === 'published'
                      ? 'hsl(var(--success) / 0.1)'
                      : talk.status === 'backlog'
                        ? 'hsl(var(--warning) / 0.1)'
                        : 'hsl(var(--muted) / 0.5)',
                  color:
                    talk.status === 'published'
                      ? 'hsl(var(--success))'
                      : talk.status === 'backlog'
                        ? 'hsl(var(--warning))'
                        : 'hsl(var(--muted-foreground))',
                }}
              >
                {talk.status}
              </span>
            </CardContent>
          </div>
        </Card>
      ))}
    </div>
  );
}
