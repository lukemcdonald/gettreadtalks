'use client';

import type { Doc } from '@/convex/_generated/dataModel';

import Link from 'next/link';

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
        <Link
          className="block rounded-lg border p-4 transition-colors hover:bg-accent"
          href={`/talks/${talk.slug}`}
          key={talk._id}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h2 className="font-semibold">{talk.title}</h2>
              {talk.description && (
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                  {talk.description}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              {talk.featured && (
                <span className="rounded bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                  Featured
                </span>
              )}
              <span
                className="rounded px-2 py-1 text-xs font-medium"
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
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
